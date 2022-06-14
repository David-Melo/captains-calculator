import { derived } from 'overmind';

import { RecipesState } from "state/_types";

export const state: RecipesState = {
    itemsList: derived( (state: RecipesState) => Object.values(state.items) ),
    items: {},
    currentItemId: null,
    get currentItem() {
        return this.currentItemId ? this.items[this.currentItemId] : null
    },
    selectedRecipeIds: [],
    selectedRecipies: derived( (state: RecipesState) => state.selectedRecipeIds.map(id=>state.items[id]) ),
}