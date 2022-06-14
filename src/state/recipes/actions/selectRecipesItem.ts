import { Action } from "state/_types";
import { RecipeId } from '../../app/effects/loadJsonData';

export const selectRecipesItem: Action<RecipeId> = async ({state}, recipeId) => {
    state.recipes.selectedRecipeIds = [ ...state.recipes.selectedRecipeIds, recipeId ]
}