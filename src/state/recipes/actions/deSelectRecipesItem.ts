import { Action } from "state/_types";
import { RecipeId } from '../../app/effects/loadJsonData';

export const delectRecipesItem: Action<RecipeId|null> = async ({state}, recipeId) => {
    if (recipeId===null) {
        state.recipes.selectedRecipeIds = []
    } else {
        state.recipes.selectedRecipeIds = state.recipes.selectedRecipeIds.filter(id=>id!==recipeId)
    }
}