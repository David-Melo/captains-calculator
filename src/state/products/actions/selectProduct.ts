import { Action } from "state/_types";
import { ProductId } from '../../app/effects/loadJsonData';

export const selectProduct: Action<ProductId|null> = async ({state}, productId) => {
    state.products.currentItemId = productId
}