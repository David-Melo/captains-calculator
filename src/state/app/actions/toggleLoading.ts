import { Action } from "state/_types";

export const toggleLoading: Action<boolean> = async ({state}, loading) => {
    state.loading = loading
}

export const toggleNavigating: Action<boolean> = async ({state}, navigating) => {
    state.navigating = navigating
}