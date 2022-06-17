import { derived } from 'overmind';
import { Edge } from 'react-flow-renderer';

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
    nodes: {},
    nodesList: derived( (state: RecipesState) => Object.values(state.nodes) ),
    currentNodeId: null,
    get currentNode() {
        return this.currentNodeId ? this.nodes[this.currentNodeId] : null
    },
    nodesData: derived( (state: RecipesState) => Object.values(state.nodes).map(node=>node.nodeData) ),
    edgesData: derived( (state: RecipesState) => {
        return Object.values(state.nodes).reduce((edges,node)=>{
            return [ ...edges, ...node.edgeData ]
        },[] as Edge<any>[])
    }),
    graphData: []
}