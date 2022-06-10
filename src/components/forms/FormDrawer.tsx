import React from "react";
import { Formik, FormikHelpers } from 'formik';
import { useModals } from "@mantine/modals";
import { Alert, Box, Button, Grid, Group, ScrollArea, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@mantine/notifications";
import { Icon } from "@iconify/react";

import { buildFormConfig, FormConfig } from "utils/forms";

import { GenericError } from "state/_types";

import Icons from "components/ui/Icons";
import FieldRenderer from "components/forms/FieldRenderer";

type GenericDictionary = {
    [index: string]: any;
}

type GenericModel = {
    id: string;
    [index: string]: any;
}

type FormDrawerProps<T extends GenericDictionary, M extends GenericModel, I extends any> = {
    actionTitle?: string;
    formSchema: any;
    createAction?(value: any): Promise<any|undefined>;
    updateAction?(value: any): Promise<any|undefined>;
    deleteAction?(value: any): Promise<any|undefined>;
    resetAction?(): void;
    onClose?(): void; 
    isLoading: boolean;
    errors: GenericError[];
    currentItemId: I | null;
    initialData: T;
    currentItemData: T | null
    autoOpen?: boolean;
    hideDelete?: boolean;
    actionColor?: string;
    requiredDirty?: boolean;
    redirectPath?: string;
    createRedirect?: boolean;
    updateRedirect?: boolean;
    deleteRedirect?: boolean;
    validators?: GenericDictionary;
}

export type FormComponentProps<T extends GenericDictionary> = {
    actionTitle?: string | undefined;
    currentItem: T | null;
    onFormReset?(): void;
    onFormAction?(): void;
    onClose?(): void;
    preselectKey?: string;
    preselectValue?: any;
    actionColor?: string;
}


function FormDrawer<PayloadType extends GenericDictionary, ModelType extends GenericModel, IDType extends any>({
    formSchema,
    createAction,
    updateAction,
    deleteAction,
    resetAction,
    onClose,
    errors,
    currentItemId,
    currentItemData,
    initialData,
    hideDelete = false,
    requiredDirty = true,
    redirectPath,
    deleteRedirect = false,
    createRedirect = false,
    updateRedirect = false,
    validators = {}
}: React.PropsWithChildren<FormDrawerProps<PayloadType, ModelType, IDType>>): React.ReactElement | null {

    const modals = useModals();
    const navigate = useNavigate();
    const notifications = useNotifications();
    const [formMode, setFormMode] = React.useState<'create' | 'update' | null>(null);
    const [initialState] = React.useState<PayloadType>(currentItemData || initialData);
    const [formConfig, setFormConfig] = React.useState<FormConfig | null>(null)

    if (!deleteAction) hideDelete = true

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

    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: 'Delete Item?',
            zIndex: 999,
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete this item? This action is destructive and cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: "No, Dont Delete" },
            confirmProps: { color: 'red' },
            onConfirm: () => handleDelete(),
        });

    const handleClose = async () => {
        if (currentItemData && resetAction) {
            resetAction();
        } else {
            if (onClose) {
                onClose()
            }
        }
    }

    const handleDelete = async () => {
        if (formMode === 'update' && currentItemId && deleteAction) {
            let success = await deleteAction({ id: currentItemId });
            if (success) {
                notifications.showNotification({
                    icon: <Icon icon={Icons.warningCircle} width={24} />,
                    color: 'green',
                    autoClose: 1000,
                    title: 'Success!',
                    message: `${formConfig?.title || 'Item'} Deleted`
                })
                if (resetAction) resetAction();
                if (onClose) {
                    onClose()
                    if (deleteRedirect&&redirectPath) {
                        navigate(redirectPath)
                    }
                }
            } else {
                notifications.showNotification({
                    icon: <Icon icon={Icons.warningCircle} width={24} />,
                    color: 'red',
                    autoClose: 1000,
                    title: 'Opps!',
                    message: `Could Not Delete ${formConfig?.title || 'Item'}`
                })
            }
        }
    }

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
        if (formMode === 'create' && createAction) {
            let newItem = await createAction(payload);
            if (newItem) {
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
                    if (createRedirect) {
                        navigate(`${redirectPath}/${newItem.id}`)
                    }
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
            let updatedItem = await updateAction({ id: currentItemId, _set: editablePayload });
            if (updatedItem) {
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
                    if (updateRedirect&&redirectPath) {
                        navigate(redirectPath)
                    }
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
                            sx={{
                                height: "calc(100% - 77px)",
                                display: "grid",
                                gridTemplateRows: "1fr auto",
                            }}
                        >

                            <Box sx={{ position: 'relative', height: '100%' }}>
                                <ScrollArea
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        bottom: 0,
                                        left: 0,
                                        right: 0
                                    }}
                                >

                                    <Box p="xl">

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

                                </ScrollArea>
                            </Box>

                            <Box sx={(theme) => ({
                                borderTop: `1px solid ${theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[5]}`,
                                padding: theme.spacing.xl
                            })}>
                                <Group position="apart">
                                    <Box>
                                        {formMode === 'update' && !hideDelete ? (
                                            <Button
                                                color="red"
                                                onClick={openDeleteModal}
                                            >
                                                Delete
                                            </Button>
                                        ) : null}
                                    </Box>
                                    <Group >
                                        <Button
                                            variant="default"
                                            onClick={handleClose}>
                                            Cancel
                                        </Button>
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

export default FormDrawer;