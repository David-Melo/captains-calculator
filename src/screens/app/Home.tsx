import { Box, Grid, Divider, Card, Group, Stack, Text, Image } from '@mantine/core';
import PageHeader from 'components/layout/page/PageHeader';
import PageLayout from 'components/layout/page/PageLayout';
import { ProductMachineSelect } from 'components/products/ProductMachineSelect';
import { MachineRecipeSelect, RecipeSelectControlled } from 'components/recipes/MachineRecipeSelect';
import { ProductSelect } from 'components/products/ProductSelect';
import React from 'react';
import { useActions, useAppState } from 'state';
import { Machine, ProductId, Recipe, RecipeId, RecipeProduct } from 'state/app/effects';
import CostsIcon from 'components/ui/CostsIcons';
import NeedsBage from 'components/ui/NeedsBadge';
import ProductIcon from 'components/products/ProductIcon';

type RecipeSource = { machines: Machine[], recipes: Recipe[] }

const renderRecipeSource = (recipe: Recipe, machine: Machine) => {

    return (
        <React.Fragment>


            <Grid columns={24} align="center">

                <Grid.Col md={9}>
                    <Group>
                        <Box
                            p={5}
                            sx={theme => ({
                                borderRadius: theme.radius.md,
                                border: `1px solid ${theme.colors.gray[2]}`,
                                background: theme.colors.gray[0]
                            })}
                        >
                            <Image
                                height={35}
                                radius="md"
                                src={`/assets/buildings/${machine.icon}`} alt={machine.name}
                            />
                        </Box>
                        <Box>
                            <Stack spacing={4}>
                                <Group spacing="xs">
                                    <Text weight={500} size="md" sx={{ lineHeight: '1em' }}>{recipe.name}</Text>
                                    <Text size="sm" sx={{ lineHeight: '1.5rem' }}>({machine.name})</Text>
                                </Group>
                                <Group spacing={4}>
                                    <NeedsBage need="workers" value={machine.workers} />
                                    <NeedsBage need="maintenance" value={machine.maintenance_cost_quantity} />
                                    <NeedsBage need="electricity" value={machine.electricity_consumed} />
                                    <NeedsBage need="unity" value={machine.unity_cost} />
                                    <NeedsBage need="computing" value={machine.computing_consumed} suffix="tf" />
                                </Group>
                            </Stack>
                        </Box>
                    </Group>
                </Grid.Col>
                <Grid.Col md={5}>
                    <Group spacing={4} position="center">
                        {machine.build_costs.map((product, key) => {
                            return <CostsIcon key={key} product={product} />
                        })}
                    </Group>
                </Grid.Col>
                <Grid.Col md={5}>
                    <Group spacing={4} position="center">
                        {recipe.inputs.map((product, key) => {
                            return <CostsIcon key={key} product={product} />
                        })}
                    </Group>
                </Grid.Col>
                <Grid.Col md={5}>
                    <Group spacing={4} position="center">
                        {recipe.outputs.map((product, key) => {
                            return <CostsIcon key={key} product={product} />
                        })}
                    </Group>
                </Grid.Col>

            </Grid>

        </React.Fragment>

    )
}

