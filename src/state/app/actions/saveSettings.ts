import { Action } from "state/_types";

export const saveSettings: Action = async ({state,effects}) => {
    effects.saveLocalStorageSettings(state.settings)
}