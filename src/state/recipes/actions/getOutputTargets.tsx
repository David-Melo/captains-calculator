import { RecipeId } from "state/app/effects"
import { Action, ProductRecipes } from "state/_types"

export const getOutputTargets: Action<RecipeId,ProductRecipes> = ({state},recipeId) => {
    let recipe = state.recipes.items[recipeId]
    return recipe.outputs.reduce((outputRecipes, output) => {
        let product = state.products.items[output.id]
        let recipeSources = product.recipes.output.length ? product.recipes.output.map(recipeId => state.recipes.items[recipeId]) : []
        if (outputRecipes[output.id]) {
            return recipeSources.length ? { ...outputRecipes, [output.id]: [...outputRecipes[output.id], recipeSources] } : outputRecipes
        } else {
            return recipeSources.length ? { ...outputRecipes, [output.id]: recipeSources } : outputRecipes
        }
    }, {} as ProductRecipes)
}