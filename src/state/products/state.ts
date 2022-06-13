import { derived } from 'overmind';

import { ProductsState } from "state/_types";

export const state: ProductsState = {
    itemsList: derived( (state: ProductsState) => Object.values(state.items) ),
    items: {},
    currentItemId: null,
    get currentItem() {
        console.log('huh')
        return this.currentItemId ? this.items[this.currentItemId] : null
    }
}