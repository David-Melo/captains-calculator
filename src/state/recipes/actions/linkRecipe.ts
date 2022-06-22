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

    if (direction==='input') {

        let newNodeExportedProduct = newNode.outputs[productId]

        let currentNodeImports = currentNode.addImport(productId, newNodeId, newNodeExportedProduct.quantity)

        if (currentNodeImports) {
            newNode.addExport(productId, currentNodeId, currentNodeImports)
        }

    }

    if (direction==='output') {

        let currentNodeExportedProduct = currentNode.outputs[productId]

        let newNodeImports = newNode.addImport(productId, currentNodeId, currentNodeExportedProduct.quantity)

        if (newNodeImports) {
            currentNode.addExport(productId, newNodeId, newNodeImports)
        }

    }

    state.recipes.nodes[newNode.id] = newNode

}