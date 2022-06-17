import React from "react";
import { useReactFlow } from "react-flow-renderer";
import { useActions } from "state";
import { ProductId, Recipe, RecipeId } from "state/app/effects";
import { RecipeSelectControlled } from "./MachineRecipeSelect";

type RecipeSelectProps = {
    direction: 'input' | 'output';
    currentNodeId: RecipeId;
    productId: ProductId;
    label: string;
    recipes: Recipe[];
}

export const NodeRecipeLink: React.FC<RecipeSelectProps> = ({ direction, currentNodeId, productId, recipes, label }) => {

    const linkRecipe = useActions().recipes.linkRecipe

    const handleSelect = (newNodeId: RecipeId) => {
        linkRecipe({
            currentNodeId,
            newNodeId,
            direction,
            productId,
        })
    }

    if (!recipes) return <div>{label}</div>

    return (
        <React.Fragment>
            {recipes.length ? <RecipeSelectControlled recipes={recipes} onSelect={handleSelect} label={label} /> : null}
        </React.Fragment>
    )

}