import React from "react";
import { Formik, FormikHelpers } from 'formik';
import { Alert, Box, Button, Divider, Grid, Group } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { Icon } from "@iconify/react";

import { buildFormConfig, FormConfig } from "utils/forms";

import { GenericDictionary, GenericError } from "state/_types";

import Icons from "components/ui/Icons";
import FieldRenderer from "components/forms/FieldRenderer";

type FormInlineProps<T extends GenericDictionary, I extends any> = {
    actionTitle?: string;
    formSchema: any;
    createAction?(value: any): Promise<any>;
    updateAction?(value: any): Promise<any>;
    resetAction?(): void;
    onClose?(): void;
    isLoading: boolean;
    errors: GenericError[];
    currentItemId: I | null;
    initialData: T;
    currentItemData: T | null
    autoOpen?: boolean;
    actionColor?: string;
    requiredDirty?: boolean;
    createRedirect?: string;
    validators?: GenericDictionary;
}

function FormInline<PayloadType extends GenericDictionary, IDType extends any>({
    formSchema,
    createAction,
    updateAction,
    resetAction,
    onClose,
    errors,
    currentItemId,
    currentItemData,
    initialData,
    requiredDirty = true,
    validators = {}
}: React.PropsWithChildren<FormInlineProps<PayloadType, IDType>>): React.ReactElement | null {

    const notifications = useNotifications();
    const [formMode, setFormMode] = React.useState<'create' | 'update' | null>(null);
    const [initialState] = React.useState<PayloadType>(currentItemData || initialData);
    const [formConfig, setFormConfig] = React.useState<FormConfig | null>(null)

    React.useEffect(() => {

        if (currentItemData && formMode !== 'update') {
            setFormMode('update');
            let config = buildFormConfig(formSchema, validators, 'update')
            setFormConfig(config)
        } else if (!currentItemData && formMode !== 'create') {
            setFormMode('create');
            let config = buildFormConfig(formSchema, validators, 'create')
            setFormConfig(config)
        }
    }, [formMode, formSchema, validators, currentItemData, initialData]);

    const getEditablePayload = (payload: PayloadType): PayloadType => {
        let editablePayload: GenericDictionary = {};
        Object.keys(payload).forEach((payloadKey) => {
            if (formConfig && formConfig.editable.indexOf(payloadKey) > -1) {
                editablePayload[payloadKey] = payload[payloadKey]
            }
        });
        return editablePayload as PayloadType;
    }

    const onSubmit = async (payload: PayloadType, { resetForm }: FormikHelpers<PayloadType>) => {
        let success = false;
        if (formMode === 'create' && createAction) {
            success = await createAction(payload);
            if (success) {
                notifications.showNotification({
                    icon: <Icon icon={Icons.warningCircle} width={24} />,
                    color: 'green',
                    autoClose: 1000,
                    title: 'Success!',
                    message: `${formConfig?.title || 'Item'} Created`
                })
                resetForm();
                if (onClose) {
                    onClose()
                }
            } else {
                notifications.showNotification({
                    icon: <Icon icon={Icons.warningCircle} width={24} />,
                    color: 'red',
                    autoClose: 1000,
                    title: 'Opps!',
                    message: `Could Not Create ${formConfig?.title || 'Item'}`
                })
            }
        }
        if (formMode === 'update' && currentItemId && updateAction) {
            let editablePayload = getEditablePayload(payload);
            success = await updateAction({ id: currentItemId, _set: editablePayload });
            if (success) {
                notifications.showNotification({
                    icon: <Icon icon={Icons.warningCircle} width={24} />,
                    color: 'green',
                    autoClose: 1000,
                    title: 'Success!',
                    message: `${formConfig?.title || 'Item'} Updated`
                })
                if (resetAction) resetAction();
                resetForm();
                if (onClose) {
                    onClose()
                }
            } else {
                notifications.showNotification({
                    icon: <Icon icon={Icons.warningCircle} width={24} />,
                    color: 'red',
                    autoClose: 1000,
                    title: 'Opps!',
                    message: `Could Not Update ${formConfig?.title || 'Item'}`
                })
            }
        }
    }

    const displayErrors = () => {
        if (!errors.length) return null;
        return (
            <Alert title="Error" variant="outline" m={7} color="red">
                {errors.map((error, key) => {
                    return (
                        <span key={`error-${key}`}>{error.text}</span>
                    )
                })}
            </Alert>
        )
    }

    function onKeyDown(keyEvent: any) {
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
        }
    }

    if (!formMode || !formConfig) return null;

    return (
        <React.Fragment>

            <Formik
                onKeyDown={onKeyDown}
                initialValues={initialState}
                onSubmit={onSubmit}
                validationSchema={formConfig.validationSchema}
                validateOnBlur={true}
                validateOnMount={false}
                validateOnChange={true}
            >
                {({ values, errors, handleChange, handleBlur, handleSubmit, submitForm, isSubmitting, isValid, dirty, setFieldValue }) => {

                    return (

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                        >

                            <Box>

                                <Grid gutter="xs" sx={{ margin: 0 }}>

                                    <FieldRenderer
                                        formConfig={formConfig}
                                        formMode={formMode}
                                        values={values}
                                        errors={errors}
                                        setFieldValue={setFieldValue}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    />

                                </Grid>

                                <Box>
                                    {displayErrors()}
                                </Box>

                            </Box>

                            <Divider my="sm" mt="xs" variant="dashed" />

                            <Box>
                                <Group position="right">
                                    <Group >
                                        <Button
                                            color="green"
                                            onClick={submitForm}
                                            loading={isSubmitting}
                                            disabled={requiredDirty ? !dirty || !isValid : false}
                                        >
                                            Save
                                        </Button>
                                    </Group>
                                </Group>
                            </Box>

                        </Box>

                    )
                }}

            </Formik>

        </React.Fragment>
    )

}

export default FormInline;