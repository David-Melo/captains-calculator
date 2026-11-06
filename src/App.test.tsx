import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createOvermind } from 'overmind';
import { Provider } from 'overmind-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppStateConfig } from 'state';
import App from './App';

beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('matchMedia', () => ({
        matches: false, addListener() {}, removeListener() {},
        addEventListener() {}, removeEventListener() {},
    }));
    vi.stubGlobal('ResizeObserver', class {
        observe() {} unobserve() {} disconnect() {}
    });
});

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

const renderCalculator = (store: ReturnType<typeof createOvermind<typeof AppStateConfig>>) => render(
    <Provider value={store}>
        <ColorSchemeProvider colorScheme="light" toggleColorScheme={() => {}}>
            <MantineProvider>
                <ModalsProvider>
                    <NotificationsProvider><App /></NotificationsProvider>
                </ModalsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    </Provider>
);

describe('calculator screen', () => {
    it('opens the product selector and selects a product', async () => {
        const store = createOvermind(AppStateConfig, { devtools: false });
        await store.initialized;
        renderCalculator(store);
        expect(screen.getByText('Production Chain Setup')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Click To Select' }));
        fireEvent.change(await screen.findByPlaceholderText('Product Search'), { target: { value: 'oxygen' } });
        fireEvent.click(screen.getByText('Oxygen'));
        await waitFor(() => expect(store.state.products.currentItemId).toBe('oxygen'));
        expect(screen.queryByText('Could not load calculator')).not.toBeInTheDocument();
    });

    it('displays startup failure and allows a successful retry', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        const loadMachines = vi.fn(AppStateConfig.effects.loadMachineData)
            .mockImplementationOnce(() => { throw new Error('Invalid data'); });
        const store = createOvermind({
            ...AppStateConfig,
            effects: { ...AppStateConfig.effects, loadMachineData: loadMachines },
        }, { devtools: false });
        await store.initialized;
        renderCalculator(store);
        expect(screen.getByRole('alert')).toHaveTextContent('Could not load calculator');
        expect(screen.queryByText('Production Chain Setup')).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
        expect(await screen.findByText('Production Chain Setup')).toBeInTheDocument();
        expect(screen.queryByText('Could not load calculator')).not.toBeInTheDocument();
    });
});
