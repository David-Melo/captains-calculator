import { Category } from 'state/app/effects/loadJsonData';

export type CatogioresState = {
    itemsList: Category[];
    items: {
        [key: string]: Category
    };
    currentItemId: Category['id'] | null;
    currentItem: Category | null; 
}