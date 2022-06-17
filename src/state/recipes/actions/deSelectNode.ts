import { Action } from "state/_types";

export const deSelectNode: Action= async ({state}) => {
    state.recipes.currentNodeId = null
}