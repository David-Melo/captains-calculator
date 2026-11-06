import { createOvermind } from 'overmind';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppStateConfig } from 'state';

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('calculator initialization', () => {
    it('loads saved settings and creates a production node using shipped data', async () => {
        localStorage.setItem('app-settings', JSON.stringify({ theme: 'dark' }));
        const store = createOvermind(AppStateConfig, { devtools: false });
        await store.initialized;
        expect(store.state.loading).toBe(false);
        expect(store.state.initializationError).toBeNull();
        expect(store.state.settings.theme).toBe('dark');

        await store.actions.recipes.selectRecipe('air_separation');
        const node = store.state.recipes.nodesList[0];
        expect(node.machine.id).toBe('air_separator');
        expect(node.outputs.oxygen.quantity).toBeGreaterThan(0);
        expect(store.state.recipes.nodesData).toHaveLength(1);
    });

    it('keeps loading until an asynchronous data load finishes', async () => {
        let finish!: () => void;
        const pending = new Promise<void>(resolve => { finish = resolve; });
        const store = createOvermind({
            ...AppStateConfig,
            actions: { ...AppStateConfig.actions, loadJsonData: () => pending },
        }, { devtools: false });
        await Promise.resolve();
        expect(store.state.loading).toBe(true);
        finish();
        await store.initialized;
        expect(store.state.loading).toBe(false);
    });

    it('shows a recoverable error without publishing partial data, then retries', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        const loadMachines = vi.fn(AppStateConfig.effects.loadMachineData)
            .mockImplementationOnce(() => { throw new Error('Invalid bundled data'); });
        const store = createOvermind({
            ...AppStateConfig,
            effects: { ...AppStateConfig.effects, loadMachineData: loadMachines },
        }, { devtools: false });
        await store.initialized;
        expect(store.state.loading).toBe(false);
        expect(store.state.initializationError).toBeTruthy();
        expect(store.state.products.itemsList).toHaveLength(0);

        await store.actions.onInitializeOvermind();
        expect(store.state.initializationError).toBeNull();
        expect(store.state.machines.itemsList.length).toBeGreaterThan(0);
        expect(store.state.products.itemsList.length).toBeGreaterThan(0);
    });

    it('starts with default settings when local storage contains invalid JSON', async () => {
        localStorage.setItem('app-settings', '{broken');
        const store = createOvermind(AppStateConfig, { devtools: false });
        await store.initialized;
        expect(store.state.initializationError).toBeNull();
        expect(store.state.settings.theme).toBe('light');
    });

    it('links production flows and removes their edges when a node is deleted', async () => {
        vi.spyOn(console, 'log').mockImplementation(() => {});
        const store = createOvermind(AppStateConfig, { devtools: false });
        await store.initialized;
        await store.actions.recipes.selectRecipe('air_separation');
        await store.actions.recipes.selectRecipe('ethanol_making_corn');
        const source = store.state.recipes.nodesList.find(node => node.recipe.id === 'air_separation')!;
        const target = store.state.recipes.nodesList.find(node => node.recipe.id === 'ethanol_making_corn')!;

        await store.actions.recipes.linkExistingRecipe({
            currentNodeId: source.id, existingNodeId: target.id,
            productId: 'oxygen', direction: 'output',
        });
        expect(source.outputs.oxygen.exported).toBe(16);
        expect(target.inputs.oxygen.imported).toBe(16);
        expect(store.state.recipes.edgesData).toHaveLength(1);

        await store.actions.recipes.deleteNode(target.id);
        expect(store.state.recipes.nodesList).toHaveLength(1);
        expect(source.outputs.oxygen.exported).toBe(0);
        expect(store.state.recipes.edgesData).toHaveLength(0);
    });
});