const Home: React.FC = () => {

    const { items: allProducts, currentItem: currentProduct } = useAppState(state => state.products)
    const { items: allMachines, currentItem: currentMachine } = useAppState(state => state.machines)
    const { items: allRecipes, currentItem: currentRecipe } = useAppState(state => state.recipes)
    const { selectedRecipies } = useAppState(state => state.recipes)

    const renderRecipeSelect = () => {
        if (!currentMachine) return null
        return <MachineRecipeSelect />
    }

    const renderProductSelect = () => {
        if (!currentProduct) return null
        return <ProductMachineSelect />
    }

    const getInputSources = (selectedRecipe: Recipe) => {
        return selectedRecipe.inputs.reduce((inputRecipes, input) => {
            let product = allProducts[input.id]
            let recipeSources = product.recipes.output.length ? product.recipes.output.map(recipeId => allRecipes[recipeId]) : []
            if (inputRecipes[input.id]) {
                return recipeSources.length ? { ...inputRecipes, [input.id]: [...inputRecipes[input.id], recipeSources] } : inputRecipes
            } else {
                return recipeSources.length ? { ...inputRecipes, [input.id]: recipeSources } : inputRecipes
            }
        }, {} as { [index in ProductId]: Recipe[] })
    }

    const renderRecipe = (recipe: Recipe) => {
        let machine = allMachines[recipe.machine]
        let sources: { [index in ProductId]: Recipe[] } = recipe ? getInputSources(recipe) : {} as { [index in ProductId]: Recipe[] }
        return (
            <Card
                shadow="xs"
            >
                {renderRecipeSource(recipe, machine)}
                {Object.keys(sources).length ? (
                    <React.Fragment>
                        <Divider my="md" variant="dashed" labelPosition="center" />
                        <Stack spacing={5}>
                            {Object.keys(sources).map((inputId, key) => {
                                let inputSources = sources[inputId as ProductId]
                                let product = allProducts[inputId]
                                return (
                                    <Box
                                        key={key}
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: 'auto 1fr',
                                            gap: 5
                                        }}
                                    >
                                        <ProductIcon product={product} />
                                        <RecipeSelect recipes={inputSources} label={product.name} />
                                    </Box>
                                )
                            })}
                        </Stack>
                    </React.Fragment>
                ) : null}
            </Card>
        )
    }

    // const renderInputSources = (selectedRecipe: Recipe) => {
    //     let sources = getInputSources(selectedRecipe)
    //     return (
    //         <React.Fragment>
    //             {sources.map((source, k) => {
    //                 if (source === null) return null;
    //                 return (
    //                     <React.Fragment key={k}>
    //                         {renderRecipe(source)}
    //                         {/* {renderInputSources(source.recipe)} */}
    //                     </React.Fragment>
    //                 )
    //             })}
    //         </React.Fragment>
    //     )
    // }

    return (
        <PageLayout
            header={<PageHeader
                title={`Welcome`}
            />}
        >

            <Grid>

                <Grid.Col md={6}>
                    <ProductSelect />
                </Grid.Col>
                <Grid.Col md={6}>{renderProductSelect()}</Grid.Col>
                <Grid.Col md={12}>{renderRecipeSelect()}</Grid.Col>

            </Grid>

            {currentRecipe && currentMachine ? (
                <Box>

                    <Grid columns={24}>

                        <Grid.Col md={9}>
                            <Divider my={20} variant="dashed" labelPosition="center" label="Building" />
                        </Grid.Col>
                        <Grid.Col md={5}>
                            <Divider my={20} variant="dashed" labelPosition="center" label="Build Cost" />
                        </Grid.Col>
                        <Grid.Col md={5}>
                            <Divider my={20} variant="dashed" labelPosition="center" label="Inputs" />
                        </Grid.Col>
                        <Grid.Col md={5}>
                            <Divider my={20} variant="dashed" labelPosition="center" label="Outputs" />
                        </Grid.Col>

                    </Grid>
                    <Stack spacing="sm">
                        {selectedRecipies.map((selectedRecipie, key) => {
                            console.log(selectedRecipie)
                            return (
                                <React.Fragment key={key}>
                                    {renderRecipe(selectedRecipie)}
                                </React.Fragment>
                            )
                        })}

                    </Stack>
                </Box>
            ) : (null)}

        </PageLayout>
    )
}

type RecipeSelectProps = {
    label: string;
    recipes: Recipe[];
}

const RecipeSelect: React.FC<RecipeSelectProps> = ({ recipes, label }) => {

    const { items: allRecipes } = useAppState(state => state.recipes)
    const { items: allMachines } = useAppState(state => state.machines)
    const selectRecipesItem = useActions().recipes.selectRecipesItem
    const [recipeItem, setRecipe] = React.useState<Recipe | null>(null)

    const renderRecipe = (recipe: Recipe) => {
        let machine = allMachines[recipe.machine]
        return renderRecipeSource(recipe, machine)
    }

    const handleSelect = (recipeId: RecipeId) => {
        let recipe = allRecipes[recipeId]
        setRecipe(recipe)
        selectRecipesItem(recipeId)
    }

    return (
        <React.Fragment>
            {recipes.length ? <RecipeSelectControlled recipes={recipes} onSelect={handleSelect} label={label} /> : null}
        </React.Fragment>
    )

}

export default Home;