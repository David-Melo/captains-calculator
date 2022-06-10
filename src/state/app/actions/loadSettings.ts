import { Action } from "state/_types";

export const loadSettings: Action = async ({state,effects}) => {
    let settings = effects.loadLocalStorageSettings()
    if (settings) {
        state.settings = settings
    }
}