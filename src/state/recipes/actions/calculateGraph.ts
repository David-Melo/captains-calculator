import { AsyncAction } from "state/_types";
import { createGraphLayout } from "utils/graph";

export const calculateGraph: AsyncAction = async ({ state, actions }) => {
    let graph = await createGraphLayout(state.recipes.nodesData, state.recipes.edgesData)
    state.recipes.graphData = graph
}