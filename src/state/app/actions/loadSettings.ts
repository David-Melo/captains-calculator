import { Action } from "state/_types";
import { version } from '../../../../package.json'

export const loadSettings: Action = async ({state,effects}) => {
    let settings = effects.loadLocalStorageSettings()
    if (settings) {
        state.settings = settings
    }
    state.version = version
}