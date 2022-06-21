import { Category, Machine, Product, Recipe, RecipeId, RecipeProduct } from "state/app/effects"
import { ProductRecipes } from "state/_types";
import { Edge }  from 'react-flow-renderer';
import { generateDarkColorHex } from "utils/colors";
import { RecipeNode } from "components/calculator/Editor";

type ProductionNodeParams = {
    recipe: Recipe;
    machine: Machine;
    category: Category;
    inputs: RecipeIOProduct[];
    outputs: RecipeIOProduct[];
    sources: ProductRecipes;
    targets: ProductRecipes;
}

type RecipeIO =  {
    exported?: number;
    target?: RecipeId | null;
    imported?: number;
    source?: RecipeId | null;
}

export type RecipeIOProduct = Product & RecipeProduct & RecipeIO

export type RecipeIODict = {
    [index: string]: RecipeIOProduct
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
                exported: 0,
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

    get nodeData(): RecipeNode[] {
        let mainNode = {
            id: this.id,
            type: 'RecipeNode',
            data: this,
            position: { x: 0, y: 0 }
        }
        // let productInputPorts = Object.values(this.inputs).filter(i=>{
        //     return !i.source
        // }).map(i=>{
        //     return {
        //         id: `${this.id}-${i.id}-input-add`,
        //         type: 'LinkNode',
        //         data: {
        //             recipeId: this.id,
        //             product: i,
        //             type: 'input'
        //         },
        //         position: { x: 0, y: 0 }
        //     }
        // }).sort((a, b) => sortArray(a.data.product.name, b.data.product.name))
        // let productOutputPorts = Object.values(this.outputs).filter(i=>{
        //     return !i.target
        // }).map(i=>{
        //     return {
        //         id: `${this.id}-${i.id}-output-add`,
        //         type: 'LinkNode',
        //         data: {
        //             recipeId: this.id,
        //             product: i,
        //             type: 'output'
        //         },
        //         position: { x: 0, y: 0 }
        //     }
        // }).sort((a, b) => sortArray(a.data.product.name, b.data.product.name))
        return [ mainNode ]
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

        // this.nodeData.forEach(node=>{
        //     if (node.type==='LinkNode') {
        //         let linkNode = node as LinkNode
        //         if (linkNode.data.type==='input') {
        //             edges.push({
        //                 id: `${this.id}-${linkNode.data.product.id}-add-${linkNode.data.type}`,
        //                 source: linkNode.id,
        //                 sourceHandle: `${this.id}-${linkNode.data.product.id}-input-add`,
        //                 target: linkNode.data.recipeId,
        //                 targetHandle: `${this.id}-${linkNode.data.product.id}-input`,
        //                 style: { stroke: generateDarkColorHex(), strokeWidth: 3 }
        //             })
        //         }
        //         else
        //         {
        //             edges.push({
        //                 id: `${this.id}-${linkNode.data.product.id}-add-${linkNode.data.type}`,
        //                 source: linkNode.data.recipeId,
        //                 sourceHandle: `${this.id}-${linkNode.data.product.id}-output`,
        //                 target: linkNode.id,
        //                 targetHandle: `${this.id}-${linkNode.data.product.id}-output-add`,
        //                 style: { stroke: 'red', strokeWidth: 3 }
        //             })
        //         }
        //     }
        // })

        return edges
    }

}

export default ProductionNode