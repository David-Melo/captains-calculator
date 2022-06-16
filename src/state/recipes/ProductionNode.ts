import { Category, Machine, Product, ProductId, Recipe, RecipeId, RecipeProduct } from "state/app/effects"
import { ProductsState } from "state/_types";

type ProductionNodeParams = {
    recipe: Recipe;
    machine: Machine;
    category: Category;
    inputs: RecipeIOInput[];
    outputs: RecipeIOInput[];
}

type RecipeInput = RecipeIOInput & {
    imported: number;
}

type RecipeOutput = RecipeIOInput & {
    exported: number;
}

type RecipeIOInput = Product & RecipeProduct
type RecipeIODict = {
    [index: string]: RecipeInput | RecipeOutput
}

class ProductionNode {

    id: RecipeId;
    recipe: Recipe;
    machine: Machine;
    category: Category;
    inputs: RecipeIODict;
    outputs: RecipeIODict;

    duration: number = 60;
    machinesCount: number = 0;

    constructor( { recipe, machine, category, inputs, outputs }: ProductionNodeParams ) {
        this.id = recipe.id
        this.recipe = {...recipe}
        this.machine = {...machine}
        this.category = {...category}
        let inputProducts = inputs.reduce((items,item)=>({
            ...items, 
            [item.id]: {
                ...item,
                quantity: this.calculateProduct60(recipe.duration, item.quantity),
                imported: 0
            }
        }),{})
        let outputProducts = outputs.reduce((items,item)=>({
            ...items, 
            [item.id]: {
                ...item,
                quantity: this.calculateProduct60(recipe.duration, item.quantity),
                imported: 0
            }
        }),{})
        this.inputs = inputProducts
        this.outputs = outputProducts
    }

    calculateProduct60(originalDuration: number, quantity: number) {
        return (this.duration/originalDuration) * quantity
    }

    toJson() {
        return JSON.stringify({
            recipe: this.recipe,
            machine: this.machine,
            category: this.category,
            inputs: this.inputs,
            outputs: this.outputs,
            duration: this.duration
        })
    }

}

export default ProductionNode