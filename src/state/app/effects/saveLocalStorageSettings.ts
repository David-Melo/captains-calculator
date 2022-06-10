import { AppSettings } from "state/_types";

export const saveLocalStorageSettings = (settings: AppSettings): void => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
}