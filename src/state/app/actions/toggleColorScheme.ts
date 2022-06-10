import { Action } from "state/_types";

export const toggleColorScheme: Action = async ({state,actions}) => {
    state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark'
    actions.saveSettings()
}