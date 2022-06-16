import { RecipeId } from "state/app/effects"
import { Action, ProductRecipes } from "state/_types"

export const getInputSources: Action<RecipeId,ProductRecipes> = ({state},recipeId) => {
    let recipe = state.recipes.items[recipeId]
    return recipe.inputs.reduce((inputRecipes, input) => {
        let product = state.products.items[input.id]
        let recipeSources = product.recipes.output.length ? product.recipes.output.map(recipeId => state.recipes.items[recipeId]) : []
        if (inputRecipes[input.id]) {
            return recipeSources.length ? { ...inputRecipes, [input.id]: [...inputRecipes[input.id], recipeSources] } : inputRecipes
        } else {
            return recipeSources.length ? { ...inputRecipes, [input.id]: recipeSources } : inputRecipes
        }
    }, {} as ProductRecipes)
}