import { derived } from 'overmind';

import { CatogioresState } from "state/_types";

export const state: CatogioresState = {
    itemsList: derived( (state: CatogioresState) => Object.values(state.items) ),
    items: {},
    currentItemId: null,
    get currentItem() {
        return this.currentItemId ? this.items[this.currentItemId] : null
    }
}