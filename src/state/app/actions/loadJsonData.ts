import { Action } from "state/_types";

export const loadJsonData: Action = async ({state,effects}) => {
    let machines = effects.loadMachineData();
    let products = effects.loadProductData();
    let categories = effects.loadCategoryData();
    state.machines.items = machines
    state.products.items = products
    state.categories.items = categories
}