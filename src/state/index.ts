
import { IContext } from 'overmind';
import { createActionsHook, createEffectsHook, createReactionHook, createStateHook } from 'overmind-react';
import { namespaced, merge } from 'overmind/config';

import { state, actions, effects } from 'state/app';

import * as machines from 'state/machines'
import * as products from 'state/products'
import * as categories from 'state/categories'

export const AppModules = {
    machines,
    products,
    categories
}

export const AppStateConfig = merge(
    {
        state,
        actions,
        effects: {
            ...effects
        }
    }, 
    namespaced(AppModules)
)

export const useAppState = createStateHook<IContext<typeof AppStateConfig>>()
export const useActions = createActionsHook<IContext<typeof AppStateConfig>>()
export const useEffects = createEffectsHook<IContext<typeof AppStateConfig>>()
export const useReaction = createReactionHook<IContext<typeof AppStateConfig>>()