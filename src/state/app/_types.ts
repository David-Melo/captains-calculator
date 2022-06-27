export type AppSettings = {
    theme: 'dark' | 'light';
}

export type AppState = {
    settings: AppSettings;
    loading: boolean;
    navigating: boolean;
    version: string | null;
}
