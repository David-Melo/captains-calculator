import { AppSettings } from "state/_types";

export const loadLocalStorageSettings = (): AppSettings | null => {
    const settings = localStorage.getItem('app-settings');
    return settings ? JSON.parse(settings) : settings;
}