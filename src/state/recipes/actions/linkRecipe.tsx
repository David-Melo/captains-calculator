import { Action } from "state/_types";
import { RecipeId } from '../../app/effects/loadJsonData';
import ProductionNode from "../ProductionNode";

export const linkRecipe: Action<RecipeId> = async ({state,actions}, recipeId) => {
    if (recipeId) {
        let recipe = state.recipes.items[recipeId]
        let machine = state.machines.items[recipe.machine]
        let category = state.categories.items[machine.category_id]
        let inputs = recipe.inputs.map(({id,quantity})=>({...state.products.items[id],quantity}))
        let outputs = recipe.outputs.map(({id,quantity})=>({...state.products.items[id],quantity}))
        let sources = actions.recipes.getInputSources(recipeId)
        let targets = actions.recipes.getOutputTargets(recipeId)
        let nodeParams = {
            recipe,
            machine,
            category,
            inputs,
            outputs,
            sources,
            targets
        }
        let node = new ProductionNode(nodeParams)
        state.recipes.nodes[node.id] = node
    }
}