import * as yup from 'yup';

/* ******************
** Shared Field Schemas
****************** */

const idListSchema = yup.array().of(yup.string().required()).required();

const buildCostSchema = yup.object({
    id: yup.string().required(),
    name: yup.string().required(),
    quantity: yup.number().required(),
});

const recipeProductSchema = yup.object({
    id: yup.string().required(),
    name: yup.string().required(),
    quantity: yup.number().required(),
});

/* ******************
** Dataset Item Schemas
** Mirror the types in `state/app/effects/loadJsonData.ts`
****************** */

const categorySchema = yup.object({
    id: yup.string().required(),
    name: yup.string().required(),
    machines: idListSchema,
    recipes: idListSchema,
});

const machineSchema = yup.object({
    id: yup.string().required(),
    game_id: yup.string().required(),
    icon: yup.string().required(),
    name: yup.string().required(),
    category_id: yup.string().required(),
    category_name: yup.string().required(),
    workers: yup.number().required(),
    maintenance_cost_units: yup.string().defined().nullable(),
    maintenance_cost_quantity: yup.number().required(),
    electricity_consumed: yup.number().required(),
    electricity_generated: yup.number().required(),
    computing_consumed: yup.number().required(),
    computing_generated: yup.number().required(),
    storage_capacity: yup.number().required(),
    unity_cost: yup.number().required(),
    research_speed: yup.number().required(),
    isMine: yup.boolean().required(),
    isStorage: yup.boolean().required(),
    isFarm: yup.boolean().required(),
    build_costs: yup.array().of(buildCostSchema).required(),
    recipes: idListSchema,
    products: yup.object({
        input: idListSchema,
        output: idListSchema,
    }).required(),
});

const productSchema = yup.object({
    id: yup.string().required(),
    name: yup.string().required(),
    icon: yup.string().required(),
    recipes: yup.object({
        input: idListSchema,
        output: idListSchema,
    }).required(),
    machines: yup.object({
        input: idListSchema,
        output: idListSchema,
    }).required(),
});

const recipeSchema = yup.object({
    id: yup.string().required(),
    name: yup.string().required(),
    machine: yup.string().required(),
    duration: yup.number().required(),
    inputs: yup.array().of(recipeProductSchema).required(),
    outputs: yup.array().of(recipeProductSchema).required(),
});

/* ******************
** Dataset (dictionary) Schemas
** Each dataset is a `{ [id]: item }` record, validated as a list of its items
****************** */

export const categoryDatasetSchema = yup.array().of(categorySchema).required();
export const machineDatasetSchema = yup.array().of(machineSchema).required();
export const productDatasetSchema = yup.array().of(productSchema).required();
export const recipeDatasetSchema = yup.array().of(recipeSchema).required();

/* ******************
** Validation Runner
** Bundled JSON is still build-time data (not user input), but the app's branded ID
** types (MachineId, RecipeId, etc.) assume every dataset is well-formed - loading a
** dataset that fails validation is worse silently than failing loudly, so failures
** are logged for context and then thrown to stop `loadJsonData` before state is mutated.
****************** */

export const validateDataset = (datasetName: string, schema: yup.ArraySchema<any>, data: Record<string, { id?: string }>): void => {

    const entries = Object.entries(data);

    const keyMismatchErrors = entries
        .filter(([key, item]) => item?.id !== key)
        .map(([key, item]) => `Record key "${key}" does not match item id "${item?.id}"`);

    const validationErrors: string[] = [...keyMismatchErrors];

    try {

        schema.validateSync(entries.map(([, item]) => item), { abortEarly: false, strict: true });

    } catch (error) {

        if (!(error instanceof yup.ValidationError)) throw error;
        validationErrors.push(...error.errors);

    }

    if (validationErrors.length) {
        console.error(`[dataSchemas] "${datasetName}" failed validation:`, validationErrors);
        throw new Error(`"${datasetName}" dataset failed validation - see console for details`);
    }

}
