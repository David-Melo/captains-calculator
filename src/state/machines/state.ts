import { derived } from 'overmind';

import { MachinesState } from "state/_types";

export const state: MachinesState = {
    itemsList: derived( (state: MachinesState) => Object.values(state.items) ),
    items: {},
    currentItemId: null,
    get currentItem() {
        return this.currentItemId ? this.items[this.currentItemId] : null
    }
}