import React from "react";
import { useActions } from "state";
import { ProductId, Recipe, RecipeId } from "state/app/effects";
import RecipeListCard from "./RecipeListCard";

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
            {recipes.map((item,key)=>{
                return <RecipeListCard key={key} item={item} active={false} onSelect={() => handleSelect(item.id)} />
            })}
        </React.Fragment>
    )

}