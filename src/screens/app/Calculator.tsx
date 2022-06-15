import React from 'react';
import { Box, Card, Grid, Image, Group, Divider, Stack, Tooltip, Text, Table } from '@mantine/core';
import PageLayoutBlank from '../../components/layout/page/PageLayoutBlank';
import ReactFlow, { MiniMap, Controls, ReactFlowProvider, Handle, Position, NodeTypes, NodeProps, useNodesState, useEdgesState, addEdge, ReactFlowInstance, Connection, MarkerType, EdgeProps, getSmoothStepPath, EdgeTypes, updateEdge, Edge } from 'react-flow-renderer';
import { ProductSelect } from 'components/products/ProductSelect';
import { MachineRecipeSelect } from 'components/recipes/MachineRecipeSelect';
import { ProductMachineSelect } from 'components/products/ProductMachineSelect';
import { useAppState } from 'state';
import { Category, Machine, Recipe } from 'state/app/effects';
import { Icon } from '@iconify/react';
import CostsBadge from 'components/ui/CostsBadge';
import CostsIcon from 'components/ui/CostsIcons';
import NeedsBage, { needMap } from 'components/ui/NeedsBadge';

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

type RecipeEdgeData = {
    label: string;
    recipe: Recipe;
    machine: Machine;
    category: Category;
}

const handleStyle: React.CSSProperties = { width: 'auto', height: 'auto', position: 'relative', top: 'initial', left: 'initial', right: 'initial', bottom: 'initial', borderRadius: 4, transform: 'initial' }

const RecipeEdgeType = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
    markerEnd,
}: EdgeProps<RecipeEdgeData>) => {

    const edgePath = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    console.log({
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
    },data)

    return (
        <>
            <path
                id={id}
                style={style}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
            />
            <text startOffset="50%" textAnchor="middle">
                ok
            </text>
        </>
    );

}

const RecipeNodeType = ({ id, data: { recipe, machine, category } }: NodeProps<RecipeNodeData>) => {

    const { items: allProducts, currentItem: currentProduct } = useAppState(state => state.products)

    return (

        <Group spacing={0}>

            <Stack justify="space-around">
                {recipe.inputs.map(input => {
                    let product = allProducts[input.id]
                    return (
                        <Handle
                            key={`${id}-${input.id}-input`}
                            id={`${id}-${input.id}-input`}
                            type="target"
                            position={Position.Left}
                            style={handleStyle}
                        >
                            <Image src={`/assets/products/${product.icon}`} alt='test' height={22} style={{ margin: 5, pointerEvents: 'none' }} />
                        </Handle>
                    )
                })}
            </Stack>

            <Card p={0}>

                <Box>

                    <Group position="center" p="xs">
                        {/* <Tooltip
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
                        </Tooltip> */}
                        <Text weight="bolder" size="lg" sx={{ lineHeight: '1em' }}>{machine.name}</Text>
                        {/* <Tooltip
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
                        </Tooltip> */}
                    </Group>

                    <Divider my={0} variant="solid" labelPosition="center" color="gray" sx={theme => ({ borderTopColor: theme.colors.gray[4] })} />

                    <Box p="md">

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

            </Card >

            <Stack>
                {recipe.outputs.map(output => {
                    let product = allProducts[output.id]
                    return (
                        <Handle
                            id={`${id}-${output.id}-output`}
                            key={`${id}-${output.id}-output`}
                            type="source"
                            position={Position.Left}
                            style={handleStyle}
                        >
                            <Image src={`/assets/products/${product.icon}`} alt='test' height={22} style={{ margin: 5, pointerEvents: 'none' }} />
                        </Handle>
                    )
                })}
            </Stack>

        </Group>


    );
}

const nodeTypes: NodeTypes = { RecipeNode: RecipeNodeType }
const edgeTypes: EdgeTypes = { RecipeEdge: RecipeEdgeType }

type EditorProps = {
    initialNodes: any;
    initialEdges: any;
}

