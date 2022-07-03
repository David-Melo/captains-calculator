import { AsyncAction } from "state/_types";
import { ProductId } from '../../app/effects/loadJsonData';

type LinkRecipeParams = {
    currentNodeId: string;
    existingNodeId: string;
    productId: ProductId;
    direction: 'input' | 'output';
}

export const linkExistingRecipe: AsyncAction<LinkRecipeParams> = async ({ state, actions }, { currentNodeId, existingNodeId, productId, direction }) => {

    // Create New Node
    let existingNode = state.recipes.nodes[existingNodeId]

    // Link Current Node
    let currentNode = state.recipes.nodes[currentNodeId]

    // New Node Exports

    if (direction==='input') {

        let existingNodeExportedProduct = existingNode.outputs[productId]
        let existingNodeExportedQuantity = existingNode.machine.isMine || existingNode.machine.isStorage ? currentNode.inputs[productId].quantity : existingNodeExportedProduct.quantity

        let currentNodeImports = currentNode.addImport(productId, existingNode.id, existingNodeExportedQuantity)

        if (currentNodeImports) {
            existingNode.addExport(productId, currentNodeId, currentNodeImports)
        }

    }

    if (direction==='output') {

        let currentNodeExportedProduct = currentNode.outputs[productId]
        let currentNodeExportedQuantity = currentNode.machine.isMine || currentNode.machine.isStorage ? existingNode.inputs[productId].quantity : currentNodeExportedProduct.quantity

        let existingNodeImports = existingNode.addImport(productId, currentNodeId, currentNodeExportedQuantity)

        if (existingNodeImports) {
            currentNode.addExport(productId, existingNodeId, existingNodeImports)
        }

    }

}