
import { pipe } from 'overmind'
import { AsyncAction, Context } from "state/_types"

import logger from 'utils/logger';

export const onInitializeOvermind: AsyncAction = pipe(
    async ({state,actions}: Context) => {
        state.loading = true;
        logger(`Initializing App`)
        actions.loadSettings()
    },
    async ({state,actions}: Context) => {
        state.loading = false;
    }
)