import React from "react";
import { Badge, createStyles, Grid, NumberInput, Select, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import { FormikHandlers, FormikHelpers, FormikState } from "formik";

import { GenericDictionary } from "state/_types";
import { checkIfFieldHasRequiredValidation, FormConfig, statesList } from "utils/forms";

import { generateHours } from "utils/dates";
import PhoneField from "./PhoneField";

type FieldRendererProps<PayloadType extends GenericDictionary> = {
    formConfig: FormConfig;
    formMode: 'create' | 'update' | null;
    values: FormikState<PayloadType>['values'];
    errors: FormikState<PayloadType>['errors'];
    setFieldValue: FormikHelpers<PayloadType>['setFieldValue'];
    handleBlur: FormikHandlers['handleBlur'];
    handleChange: FormikHandlers['handleChange'];
}

const userFormStyles = createStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column'
    },
    error: {
        fontSize: theme.fontSizes.xs,
        lineHeight: `${theme.fontSizes.xs + 8}px`,
        marginTop: '-20px'
    },
    wrapper: {
        marginBottom: '20px'
    },
    label: {
        fontSize: theme.fontSizes.sm,
        lineHeight: `${theme.fontSizes.sm}px`,
        display: 'inline-block',
        marginBottom: 8
    }
}))

function FieldRenderer<PayloadType extends GenericDictionary>({
    formConfig,
    formMode,
    values,
    errors,
    setFieldValue,
    handleBlur,
    handleChange
}: React.PropsWithChildren<FieldRendererProps<PayloadType>>): React.ReactElement | null {

    const { classes: styles } = userFormStyles();
    const isMobile = useMediaQuery('(max-width: 1024px)');

    return (
        <React.Fragment>

            {Object.keys(formConfig.fields).map((fieldId, key) => {

                let fieldSchema = formConfig.fields[fieldId];
                let formFieldId = fieldId as keyof PayloadType;
                let isFieldRequired = checkIfFieldHasRequiredValidation(fieldSchema);
                let isFieldEditable = formMode === 'create' ? true : formConfig.editable.indexOf(fieldId) > -1;

                const renderInput = () => {

                    switch (fieldSchema.type) {

                        case 'state-select':
                            return (
                                <Select
                                    id={formFieldId as string}
                                    label={fieldSchema.label}
                                    placeholder="Select..."
                                    data={statesList}
                                    name={formFieldId as string}
                                    onChange={(value) => setFieldValue(formFieldId as string, value)}
                                    onBlur={handleBlur}
                                    value={values[formFieldId]}
                                    error={errors[formFieldId]}
                                    required={isFieldRequired}
                                    disabled={!isFieldEditable}
                                    description={fieldSchema.help}
                                    autoComplete="address-level1"
                                    classNames={styles}
                                />
                            );

                        case 'email':
                            return (
                                <TextInput
                                    type="email"
                                    label={fieldSchema.label}
                                    id={formFieldId as string}
                                    name={formFieldId as string}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values[formFieldId]}
                                    error={errors[formFieldId]}
                                    required={isFieldRequired}
                                    disabled={!isFieldEditable}
                                    description={fieldSchema.help}
                                    classNames={styles}
                                />
                            )

                        case 'phone':
                            return (
                                <PhoneField
                                    label={fieldSchema.label}
                                    id={formFieldId as string}
                                    name={formFieldId as string}
                                    onChange={(value) => setFieldValue(formFieldId as string, value)}
                                    onBlur={handleBlur}
                                    value={values[formFieldId]}
                                    error={errors[formFieldId]}
                                    required={isFieldRequired}
                                    disabled={!isFieldEditable}
                                    description={fieldSchema.help}
                                    classNames={styles}
                                />
                            )

                        case 'year-select':
                            return (
                                <Select
                                    id={formFieldId as string}
                                    label={fieldSchema.label}
                                    placeholder="Select..."
                                    searchable
                                    data={['2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014']}
                                    name={formFieldId as string}
                                    onChange={(value) => setFieldValue(formFieldId as string, value)}
                                    onBlur={handleBlur}
                                    selectOnBlur
                                    clearable
                                    value={values[formFieldId]}
                                    error={errors[formFieldId]}
                                    required={isFieldRequired}
                                    disabled={!isFieldEditable}
                                    description={fieldSchema.help}
                                    autoComplete="off"
                                    classNames={styles}
                                />
                            );

                        case 'number':
                            return (
                                <NumberInput
                                    label={fieldSchema.label}
                                    id={formFieldId as string}
                                    name={formFieldId as string}
                                    onChange={(value) => setFieldValue(formFieldId as string, value)}
                                    value={values[formFieldId]}
                                    error={errors[formFieldId]}
                                    required={isFieldRequired}
                                    disabled={!isFieldEditable}
                                    description={fieldSchema.help}
                                    min={0}
                                    defaultValue={0}
                                    precision={0}
                                    step={1}
                                    stepHoldDelay={500}
                                    stepHoldInterval={100}
                                    onBlur={handleBlur}
                                    classNames={styles}
                                    parser={(value) => !!value ? value.replace(/\$\s?|(,*)/g, '') : ''}
                                    formatter={(value) => !!value && !Number.isNaN(parseFloat(value)) ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                                    onFocus={(event) => event.target.select()}
                                />
                            );

                        case 'zip':
                            return (
                                <NumberInput
                                    label={fieldSchema.label}
                                    id={formFieldId as string}
                                    name={formFieldId as string}
                                    onChange={(value) => setFieldValue(formFieldId as string, value?.toString())}
                                    value={(typeof values[formFieldId] !== 'undefined' && values[formFieldId] !== null && values[formFieldId].length) ? parseInt(values[formFieldId]) : values[formFieldId]}
                                    error={errors[formFieldId]}
                                    required={isFieldRequired}
                                    disabled={!isFieldEditable}
                                    description={fieldSchema.help}
                                    onBlur={handleBlur}
                                    classNames={styles}
                                    hideControls
                                />
                            );

                        case 'decimal':
                            return (
                                <NumberInput
                                    label={fieldSchema.label}
                                    id={formFieldId as string}
                                    name={formFieldId as string}
                                    onChange={(value) => setFieldValue(formFieldId as string, value)}
                                    value={values[formFieldId]}
                                    error={errors[formFieldId]}
                                    required={isFieldRequired}
                                    disabled={!isFieldEditable}
                                    description={fieldSchema.help}
                                    defaultValue={0}
                                    precision={2}
                                    min={0}
                                    step={0.01}
                                    max={1}
                                    stepHoldDelay={500}
                                    stepHoldInterval={100}
                                    onBlur={handleBlur}
                                    classNames={styles}
                                    onFocus={(event) => event.target.select()}
                                />
                            );

                        case 'date-picker':
                            let isSet = typeof values[formFieldId] === 'string' && values[formFieldId].length
                            let rawDate = new Date(Date.parse(values[formFieldId]))
                            rawDate.setMinutes(rawDate.getMinutes() + rawDate.getTimezoneOffset())
                            let dateValue = isSet ? rawDate : typeof values[formFieldId] === 'object' ? values[formFieldId] : null
                            return (
                                <DatePicker
                                    label={fieldSchema.label}
                                    id={formFieldId as string}
                                    name={formFieldId as string}
                                    onChange={(value) => setFieldValue(formFieldId as string, value)}
                                    onBlur={handleBlur}
                                    value={dateValue}
                                    error={errors[formFieldId]}
                                    required={isFieldRequired}
                                    disabled={!isFieldEditable}
                                    description={fieldSchema.help}
                                    classNames={styles}
                                    dropdownType={isMobile ? 'modal' : 'popover'}
                                    dateParser={(dateString) => new Date(Date.parse(dateString))}
                                />
                            );

                        case 'time-picker':
                            return (
                                <Select
                                    id={formFieldId as string}
                                    label={fieldSchema.label}
                                    name={formFieldId as string}
                                    onChange={(value) => setFieldValue(formFieldId as string, value)}
                                    onBlur={handleBlur}
                                    searchable
                                    clearable
                                    selectOnBlur
                                    placeholder="Select..."
                                    data={generateHours()}
                                    value={values[formFieldId]}
                                    error={errors[formFieldId]}
                                    required={isFieldRequired}
                                    disabled={!isFieldEditable}
                                    description={fieldSchema.help}
                                    autoComplete="off"
                                    classNames={styles}
                                />
                            );

                        case 'currency':
                            return (
                                <NumberInput
                                    label={fieldSchema.label}
                                    id={formFieldId as string}
                                    name={formFieldId as string}
                                    onChange={(value) => setFieldValue(formFieldId as string, value)}
                                    onBlur={handleBlur}
                                    defaultValue={0}
                                    min={0}
                                    precision={0}
                                    step={1}
                                    stepHoldDelay={500}
                                    stepHoldInterval={100}
                                    value={values[formFieldId]}
                                    error={errors[formFieldId]}
                                    required={isFieldRequired}
                                    disabled={!isFieldEditable}
                                    description={fieldSchema.help}
                                    classNames={styles}
                                    parser={(value) => !!value ? value.replace(/\$\s?|(,*)/g, '') : ''}
                                    formatter={(value) => !!value && !Number.isNaN(parseFloat(value)) ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '$ '}
                                    onFocus={(event) => event.target.select()}
                                />
                            );

                        default:
                            return (
                                <TextInput
                                    type="text"
                                    label={fieldSchema.label}
                                    id={formFieldId as string}
                                    name={formFieldId as string}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values[formFieldId]}
                                    error={errors[formFieldId]}
                                    required={isFieldRequired}
                                    disabled={!isFieldEditable}
                                    description={fieldSchema.help}
                                    classNames={styles}
                                />
                            );

                    }

                }

                let gridWidth = fieldSchema.grid ? fieldSchema.grid : 12;

                return (
                    <Grid.Col span={gridWidth} key={`${formMode}-${formConfig.id}-field-${key}`}>
                        {renderInput()}
                    </Grid.Col>
                )

            })}

        </React.Fragment>
    )

}

export default FieldRenderer;