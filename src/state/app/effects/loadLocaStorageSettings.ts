import { AppSettings } from "state/_types";

export const loadLocalStorageSettings = (): AppSettings | null => {
    try {
        const value = localStorage.getItem('app-settings');
        if (!value) return null;
        const settings: unknown = JSON.parse(value);
        if (typeof settings !== 'object' || settings === null || !('theme' in settings)) return null;
        return settings.theme === 'dark' || settings.theme === 'light' ? { theme: settings.theme } : null;
    } catch {
        // Corrupt settings or unavailable storage must not prevent startup.
        return null;
    }
}
