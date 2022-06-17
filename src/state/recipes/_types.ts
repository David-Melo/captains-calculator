import { ProductId, Recipe, RecipeId } from 'state/app/effects/loadJsonData';
import ProductionNode, { RecipeIOProduct } from './ProductionNode';
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
    nodesList: (ProductionNode|RecipeIOProduct)[];
    nodesData: Node<ProductionNode|RecipeIOProduct>[]; 
    edgesData: Edge<any>[];
    graphData: Node<ProductionNode|RecipeIOProduct>[]; 
}

export type ProductRecipes = {
    [index in ProductId]: Recipe[]
}