import { Action } from "state/_types";
import { RecipeId } from '../../app/effects/loadJsonData';

export const selectRecipe: Action<RecipeId|null> = async ({state}, recipeId) => {
    state.recipes.currentItemId = recipeId
}