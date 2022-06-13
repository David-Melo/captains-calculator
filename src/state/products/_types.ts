import { Product } from 'state/app/effects/loadJsonData';

export type ProductsState = {
    itemsList: Product[];
    items: {
        [key: string]: Product
    };
    currentItemId: Product['id'] | null;
    currentItem: Product | null; 
}