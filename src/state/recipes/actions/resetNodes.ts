import { Action } from "state/_types";

export const resetNodes: Action = async ({state}) => {
    state.recipes.nodes = {}
}