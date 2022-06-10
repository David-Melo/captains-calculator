import { IContext } from 'overmind';
import { AppStateConfig, AppModules } from 'state';
import { AppState } from 'state/app/_types';

export * from "state/app/_types";
export * from "state/machines/_types";

export type Context = IContext<typeof AppStateConfig>

export type RootAppState = Context['state']

export type ModuleKeys = keyof typeof AppModules

export type GenericDictionary = {
    [index: string]: any
}

export interface Action<Input extends any = void, Output extends any = void> {
    (context: {
        state: Context['state'];
        actions: Context['actions'];
        effects: Context['effects'];
        reaction: any;
        addMutationListener: any;
        addFlushListener: any;
    }, payload: Input): Output;
}

export interface AsyncAction<Input extends any = void, Output extends any = void> {
    (context: {
        state: Context['state'];
        actions: Context['actions'];
        effects: Context['effects'];
        reaction: any;
        addMutationListener: any;
        addFlushListener: any;
    }, payload: Input): Promise<Output>;
}

export type GenericError = {
    code: string;
    text: string;
}