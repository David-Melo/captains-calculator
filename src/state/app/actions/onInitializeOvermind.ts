
import { AsyncAction } from "state/_types"

import logger from 'utils/logger';

export const onInitializeOvermind: AsyncAction = async ({ state, actions }) => {
    state.loading = true;
    state.initializationError = null;
    logger(`Initializing App`)

    try {
        await actions.loadSettings();
        await actions.loadJsonData();
    } catch (error) {
        console.error('Calculator initialization failed:', error);
        state.initializationError = 'The calculator could not load its data. Please try again.';
    } finally {
        state.loading = false;
    }
}
