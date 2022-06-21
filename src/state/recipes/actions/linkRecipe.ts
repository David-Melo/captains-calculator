import { AsyncAction } from "state/_types";
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

    // @TODO

    // Create New Node
    let newNode = new ProductionNode(nodeParams)

    // Link Current Node
    let currentNode = state.recipes.nodes[currentNodeId]

    // New Node Exports
    let newNodeExportedProduct = newNode.outputs[productId]

    // Current Node Exports
    let currentNodeExportedProduct = currentNode.outputs[productId]

    if (direction==='input') {
        currentNode.inputs[productId].source = newNodeId
        currentNode.inputs[productId].imported = newNodeExportedProduct.quantity
    }

    if (direction==='output') {
        currentNode.outputs[productId].target = newNodeId
        currentNode.outputs[productId].exported = currentNodeExportedProduct.quantity
    }

    // Link New Node

    if (direction==='input') {
        newNode.outputs[productId].target = currentNodeId
        newNode.outputs[productId].exported = currentNodeExportedProduct.quantity
    }

    if (direction==='output') {
        newNode.inputs[productId].source = currentNodeId
        newNode.inputs[productId].imported = newNodeExportedProduct.quantity
    }

    state.recipes.nodes[newNode.id] = newNode

}