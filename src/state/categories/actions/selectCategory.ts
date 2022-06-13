import { Action } from "state/_types";
import { CategoryId } from '../../app/effects/loadJsonData';

export const selectCategory: Action<CategoryId|null> = async ({state}, category) => {
    state.categories.currentItemId = category
}