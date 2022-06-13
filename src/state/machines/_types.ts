import { Machine } from 'state/app/effects/loadJsonData';

export type MachinesState = {
    itemsList: Machine[];
    items: {
        [key: string]: Machine
    };
    currentItemId: Machine['id'] | null;
    currentItem: Machine | null; 
}