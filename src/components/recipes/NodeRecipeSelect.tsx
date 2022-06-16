import React from "react";
import { useReactFlow } from "react-flow-renderer";
import { useActions } from "state";
import { Recipe, RecipeId } from "state/app/effects";
import { RecipeSelectControlled } from "./MachineRecipeSelect";

type RecipeSelectProps = {
    label: string;
    recipes: Recipe[];
}

export const NodeRecipeLink: React.FC<RecipeSelectProps> = ({ recipes, label }) => {

    const linkRecipe = useActions().recipes.linkRecipe

    const handleSelect = (recipeId: RecipeId) => {
        linkRecipe(recipeId)
    }

    return (
        <React.Fragment>
            {recipes.length ? <RecipeSelectControlled recipes={recipes} onSelect={handleSelect} label={label} /> : null}
        </React.Fragment>
    )

}