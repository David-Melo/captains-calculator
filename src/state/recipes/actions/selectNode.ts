import { Action } from "state/_types";
import { RecipeId } from '../../app/effects/loadJsonData';

export const selectNode: Action<RecipeId> = async ({state}, recipeId) => {
    state.recipes.currentNodeId = recipeId
}