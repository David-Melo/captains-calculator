import { Recipe, RecipeId } from 'state/app/effects/loadJsonData';

export type RecipesState = {
    itemsList: Recipe[];
    items: {
        [key: string]: Recipe
    };
    currentItemId: Recipe['id'] | null;
    currentItem: Recipe | null;
    selectedRecipeIds: RecipeId[];
    selectedRecipies: Recipe[]
}