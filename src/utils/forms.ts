import * as yup from 'yup';
import { FormikTouched, FormikErrors } from 'formik';
import { GenericDictionary } from 'state/_types';

// YUP Validation Docs
// https://github.com/jquense/yup

//
// First Some TypeScript Setup
// BEING TypeScript Setup
//

/* ******************
** Basics
****************** */

export type GenericFieldProps = {
    id: string;
    label: string;
    name: string;
    onChange(value: string | number | null | React.ChangeEvent<HTMLInputElement>): void;
    onBlur?(event: React.FocusEvent<any, Element>): void;
    value: string | null;
    error: any | any[] | undefined;
    required: boolean;
    disabled: boolean;
    description: string | undefined;
    options?: { 
        label: string;
        value: string;
    }
    setValues?(key: string, value: any): void;
    setValueKeys?: string[];
    getValues?: {
        [index: string]: any;
    }
    classNames: any;
}

// The Possible Types of HTML Inputs (More to be added)
export type FormFieldType =
    | 'text'
    | 'number'
    | 'decimal'
    | 'currency'
    | 'select'
    | 'state-select'
    | 'role-select'
    | 'textarea'
    | 'date-picker'
    | 'time-picker'
    | 'checkbox'
    | 'boolean'
    | 'tenant-domain'
    | 'email'
    | 'phone'
    | 'current-location'
    | 'fuel-select'
    | 'zip'
    | 'image'
    | 'images'
    | 'vin-lookup'
    | 'year-select'
    | 'make-select'
    | 'model-lookup-select'
    | 'color-select'
    | 'client-select'
    | 'vehicle-select'
    | 'rental-period'
    | 'order-subtotal'
    | 'order-total'

// The Possible Primite Types That YUP Supports (These are not all of the, just the basic)
type YupValidationType = 'string' | 'number'

// The Generic Yup Validator
interface YupGenericValidator {
    message: string;
}

/* ******************
** The Active Validators
****************** */

// The Interface for the Field HTML Input Field Type Primitive
interface TypeValidator extends YupGenericValidator {
    value: YupValidationType
}

// The interface for the Required HTML Input Field
interface RequiredValidator extends YupGenericValidator {
    value: boolean;
}

/* ******************
** Combine The Active Validators Above
****************** */

type YupValidators = {
    type: TypeValidator;
    required: RequiredValidator;
    alphanumeric: YupGenericValidator;
}

type CustomYupValidators = {
    domain_available: YupGenericValidator;
    email_available: YupGenericValidator;
}

type AvailableValidators = keyof YupValidators & keyof CustomYupValidators

/* ******************
** The Generic Scheme Field Type
****************** */

export type FormSchemaField = {
    label: string;
    type: FormFieldType,
    grid?: number,
    default: string | number;
    options?: { value: string, label: string }[];
    editable?: boolean;
    disabled?: boolean;
    help?: string;
    validation: {
        [T in keyof YupValidators]?: YupValidators[T]
    }
}

/* ******************
** The Actual Form Schema Type
****************** */

export type FormSchema = {
    id: string;
    title: string;
    fields: {
        [index: string]: FormSchemaField
    }
}

export type FormConfig = FormSchema & {
    validationSchema: any;
    editable: string[];
}

export type CustomValidators = {
    [T in keyof CustomYupValidators]?: (value: string | undefined) => Promise<boolean>
}

//
// END TypeScript Setup
//

/* ******************
** The Actual Build Validation Utility Function
****************** */

