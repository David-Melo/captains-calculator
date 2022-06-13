import machineData from "data/machines.json"
import productData from "data/products.json"
import recipeData from "data/recipes.json"
import categoryData from "data/categories.json"

export type MachineId = keyof typeof machineData;
export type RecipeId = keyof typeof recipeData;
export type ProductId = keyof typeof productData;
export type CategoryId = keyof typeof categoryData;

export type BuildCost = {
    id: ProductId;
    name: string;
    quatity: number;
}

export type Machine = {
    id: MachineId;
    game_id: string;
    icon: string;
    name: string;
    category_id: CategoryId;
    category_name: string;
    workers: number;
    maintenance_cost_units: string;
    maintenance_cost_quantity: number;
    electricity_consumed: number;
    electricity_generated: number;
    computing_consumed: number;
    computing_generated: number;
    storage_capacity: number;
    unity_cost: number;
    research_speed: number;
    build_costs: BuildCost[]
    recipes: RecipeId[];
    products: {
        input: ProductId[];
        output: ProductId[];
    }

}

export type Category = {
    id: string;
    name: string;
    machines: MachineId[];
    recipes: RecipeId[];
}

export type Product = {
    id: ProductId;
    name: string;
    icon: string;
    recipes: {
        input: RecipeId[];
        output: RecipeId[];
    }
    machines: {
        input: MachineId[];
        output: MachineId[];
    }
}

export type Recipe = {
    
}

type MachineData = { [id in MachineId]: Machine }
type RecipeData = { [id in RecipeId]: Recipe }
type ProductData = { [id in ProductId]: Product }
type CategoryData = { [id in CategoryId]: Category }

export const loadMachineData = () => {
    return machineData as unknown as MachineData
}

export const loadProductData = () => {
    return productData as unknown as ProductData
}

export const loadRecipetData = () => {
    return recipeData as unknown as RecipeData
}

export const loadCategoryData = () => {
    return categoryData as unknown as CategoryData
}

