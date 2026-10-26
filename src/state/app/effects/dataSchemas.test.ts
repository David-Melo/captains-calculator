import { afterEach, describe, expect, it, vi } from 'vitest';
import categories from 'data/categories.json';
import machines from 'data/machines.json';
import products from 'data/products.json';
import recipes from 'data/recipes.json';
import { categoryDatasetSchema, machineDatasetSchema, productDatasetSchema, recipeDatasetSchema, validateDataset } from './dataSchemas';

afterEach(() => vi.restoreAllMocks());

describe('bundled calculator data', () => {
    it.each([
        ['categories', categoryDatasetSchema, categories],
        ['machines', machineDatasetSchema, machines],
        ['products', productDatasetSchema, products],
        ['recipes', recipeDatasetSchema, recipes],
    ] as const)('validates %s before publishing a build', (name, schema, data) => {
        expect(() => validateDataset(name, schema, data)).not.toThrow();
    });

    it('rejects mismatched record IDs and invalid fields together', () => {
        const log = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => validateDataset('categories', categoryDatasetSchema, {
            wrong: { id: 'actual', name: '', machines: [], recipes: [] },
        })).toThrow('dataset failed validation');
        const errors = log.mock.calls[0][1] as string[];
        expect(errors).toEqual(expect.arrayContaining([
            expect.stringContaining('does not match item id'),
            expect.stringContaining('name is a required field'),
        ]));
    });

    it('rejects wrong field types instead of coercing bundled data', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => validateDataset('categories', categoryDatasetSchema, {
            sample: { id: 'sample', name: 'Sample', machines: [123], recipes: [] },
        })).toThrow();
    });
});
