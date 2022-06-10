import { GenericDictionary } from "state/_types";

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