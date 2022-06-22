import { RecipeId } from "state/app/effects"
import { Action, ProductRecipes } from "state/_types"

export const getOutputTargets: Action<RecipeId,ProductRecipes> = ({state},recipeId) => {
    let recipe = state.recipes.items[recipeId]
    return recipe.outputs.reduce((outputRecipes, output) => {
        let product = state.products.items[output.id]
        let recipeTargets = product.recipes.input.length ? product.recipes.input.map(recipeId => state.recipes.items[recipeId]) : []
        if (outputRecipes[output.id]) {
            return recipeTargets.length ? { ...outputRecipes, [output.id]: [...outputRecipes[output.id], recipeTargets] } : outputRecipes
        } else {
            return recipeTargets.length ? { ...outputRecipes, [output.id]: recipeTargets } : outputRecipes
        }
    }, {} as ProductRecipes)
}