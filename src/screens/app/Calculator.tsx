import React from 'react';
import { Box, Card, Grid, Image, Group, Divider, Stack, Tooltip, Text } from '@mantine/core';
import PageLayoutBlank from '../../components/layout/page/PageLayoutBlank';
import ReactFlow, { MiniMap, Controls, ReactFlowProvider, Handle, Position, NodeTypes, NodeProps } from 'react-flow-renderer';
import { ProductSelect } from 'components/products/ProductSelect';
import { MachineRecipeSelect } from 'components/recipes/MachineRecipeSelect';
import { ProductMachineSelect } from 'components/products/ProductMachineSelect';
import { useAppState } from 'state';
import { Category, Machine, Recipe } from 'state/app/effects';
import { Icon } from '@iconify/react';
import CostsBadge from 'components/ui/CostsBadge';
import CostsIcon from 'components/ui/CostsIcons';
import NeedsBage from 'components/ui/NeedsBadge';

const Setup = () => {

    const { items: allProducts, currentItem: currentProduct } = useAppState(state => state.products)
    const { items: allMachines, currentItem: currentMachine } = useAppState(state => state.machines)
    const { items: allRecipes, currentItem: currentRecipe } = useAppState(state => state.recipes)

    const renderRecipeSelect = () => {
        if (!currentMachine) return null
        return <MachineRecipeSelect />
    }

    const renderProductSelect = () => {
        if (!currentProduct) return null
        return <ProductMachineSelect />
    }

    return (
        <Box>
            <Grid columns={10} gutter="xs">
                <Grid.Col md={2}>
                    <ProductSelect />
                </Grid.Col>
                <Grid.Col md={3}>
                    {renderProductSelect()}
                </Grid.Col>
                <Grid.Col md={5}>
                    {renderRecipeSelect()}
                </Grid.Col>
            </Grid>
        </Box>
    )

}

type RecipeNodeData = {
    label: string;
    recipe: Recipe;
    machine: Machine;
    category: Category;
}

const handleStyle: React.CSSProperties = { width: 'auto', height: 'auto', position: 'relative', top: 'initial', left: 'initial', right: 'initial', bottom: 'initial', borderRadius: 4, transform: 'initial' }

const RecipeNodeType = ({ data: { recipe, machine, category } }: NodeProps<RecipeNodeData>) => {

    return (
        <Card p={0}>
            <Group>



                    <Stack justify="space-around"  sx={theme => ({ borderRight: `1px solid ${theme.colors.gray[4]}`, height: '100%' })}>
                        <Handle
                            id="1"
                            type="target"
                            position={Position.Left}
                            style={handleStyle}
                        >
                            <Image src={`/assets/categories/all.png`} alt='test' height={22} style={{ pointerEvents: 'none' }} />
                        </Handle>
                        <Handle
                            id="2"
                            type="target"
                            position={Position.Left}
                            style={handleStyle}
                        >
                            <Image src={`/assets/categories/all.png`} alt='test' height={22} style={{ pointerEvents: 'none' }} />
                        </Handle>
                        <Handle
                            id="3"
                            type="target"
                            position={Position.Left}
                            style={handleStyle}
                        >
                            <Image src={`/assets/categories/all.png`} alt='test' height={22} style={{ pointerEvents: 'none' }} />
                        </Handle>
                    </Stack>

    


                <Box>

                    <Group position="apart" p="xs">
                            <Tooltip
                                label={category.name}
                                withArrow
                                withinPortal
                            >
                                <Box
                                    p={4}
                                    sx={theme => ({
                                        borderRadius: theme.radius.sm,
                                        background: theme.colors.dark[4]
                                    })}
                                >
                                    <Image src={`/assets/categories/${category.id}.png`} alt={category.name} height={22} />
                                </Box>
                            </Tooltip>
                            <Text weight="bolder" size="lg" sx={{ lineHeight: '1em' }}>{machine.name}</Text>
                            <Tooltip
                                label={machine.name}
                                withArrow
                                withinPortal
                            >
                                <Box
                                    p={4}
                                    sx={theme => ({
                                        borderRadius: theme.radius.sm,
                                        background: theme.colors.dark[4]
                                    })}
                                >
                                    <Image
                                        height={22}
                                        radius="md"
                                        src={`/assets/buildings/${machine.icon}`} alt={machine.name}
                                    />
                                </Box>
                            </Tooltip>
                    </Group>

                    <Divider my={0} variant="solid" labelPosition="center" color="gray" sx={theme => ({ borderTopColor: theme.colors.gray[4] })} />

                    <Box p="xs">

                        <Group noWrap position="center">
                            <Group
                                noWrap
                                spacing="xs"
                                sx={theme => ({
                                    '& .product-input .product-icon': {
                                        color: theme.colors.gray[6],
                                        marginBottom: 18
                                    },
                                    '& .product-input:last-child .product-icon': {
                                        display: 'none'
                                    }
                                })}
                            >

                                {recipe.inputs.map((product, key) => {
                                    return (
                                        <Group className="product-input" spacing="xs" key={`input_${product.id}`} noWrap>
                                            <CostsIcon key={key} recipeId={recipe.id} product={product} color="red" />
                                            <Icon className="product-icon" icon="icomoon-free:plus" width={10} />
                                        </Group>
                                    )
                                })}
                            </Group>
                            <Group
                                spacing="xs"
                            >
                                <Stack align="center" spacing={5}>
                                    <Icon className="results-icon" icon="icomoon-free:arrow-right" width={15} />
                                    <Text weight="bold" size="sm" sx={theme => ({ color: theme.colors.gray[6], lineHeight: `${theme.fontSizes.sm}px` })}>{recipe.duration}<small>/s</small></Text>
                                </Stack>

                            </Group>
                            <Group
                                noWrap
                                spacing="xs"
                                sx={theme => ({
                                    '& .product-output': {
                                        position: 'relative'
                                    },
                                    '& .product-output .product-icon': {
                                        color: theme.colors.gray[6],
                                        marginBottom: 18
                                    },
                                    '& .product-output:last-child .product-icon': {
                                        display: 'none'
                                    }
                                })}
                            >
                                {recipe.outputs.map((product, key) => {
                                    return (
                                        <Group className="product-output" spacing="xs" key={`input_${product.id}`} noWrap>
                                            <CostsIcon key={key} recipeId={recipe.id} product={product} color="red" />
                                            <Icon className="product-icon" icon="icomoon-free:plus" width={10} />
                                        </Group>
                                    )
                                })}
                            </Group>
                        </Group>

                    </Box>

                    <Divider my={0} variant="solid" labelPosition="center" color="gray" sx={theme => ({ borderTopColor: theme.colors.gray[4] })} />

                    <Group spacing={4} position="center" p="xs">
                        {machine.build_costs.map((product, key) => {
                            return <CostsBadge key={key} product={product} />
                        })}
                        <NeedsBage need="workers" value={machine.workers} />
                        {machine.maintenance_cost_units === 'maintenance_i' && (
                            <NeedsBage need="maintenance1" value={machine.maintenance_cost_quantity} />
                        )}
                        {machine.maintenance_cost_units === 'maintenance_iI' && (
                            <NeedsBage need="maintenance2" value={machine.maintenance_cost_quantity} />
                        )}
                        <NeedsBage need="electricity" value={machine.electricity_consumed} />
                        <NeedsBage need="unity" value={machine.unity_cost} />
                        <NeedsBage need="computing" value={machine.computing_consumed} suffix="tf" />
                    </Group>

                </Box>



                <Stack>
                    <Handle
                        id="4"
                        type="source"
                        position={Position.Left}
                        style={handleStyle}
                    >
                        <Image src={`/assets/categories/all.png`} alt='test' height={22} style={{ pointerEvents: 'none' }} />
                    </Handle>
                    <Handle
                        id="5"
                        type="source"
                        position={Position.Left}
                        style={handleStyle}
                    >
                        <Image src={`/assets/categories/all.png`} alt='test' height={22} style={{ pointerEvents: 'none' }} />
                    </Handle>
                </Stack>


            </Group>

        </Card >
    );
}

