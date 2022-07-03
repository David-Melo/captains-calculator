import React from "react";
import { Text, Alert } from '@mantine/core';
import { useActions, useAppState } from "state";
import {  Recipe, RecipeId } from "state/app/effects";
import RecipeListCard from "./RecipeListCard";
import { RecipeIOExport, RecipeIOExportProduct, RecipeIOImport, RecipeIOImportProduct } from "state/recipes/ProductionNode";

type RecipeSelectProps = {
    direction: 'input' | 'output';
    currentNodeId: string;
    product: RecipeIOImportProduct | RecipeIOExportProduct;
    label: string;
    recipes: Recipe[];
    onSelect(): void;
}

export const NodeRecipeLink: React.FC<RecipeSelectProps> = ({ direction, currentNodeId, product, recipes, label, onSelect }) => {

    const allNodes = useAppState(state=>state.recipes.nodesList)
    const linkRecipe = useActions().recipes.linkRecipe
    const linkExistingRecipe = useActions().recipes.linkExistingRecipe

    // const checkIfAvailable = (recipe: Recipe): boolean => {
    //     if (direction === 'output') {
    //         let exportedProduct = product as RecipeIOExportProduct
    //         let availableToExport = exportedProduct.quantity - exportedProduct.exported
    //         let destinationInput = recipe.inputs.find(i=>i.id===exportedProduct.id)
    //         let destinationMachine = allMachines[recipe.machine]
    //         let currentNode = allNodes[currentNodeId]
    //         if (currentNode.machine.isStorage || currentNode.machine.isMine) return true
    //         if (destinationMachine.isStorage || destinationMachine.isMine) return true
    //         if (destinationInput) {
    //             return availableToExport <= destinationInput.quantity
    //         }
    //     }
    //     return true;
    // }

    const handleLinkNewNode = (newNodeId: RecipeId) => {
        linkRecipe({
            currentNodeId,
            newNodeId,
            direction,
            productId: product.id,
        })
        onSelect()
    }

    const handleLinkExistingNode = (existingNodeId: string) => {
        linkExistingRecipe({
            currentNodeId,
            existingNodeId,
            direction,
            productId: product.id,
        })
        onSelect()
    }

    if (!recipes) {
        return (
            <Alert title="Oops!" color="red">
                <Text>{`No ${direction === 'input' ? 'Input Recipe' : 'Output Recipe'} Available For ${label}`}</Text>
            </Alert>
        )
    }

    let existingNodes = allNodes.filter(node=>{
        
        let isNotCurrentNode = node.id !== currentNodeId
        let destinationProduct = direction === 'output' ? node['inputs'][product.id]  : node['outputs'][product.id]       
        let isMatchingProduct = !!destinationProduct
       
        let isNotAlreadyLinked  = true
        let isNotMaxedOut = true

        if (destinationProduct && direction === 'input') {
            let existingLinks: RecipeIOExport['exports'] = []
            let nodeProduct = destinationProduct as RecipeIOExportProduct
            if(nodeProduct.hasOwnProperty('exports')) {
                existingLinks = nodeProduct.exports
            }
            existingLinks.forEach(l=>{
                if (l.target===currentNodeId) {
                    isNotAlreadyLinked = false
                }
            })
            if (nodeProduct.maxed) {
               isNotMaxedOut = false
            }
        }

        if (destinationProduct && direction === 'output') {
            let existingLinks: RecipeIOImport['imports'] = []
            let nodeProduct = destinationProduct as RecipeIOImportProduct
            if(nodeProduct.hasOwnProperty('imports')) {
                existingLinks = nodeProduct.imports
            }
            existingLinks.forEach(l=>{
                if (l.source===currentNodeId) {
                    isNotAlreadyLinked = false
                }
            })
            if (nodeProduct.maxed) {
                isNotMaxedOut = false
            }
        }
        
        return isNotCurrentNode && isMatchingProduct && isNotMaxedOut && isNotAlreadyLinked
    })

    return (
        <React.Fragment>
            {existingNodes.length?<Text>Existing Target</Text>:null}
            {existingNodes.map((item, key) => {
                return <RecipeListCard
                    key={key}
                    item={item.recipe}
                    active={false}
                    available={true}
                    onSelect={() => handleLinkExistingNode(item.id)}
                />
            })}
            <Text>New Target</Text>
            {recipes.map((item, key) => {
                return <RecipeListCard
                    key={key}
                    item={item}
                    active={false}
                    available={true}
                    onSelect={() => handleLinkNewNode(item.id)}
                />
            })}
        </React.Fragment>
    )

}