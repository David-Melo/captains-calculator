import React from "react";
import { Text, Alert } from '@mantine/core';
import { useActions } from "state";
import { ProductId, Recipe, RecipeId } from "state/app/effects";
import RecipeListCard from "./RecipeListCard";

type RecipeSelectProps = {
    direction: 'input' | 'output';
    currentNodeId: RecipeId;
    productId: ProductId;
    label: string;
    recipes: Recipe[];
    onSelect(): void;
}

export const NodeRecipeLink: React.FC<RecipeSelectProps> = ({ direction, currentNodeId, productId, recipes, label, onSelect }) => {

    const linkRecipe = useActions().recipes.linkRecipe

    const handleSelect = (newNodeId: RecipeId) => {
        linkRecipe({
            currentNodeId,
            newNodeId,
            direction,
            productId,
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

    return (
        <React.Fragment>
            {recipes.map((item, key) => {
                return <RecipeListCard key={key} item={item} active={false} onSelect={() => handleSelect(item.id)} />
            })}
        </React.Fragment>
    )

}