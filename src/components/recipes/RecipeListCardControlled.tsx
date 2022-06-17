import React from "react";
import { useAppState } from "state";
import { Recipe, RecipeId } from "state/app/effects";

type RecipeSelectControlledProps = {
    recipes: Recipe[];
    onSelect(recipeId: RecipeId): void;
}

export const RecipeListCardControlled: React.FC<RecipeSelectControlledProps> = ({ recipes, onSelect }) => {

    const { items: allMachines } = useAppState(state => state.machines)
    const [selectedId, selectId] = React.useState<RecipeId | null>(null)

    const onChange = (recipeId: RecipeId) => {
        selectId(recipeId)
        onSelect(recipeId)
    }

    return null
}