const Editor: React.FC<EditorProps> = ({ initialNodes, initialEdges }) => {

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = (params: Connection) => {
        console.log('onConnect',params)
        setEdges((eds) => addEdge(params, eds))
    }

    const onInit = (reactFlowInstance: ReactFlowInstance<RecipeNodeData>) => {
        reactFlowInstance.setCenter(0, 0, { zoom: 1 })
    };

    const onEdgeUpdate = (oldEdge: Edge<RecipeEdgeData>, newConnection: Connection) => {
        console.log('onEdgeUpdate',oldEdge,newConnection)
        setEdges((els) => updateEdge(oldEdge, newConnection, els))
    };

    return (
        <ReactFlow
            defaultZoom={1}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeUpdate={onEdgeUpdate}
            onInit={onInit}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={{ style: { stroke: '#000' }, animated: true, type: "RecipeEdge", markerStart: { type: MarkerType.ArrowClosed, color: "red" }, markerEnd: { type: MarkerType.ArrowClosed, color: "green" } }}
        >
            <MiniMap />
            <Controls />
        </ReactFlow>
    )

}

const EditorWrapper = () => {

    const { items: allProducts, currentItem: currentProduct } = useAppState(state => state.products)
    const { items: allMachines, currentItem: currentMachine } = useAppState(state => state.machines)
    const { items: allRecipes, currentItem: currentRecipe } = useAppState(state => state.recipes)
    const { items: allCategories } = useAppState(state => state.categories)
    const { selectedRecipies } = useAppState(state => state.recipes)

    if (!currentRecipe || !currentMachine) return null

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

    return (
        <Editor initialNodes={nodes} initialEdges={[]} />
    )

}

