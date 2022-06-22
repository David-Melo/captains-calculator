import { ProductId, Recipe, RecipeId } from 'state/app/effects/loadJsonData';
import ProductionNode from './ProductionNode';
import { Edge, Node }  from 'react-flow-renderer';

export type RecipesState = {
    itemsList: Recipe[];
    items: {
        [key: string]: Recipe
    };
    currentItemId: Recipe['id'] | null;
    currentItem: Recipe | null;
    selectedRecipeIds: RecipeId[];
    selectedRecipies: Recipe[];
    nodes: {
        [key: string]: ProductionNode
    };
    currentNodeId: RecipeId | null;
    currentNode: ProductionNode | null;
    nodesList: (ProductionNode)[];
    nodesData: Node<ProductionNode>[]; 
    edgesData: Edge<any>[];
    graphData: Node<ProductionNode>[]; 
}

export type ProductRecipes = {
    [index in ProductId]: Recipe[]
}