const nodeTypes: NodeTypes = { RecipeNode: RecipeNodeType }

const Editor = () => {

    const { items: allProducts, currentItem: currentProduct } = useAppState(state => state.products)
    const { items: allMachines, currentItem: currentMachine } = useAppState(state => state.machines)
    const { items: allRecipes, currentItem: currentRecipe } = useAppState(state => state.recipes)
    const { items: allCategories } = useAppState(state => state.categories)
    const { selectedRecipies } = useAppState(state => state.recipes)

    if (!currentRecipe||!currentMachine) return null

    let nodes = selectedRecipies.map(recipe => {
        let machine = allMachines[recipe.machine]
        let category = allCategories[machine.category_id]
        console.log({
            recipe,
            machine,
            category
        })
        return {
            id: recipe.id,
            type: 'RecipeNode',
            data: {
                label: 'Node A',
                recipe,
                machine,
                category
            },
            position: { x: 0, y: 0 }
        }
    })

    nodes.push({
        id: currentRecipe.id + '1',
        type: 'RecipeNode',
        data: {
            label: 'Node A',
            recipe: currentRecipe,
            machine: currentMachine,
            category: allCategories['buildings']
        },
        position: { x: 0, y: 0 }
    })

    nodes.push({
        id: currentRecipe.id + '2',
        type: 'RecipeNode',
        data: {
            label: 'Node A',
            recipe: currentRecipe,
            machine: currentMachine,
            category: allCategories['buildings']
        },
        position: { x: 0, y: 0 }
    })

    return (
        <ReactFlow
            defaultZoom={1}
            nodeTypes={nodeTypes}
            defaultEdges={[]}
            defaultNodes={nodes}
            defaultEdgeOptions={{ type: 'straight' }}
            onInit={instance => {
                instance.setCenter(0, 0, { zoom: 1 })
            }}
        >
            <MiniMap />
            <Controls />
        </ReactFlow>
    )

}

const EditorLayout = () => {

    return (
        <Box
            sx={theme => ({
                height: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gridTemplateRows: 'auto 1fr',
                gridColumnGap: 0,
                gridRowGap: 0,
                padding: 12
            })}
        >
            <Box
                sx={theme => ({
                    gridArea: ' 1 / 1 / 2 / 2'
                })}
            >
                <Setup />
            </Box>
            <Box
                sx={theme => ({
                    gridArea: '2 / 1 / 3 / 2'
                })}
            >
                <Editor />
            </Box>
            <Box
                sx={theme => ({
                    gridArea: '1 / 2 / 3 / 3'
                })}
            >
                Sidebar
            </Box>
        </Box>
    );
}

const Calculator: React.FC = () => {

    return (
        <PageLayoutBlank>
            <ReactFlowProvider>
                <EditorLayout />
            </ReactFlowProvider>
        </PageLayoutBlank>
    )
}

export default Calculator;