export const buildFormConfig = (schemaInput: string | object, customValidators: CustomValidators = {}, mode: 'update' | 'create' ): FormConfig | null => {

    let currentSchema: FormSchema | null = null;

    // Lets Check For JSON or Parsed JSON
    if (typeof schemaInput === 'string') {

        try {
            let parsedJson = JSON.parse(schemaInput);
            if (typeof parsedJson === 'object') {
                currentSchema = parsedJson;
            } else {
                console.error('Parsed Schema Is Not An Object')
            }
        } catch (e) {
            console.error('Schema JSON Could Not Be Parsed')
        }

    } else if (typeof schemaInput === 'object') {

        currentSchema = schemaInput as FormSchema;

    } else {

        console.error('Invalid Schema Passed As Input')

    }

    // If We Couldn't Get The Right Schema, Just Return False
    if (!currentSchema) return null;

    // Lets Prepare To Final Config
    return {
        ...currentSchema,
        validationSchema: buildValidationSchema(currentSchema.fields, customValidators, mode),
        editable: getEditableFields(currentSchema.fields)
    }


}

const getEditableFields = (formFields: FormSchema['fields']): string[] => {

    return Object.keys(formFields).filter((fieldKey) => {
        let field = formFields[fieldKey];
        return typeof field.editable === 'undefined' || field.editable !== false;
    })

}

export const buildValidationSchema = (formFields: FormSchema['fields'], customValidators: CustomValidators, mode: 'update' | 'create' ): any => {

    let yupValidationObjectShape: { [index: string]: any } = {};

    Object.keys(formFields).forEach((fieldKey) => {

        let field = formFields[fieldKey];

        if ( field.hasOwnProperty('editable') && field.editable !== true && mode === 'update' ) return;

        if (field.validation && typeof field.validation === 'object') {

            let fieldValidator: any = null;

            Object.keys(field.validation).forEach((fieldValidationKey) => {

                let fieldValidatorKey = fieldValidationKey as keyof YupValidators
                let fieldValidatorConfig = field.validation[fieldValidatorKey];

                if (fieldValidatorConfig) {
                    let fieldValidatorObject = buildFieldValidator(fieldValidationKey as AvailableValidators, fieldValidatorConfig, field, fieldValidator, customValidators);
                    if (fieldValidatorObject) {
                        fieldValidator = fieldValidatorObject;
                    }
                }

            });

            if (fieldValidator !== null) {
                yupValidationObjectShape[fieldKey] = fieldValidator;
            }

        } else {

            console.error(`Invalid Validation Schema For Field: ${fieldKey}`);

        }

    })

    return yup.object().shape(yupValidationObjectShape);

}

