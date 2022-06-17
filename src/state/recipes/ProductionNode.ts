import { Category, Machine, Product, ProductId, Recipe, RecipeId, RecipeProduct } from "state/app/effects"
import { ProductRecipes, ProductsState } from "state/_types";
import { Edge, Node }  from 'react-flow-renderer';
import { generateDarkColorHex } from "utils/colors";

type ProductionNodeParams = {
    recipe: Recipe;
    machine: Machine;
    category: Category;
    inputs: RecipeIOInput[];
    outputs: RecipeIOInput[];
    sources: ProductRecipes;
    targets: ProductRecipes;
}

type RecipeIO = RecipeIOInput & {
    exported?: number;
    target?: RecipeId | null;
    imported?: number;
    source?: RecipeId | null;
}

type RecipeIOInput = Product & RecipeProduct
type RecipeIODict = {
    [index: string]: RecipeIO
}


// type RecipeInput = RecipeIOInput & {
//     imported: number;
//     source: RecipeId | null;
// }

// type RecipeOutput = RecipeIOInput & {
//     exported: number;
//     target: RecipeId | null;
// }


// type RecipeIOInput = Product & RecipeProduct
// type RecipeIODict = {
//     [index: string]: RecipeInput | RecipeOutput
// }

class ProductionNode {

    id: RecipeId;
    recipe: Recipe;
    machine: Machine;
    category: Category;

    inputs: RecipeIODict;
    outputs: RecipeIODict;

    sources: ProductRecipes;
    targets: ProductRecipes;

    duration: number = 60;
    machinesCount: number = 0;

    constructor( { recipe, machine, category, inputs, outputs, sources, targets }: ProductionNodeParams ) {
        
        this.id = recipe.id
        this.recipe = {...recipe}
        this.machine = {...machine}
        this.category = {...category}

        let inputProducts = inputs.reduce((items,item)=>({
            ...items, 
            [item.id]: {
                ...item,
                quantity: this.calculateProduct60(recipe.duration, item.quantity),
                imported: 0,
                source: null
            }
        }),{})

        let outputProducts = outputs.reduce((items,item)=>({
            ...items, 
            [item.id]: {
                ...item,
                quantity: this.calculateProduct60(recipe.duration, item.quantity),
                imported: 0,
                target: null
            }
        }),{})

        this.inputs = inputProducts
        this.outputs = outputProducts

        this.sources = sources
        this.targets = targets
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

    get nodeData(): Node<ProductionNode> {
        return  {
            id: this.id,
            type: 'RecipeNode',
            data: this,
            position: { x: 0, y: 0 }
        }
    }

    get edgeData(): Edge<any>[] {
        let edges: Edge<any>[] = []
        Object.values(this.inputs).forEach(input=>{
            if (input.source) {
                edges.push({
                    id: `${input.source}-${this.id}`,
                    source: input.source,
                    sourceHandle: `${input.source}-${input.id}-output`,
                    target: this.id,
                    targetHandle: `${this.id}-${input.id}-input`,
                    style: { stroke: generateDarkColorHex(), strokeWidth: 3 }
                })
            }
            
        })
        return edges;
    }

}

export default ProductionNode