const ResultsSummary = () => {

    const { selectedRecipies } = useAppState(state => state.recipes)
    const { items: allProducts } = useAppState(state => state.products)
    const { items: allMachines } = useAppState(state => state.machines)

    let needs: { [index: string]: { label: string, icon: string, total: number, color: string } } = {
        workers: {
            icon: needMap['workers'].icon,
            label: 'Workers',
            total: 0,
            color: needMap['workers'].color
        },
        electricity: {
            icon: needMap['electricity'].icon,
            label: 'Electricity',
            total: 0,
            color: needMap['electricity'].color
        },
        maintenance1: {
            icon: needMap['maintenance1'].icon,
            label: 'Maintenance I',
            total: 0,
            color: needMap['maintenance1'].color
        },
        maintenance2: {
            icon: needMap['maintenance2'].icon,
            label: 'Maintenance II',
            total: 0,
            color: needMap['maintenance2'].color
        },
        unity: {
            icon: needMap['unity'].icon,
            label: 'Unity',
            total: 0,
            color: needMap['unity'].color
        },
        computing: {
            icon: needMap['computing'].icon,
            label: 'Computing',
            total: 0,
            color: needMap['computing'].color
        }
    }

    let costs: { [index: string]: { label: string, icon: string, total: number } } = {}
    let buildings: { [index: string]: { id: string, label: string, icon: string, total: number } } = {}

    selectedRecipies.forEach(recipe => {

        let machine = allMachines[recipe.machine]

        if (!buildings.hasOwnProperty(machine.id)) {
            buildings[machine.id] = {
                id: machine.id,
                label: machine.name,
                icon: machine.icon,
                total: 0
            }
        }

        if (buildings.hasOwnProperty(machine.id)) {
            console.log(machine.id)
            buildings[machine.id].total += 1
        }

        // Needs

        needs.workers.total += machine.workers
        needs.electricity.total += machine.electricity_consumed
        if (machine.maintenance_cost_units === 'maintenance_i') {
            needs.maintenance1.total += machine.maintenance_cost_quantity
        }
        if (machine.maintenance_cost_units === 'maintenance_ii') {
            needs.maintenance2.total += machine.maintenance_cost_quantity
        }

        needs.unity.total += machine.unity_cost
        needs.computing.total += machine.computing_consumed

        // Costs
        machine.build_costs.forEach(product => {
            let productData = allProducts[product.id]
            if (!costs.hasOwnProperty(product.id)) {
                costs[product.id] = {
                    label: product.name,
                    icon: productData.icon,
                    total: 0
                }
            }
            if (costs.hasOwnProperty(product.id)) {
                costs[product.id].total += product.quantity
            }
        })

    })

    return (
        <Card
            p="xs"
            sx={theme => ({
                border: `1px solid ${theme.colors.green[4]}`
            })}
        >
            <Stack spacing="xs">

                <Table
                    horizontalSpacing={6}
                    verticalSpacing={6}
                    sx={{
                        '& .fitwidth': {
                            width: 1,
                            whiteSpace: 'nowrap'
                        }
                    }}
                >
                    <thead>
                        <tr>
                            <th colSpan={3}>Buildings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(buildings).map((buildingId, k) => {
                            let building = buildings[buildingId]
                            if (building.total > 0) {
                                return (
                                    <tr key={`costs-${buildingId}-${k}`} >
                                        <td className='fitwidth'>
                                            <Box
                                                p={4}
                                                sx={theme => ({
                                                    borderRadius: theme.radius.sm,
                                                    border: `1px solid ${theme.colors.gray[4]}`,
                                                    background: theme.colors.dark[5]
                                                })}
                                            >
                                                <Image
                                                    height={22}
                                                    width={22}
                                                    src={`/assets/buildings/${building.icon}`} alt={building.label}
                                                    sx={{ display: 'block', objectFit: 'contain' }}
                                                />
                                            </Box>
                                        </td>
                                        <td>{building.label}</td>
                                        <td align='right'>x<strong>{building.total}</strong></td>
                                    </tr>
                                )
                            }
                            return null
                        })}
                    </tbody>
                </Table>

                <Table
                    horizontalSpacing={6}
                    verticalSpacing={6}
                    sx={{
                        '& .fitwidth': {
                            width: 1,
                            whiteSpace: 'nowrap'
                        }
                    }}
                >
                    <thead>
                        <tr>
                            <th colSpan={3}>Construction Costs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(costs).map((costId, k) => {
                            let cost = costs[costId]
                            if (cost.total > 0) {
                                return (
                                    <tr key={`costs-${costId}-${k}`} >
                                        <td className='fitwidth'>
                                            <Box
                                                p={6}
                                                sx={theme => ({
                                                    borderRadius: theme.radius.sm,
                                                    border: `1px solid ${theme.colors.gray[4]}`,
                                                    background: theme.colors.dark[5]
                                                })}
                                            >
                                                <Image
                                                    height={18}
                                                    width={18}
                                                    src={`/assets/products/${cost.icon}`} alt={cost.label}
                                                    sx={{ display: 'block', objectFit: 'contain' }}
                                                />
                                            </Box>
                                        </td>
                                        <td>{cost.label}</td>
                                        <td align='right'>x<strong>{cost.total}</strong></td>
                                    </tr>
                                )
                            }
                            return null
                        })}
                    </tbody>
                </Table>

                <Table
                    horizontalSpacing={6}
                    verticalSpacing={6}
                    sx={{
                        '& .fitwidth': {
                            width: 1,
                            whiteSpace: 'nowrap'
                        }
                    }}
                >
                    <thead>
                        <tr>
                            <th colSpan={3}>Needs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(needs).map((needId, k) => {
                            let need = needs[needId]
                            let iconFilter = needId === 'maintenance2' ? 'brightness(0) saturate(100%) invert(99%) sepia(95%) saturate(7485%) hue-rotate(323deg) brightness(104%) contrast(97%)' : ''
                            if (need.total > 0) {
                                return (
                                    <tr key={`needs-${needId}-${k}`} >
                                        <td className='fitwidth'>
                                            <Box

                                                sx={theme => ({
                                                    height: 32,
                                                    width: 32,
                                                    borderRadius: theme.radius.sm,
                                                    border: `1px solid ${theme.colors.gray[4]}`,
                                                    background: need.color,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                })}
                                            >
                                                <Image
                                                    height={18}
                                                    width={18}
                                                    src={`/assets/ui/${need.icon}`} alt={need.label}
                                                    sx={{ display: 'block', objectFit: 'contain' }}
                                                    styles={{ image: { filter: iconFilter } }}
                                                />
                                            </Box>
                                        </td>
                                        <td>{need.label}</td>
                                        <td align='right'>x<strong>{need.total}</strong>
                                        </td>
                                    </tr>
                                )
                            }
                            return null
                        })}
                    </tbody>
                </Table>

            </Stack>
        </Card>
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
                <EditorWrapper />
            </Box>
            <Box
                sx={theme => ({
                    gridArea: '1 / 2 / 3 / 3'
                })}
            >
                <ResultsSummary />
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