const buildFieldValidator = <T extends keyof YupValidators>(fieldValidatorKey: AvailableValidators, fieldValidatorObject: YupValidators[T], field: FormSchemaField, existingFieldValidator: any, customValidators: CustomValidators) => {

    let fieldValidator = null;

    try {

        switch (fieldValidatorKey) {

            /* ******************
            ** YUP Input Type Validator
            ****************** */

            case 'type':

                let typeFieldValidatorConfig = fieldValidatorObject as YupValidators['type'];

                if (typeFieldValidatorConfig.value === 'string') {
                    let validationErrorMessage = parseValidationErrorMessage(typeFieldValidatorConfig.message, field.label) || 'Value must be a string of text';
                    fieldValidator = yup.string().typeError(validationErrorMessage);
                }

                if (typeFieldValidatorConfig.value === 'number') {
                    let validationErrorMessage = parseValidationErrorMessage(typeFieldValidatorConfig.message, field.label) || 'Value must be a number';
                    fieldValidator = yup.number().typeError(validationErrorMessage);
                }

                break;

            /* ******************
            ** YUP Required Validator
            ****************** */

            case 'required':

                let requiredFieldValidatorConfig = fieldValidatorObject as YupValidators['required'];

                if (requiredFieldValidatorConfig.value) {

                    let validationErrorMessage = parseValidationErrorMessage(requiredFieldValidatorConfig.message, field.label) || 'Value is required';

                    if (existingFieldValidator !== null) {
                        fieldValidator = existingFieldValidator.required(validationErrorMessage)
                    } else {
                        fieldValidator = yup.mixed().required(validationErrorMessage)
                    }

                }

                break;

            /* ******************
            ** YUP Domain Validator
            ****************** */

            case 'domain_available':

                let domainValidator = customValidators.hasOwnProperty('domain_available') ? customValidators.domain_available : null

                let domainValidationErrorMessage = 'Subdomain is already taken';

                if (domainValidator) {

                    if (existingFieldValidator !== null) {
                        fieldValidator = existingFieldValidator.test(fieldValidatorKey, domainValidationErrorMessage, domainValidator)
                    } else {
                        fieldValidator = yup.string().test(fieldValidatorKey, domainValidationErrorMessage, domainValidator)
                    }

                }

                break;

            /* ******************
            ** YUP Email Validator
            ****************** */

            case 'email_available':

                let emailValidator = customValidators.hasOwnProperty('email_available') ? customValidators.email_available : null

                let emailAvailableValidationErrorMessage = 'Email is already taken';

                if (emailValidator) {

                    if (existingFieldValidator !== null) {
                        fieldValidator = existingFieldValidator.test(fieldValidatorKey, emailAvailableValidationErrorMessage, emailValidator)
                    } else {
                        fieldValidator = yup.string().test(fieldValidatorKey, emailAvailableValidationErrorMessage, emailValidator)
                    }

                }

                break;

            /* ******************
            ** YUP Required Validator
            ****************** */

            case 'email':

                let emailValidationErrorMessage = 'Value is not a valid email address';

                if (existingFieldValidator !== null) {
                    fieldValidator = existingFieldValidator.email(emailValidationErrorMessage)
                } else {
                    fieldValidator = yup.string().email(emailValidationErrorMessage)
                }

                break;

            /* ******************
            ** YUP Required Validator
            ****************** */

            case 'alphanumeric':

                let alphaNumValidationErrorMessage = 'Invalid character, only letters, numbers, or hyphens allowed';

                if (existingFieldValidator !== null) {
                    fieldValidator = existingFieldValidator.matches(/^[a-z0-9-]+$/i, alphaNumValidationErrorMessage)
                } else {
                    fieldValidator = yup.string().matches(/^[a-z0-9-]+$/i, alphaNumValidationErrorMessage)
                }

                break;

            /* ******************
            ** No Matching Validator
            ****************** */

            default:
                break;

        }

    } catch (e) {
        console.log('Error Building Field Validator: ', e);
        return null;
    }

    return fieldValidator;

}

const parseValidationErrorMessage = (messageTemplate: string, fieldLabel: string): string | false => {

    if (typeof fieldLabel !== 'string') {
        console.error('Schema Field Configuration Missing Field Label');
        fieldLabel = 'Field';
    }

    let templateVariable = '{field}';

    let hasTemplateVariable = messageTemplate.indexOf(templateVariable) > -1;

    return hasTemplateVariable ? messageTemplate.replaceAll(templateVariable, fieldLabel) : false;

}

export const checkIfFieldHasRequiredValidation = (fieldSchema: FormSchemaField): boolean => {

    if (fieldSchema.validation && Object.keys(fieldSchema.validation).length) {

        return Object.keys(fieldSchema.validation).indexOf('required') > -1;

    } else {
        return false;
    }

}

export const IsValid = <T>(key: keyof T, touched: FormikTouched<T>, errors: FormikErrors<T>): boolean => {
    let isTouched = touched.hasOwnProperty(key);
    let hasError = errors.hasOwnProperty(key);
    if (!hasError || !isTouched) return true;
    if (isTouched && hasError) return false;
    return false;
}

export const FORM_PHONE_VALIDATION_REGEX = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

export const formatFieldError = (error: string | undefined) => {
    if (error) {
        return {
            content: error,
            pointing: 'left',
        }
    }
    return false;
}

export const extractCurrentItemData = <T>(initialState: GenericDictionary, currentItem: GenericDictionary): T => {
    return Object.keys(initialState).reduce((data, itemKey) => {
        if (currentItem.hasOwnProperty(itemKey)) {
            return { ...data, [itemKey]: currentItem[itemKey] === null ? '' : currentItem[itemKey] }
        } else {
            return { ...data, [itemKey]: '' };
        }
    }, {} as T)
}

