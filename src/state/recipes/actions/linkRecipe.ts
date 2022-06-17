import { Action, AsyncAction } from "state/_types";
import { createGraphLayout } from "utils/graph";
import { ProductId, RecipeId } from '../../app/effects/loadJsonData';
import ProductionNode from "../ProductionNode";

type LinkRecipeParams = {
    currentNodeId: RecipeId;
    newNodeId: RecipeId;
    productId: ProductId;
    direction: 'input' | 'output';
}

export const linkRecipe: AsyncAction<LinkRecipeParams> = async ({ state, actions }, { currentNodeId, newNodeId, productId, direction }) => {

    // New Node Config
    let recipe = state.recipes.items[newNodeId]
    let machine = state.machines.items[recipe.machine]
    let category = state.categories.items[machine.category_id]
    let inputs = recipe.inputs.map(({ id, quantity }) => ({ ...state.products.items[id], quantity }))
    let outputs = recipe.outputs.map(({ id, quantity }) => ({ ...state.products.items[id], quantity }))
    let sources = actions.recipes.getInputSources(newNodeId)
    let targets = actions.recipes.getOutputTargets(newNodeId)
    let nodeParams = {
        recipe,
        machine,
        category,
        inputs,
        outputs,
        sources,
        targets
    }

    // Create New Node
    let newNode = new ProductionNode(nodeParams)

    // Link Current Node
    let currentNode = state.recipes.nodes[currentNodeId]

    if (direction==='input') {
        currentNode.inputs[productId].source = newNodeId
    }

    if (direction==='output') {
        currentNode.outputs[productId].target = newNodeId
    }

    // Link New Node

    if (direction==='input') {
        newNode.outputs[productId].target = currentNodeId
        
    }

    if (direction==='output') {
        newNode.inputs[productId].source = currentNodeId
    }

    state.recipes.nodes[newNode.id] = newNode

}