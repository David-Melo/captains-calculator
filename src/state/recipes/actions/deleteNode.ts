import { AsyncAction } from "state/_types";
import ProductionNode, { RecipeIOExport, RecipeIOImport } from "../ProductionNode";

export const deleteNode: AsyncAction<string> = async ({ state, actions }, nodeId) => {
    
    let currentNode = state.recipes.nodes[nodeId]

    Object.values(currentNode.inputs).forEach(input=>{
        input.imports.forEach(item=>{

            let sourceNodeId = item.source
            let sourceNode = state.recipes.nodes[sourceNodeId]

            console.log('0',sourceNodeId,input.id)

            sourceNode.removeExport(input.id, nodeId)

            sourceNode.outputs[input.id].maxed = false

        })
    })

    await new Promise(resolve=>setTimeout(resolve,100))

    Object.values(currentNode.outputs).forEach(output=>{
        output.exports.forEach(item=>{

            let targetNodeId = item.target
            let targetNode = state.recipes.nodes[targetNodeId]

            let deletedLinks: RecipeIOImport['imports'] = []

            console.log('1',targetNodeId,output.id)

            let updatedImports = targetNode.inputs[output.id].imports.filter(i=>{
                if (i.source===nodeId) {
                    deletedLinks.push(i)
                    return false
                }
                return true
            })

            let importAmountToDelete = 0

            deletedLinks.forEach(l=>{
                importAmountToDelete = importAmountToDelete + l.quantity
            })

            targetNode.inputs[output.id].maxed = false
            targetNode.inputs[output.id].imported = 0
            targetNode.inputs[output.id].imports = []

            updatedImports.forEach(i=>{

                let sourceNode = state.recipes.nodes[i.source]

                sourceNode.removeExport(output.id, targetNodeId)

                actions.recipes.linkExistingRecipe({
                    currentNodeId: i.source,
                    existingNodeId: targetNodeId,
                    productId: output.id,
                    direction: 'output'
                })

            })
            
        })
    })

    await new Promise(resolve=>setTimeout(resolve,100))

    let remainingNodes: { [index: string]: ProductionNode } = {}

    Object.keys(state.recipes.nodes).forEach(nodeKey=>{
        if ( nodeKey !== nodeId) {
            remainingNodes[nodeKey] = state.recipes.nodes[nodeKey]
        }
    })

    state.recipes.nodes = remainingNodes

}