export const statesList = [
    {
        value: "AL",
        label: "Alabama"
    },
    {
        value: "AK",
        label: "Alaska"
    },
    {
        value: "AS",
        label: "American Samoa"
    },
    {
        value: "AZ",
        label: "Arizona"
    },
    {
        value: "AR",
        label: "Arkansas"
    },
    {
        value: "CA",
        label: "California"
    },
    {
        value: "CO",
        label: "Colorado"
    },
    {
        value: "CT",
        label: "Connecticut"
    },
    {
        value: "DE",
        label: "Delaware"
    },
    {
        value: "DC",
        label: "District Of Columbia"
    },
    {
        value: "FM",
        label: "Federated States Of Micronesia"
    },
    {
        value: "FL",
        label: "Florida"
    },
    {
        value: "GA",
        label: "Georgia"
    },
    {
        value: "GU",
        label: "Guam"
    },
    {
        value: "HI",
        label: "Hawaii"
    },
    {
        value: "ID",
        label: "Idaho"
    },
    {
        value: "IL",
        label: "Illinois"
    },
    {
        value: "IN",
        label: "Indiana"
    },
    {
        value: "IA",
        label: "Iowa"
    },
    {
        value: "KS",
        label: "Kansas"
    },
    {
        value: "KY",
        label: "Kentucky"
    },
    {
        value: "LA",
        label: "Louisiana"
    },
    {
        value: "ME",
        label: "Maine"
    },
    {
        value: "MH",
        label: "Marshall Islands"
    },
    {
        value: "MD",
        label: "Maryland"
    },
    {
        value: "MA",
        label: "Massachusetts"
    },
    {
        value: "MI",
        label: "Michigan"
    },
    {
        value: "MN",
        label: "Minnesota"
    },
    {
        value: "MS",
        label: "Mississippi"
    },
    {
        value: "MO",
        label: "Missouri"
    },
    {
        value: "MT",
        label: "Montana"
    },
    {
        value: "NE",
        label: "Nebraska"
    },
    {
        value: "NV",
        label: "Nevada"
    },
    {
        value: "NH",
        label: "New Hampshire"
    },
    {
        value: "NJ",
        label: "New Jersey"
    },
    {
        value: "NM",
        label: "New Mexico"
    },
    {
        value: "NY",
        label: "New York"
    },
    {
        value: "NC",
        label: "North Carolina"
    },
    {
        value: "ND",
        label: "North Dakota"
    },
    {
        value: "MP",
        label: "Northern Mariana Islands"
    },
    {
        value: "OH",
        label: "Ohio"
    },
    {
        value: "OK",
        label: "Oklahoma"
    },
    {
        value: "OR",
        label: "Oregon"
    },
    {
        value: "PW",
        label: "Palau"
    },
    {
        value: "PA",
        label: "Pennsylvania"
    },
    {
        value: "PR",
        label: "Puerto Rico"
    },
    {
        value: "RI",
        label: "Rhode Island"
    },
    {
        value: "SC",
        label: "South Carolina"
    },
    {
        value: "SD",
        label: "South Dakota"
    },
    {
        value: "TN",
        label: "Tennessee"
    },
    {
        value: "TX",
        label: "Texas"
    },
    {
        value: "UT",
        label: "Utah"
    },
    {
        value: "VT",
        label: "Vermont"
    },
    {
        value: "VI",
        label: "Virgin Islands"
    },
    {
        value: "VA",
        label: "Virginia"
    },
    {
        value: "WA",
        label: "Washington"
    },
    {
        value: "WV",
        label: "West Virginia"
    },
    {
        value: "WI",
        label: "Wisconsin"
    },
    {
        value: "WY",
        label: "Wyoming"
    }
]