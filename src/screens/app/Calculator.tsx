import React from 'react';
import { Box, Card, Grid, Image, Group, Divider, Stack, Tooltip, Text, Table } from '@mantine/core';
import PageLayoutBlank from '../../components/layout/page/PageLayoutBlank';
import ReactFlow, { MiniMap, Controls, ReactFlowProvider, Handle, Position, NodeTypes, NodeProps, useNodesState, useEdgesState, addEdge, ReactFlowInstance, Connection, MarkerType, EdgeProps, getSmoothStepPath, EdgeTypes, updateEdge, Edge, useReactFlow, useNodes, BezierEdge, Node, NodeChange, applyNodeChanges, applyEdgeChanges } from 'react-flow-renderer';
import { ProductSelect } from 'components/products/ProductSelect';
import { MachineRecipeSelect } from 'components/recipes/MachineRecipeSelect';
import { ProductMachineSelect } from 'components/products/ProductMachineSelect';
import { useActions, useAppState, useReaction } from 'state';
import { Category, Machine, Recipe } from 'state/app/effects';
import { Icon } from '@iconify/react';
import CostsBadge from 'components/ui/CostsBadge';
import CostsIcon from 'components/ui/CostsIcons';
import NeedsBage, { needMap } from 'components/ui/NeedsBadge';
import { ProductSelectDrawer } from 'components/products/ProductSelectDrawer';
import { MachineSelectDrawer } from 'components/machines/MachineSelectDrawer';
import { RecipeSelectDrawer } from '../../components/recipes/RecipeSelectDrawer';
import { getSmartEdge, pathfindingAStarNoDiagonal, pathfindingJumpPointNoDiagonal } from '@tisoap/react-flow-smart-edge'
import { sortArray } from 'utils/objects';
import { createGraphLayout } from 'utils/graph';
import { generateDarkColorHex } from 'utils/colors';
import ProductionNode from 'state/recipes/ProductionNode';
import { NodeDrawer } from 'components/recipes/NodeDrawer';

type RecipeNodeData = ProductionNode

type EditorProps = {
    initialNodes: any;
    initialEdges: any;
}

const RecipeNodeType = ({ id, data: { machine, category, inputs, outputs } }: NodeProps<RecipeNodeData>) => {

    return (

        <Box
            key={`recipe-node-${id}`}
            sx={theme => ({
                backgroundColor: theme.white,
                borderRadius: theme.radius.sm,
                boxShadow: theme.shadows.sm
            })}
        >

            <Box>
                <Group position="apart" px="md" pt="md" pb={0}>
                    <Tooltip
                        label={category.name}
                        withArrow
                        withinPortal
                    >
                        <Box
                            p={4}
                            sx={theme => ({
                                borderRadius: theme.radius.sm,
                                background: theme.colors.dark[3]
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
                                background: theme.colors.dark[3]
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


            </Box>

            <Divider py="xs" variant="solid" labelPosition="center" label="Inputs & Outputs" color="gray" sx={theme => ({ borderTopColor: theme.colors.gray[4] })} />
            <Grid gutter={40}>
                <Grid.Col span={6}>
                    <Stack spacing="sm" justify="space-around" sx={{ marginLeft: -14 }} >
                        {Object.keys(inputs).sort((a, b) => sortArray(inputs[a].name, inputs[b].name)).map(productId => {
                            let product = inputs[productId]
                            return (
                                <Box key={`recipe-handle-input-${productId}`}>
                                    <Group spacing={5} noWrap>
                                        <Handle
                                            key={`${id}-${product.id}-input`}
                                            id={`${id}-${product.id}-input`}
                                            type="target"
                                            position={Position.Left}
                                            style={handleStyle}
                                        >
                                            <Box sx={theme => ({
                                                width: 28,
                                                height: 28,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: theme.colors.red[8],
                                                borderRadius: theme.radius.sm,
                                                pointerEvents: 'none'
                                            })}
                                            >
                                                <Text color="white" align="center" size="sm" sx={{ lineHeight: 24 }}>{product.quantity}</Text>
                                            </Box>
                                        </Handle>
                                        <Group spacing={5} noWrap>
                                            <Box
                                                sx={theme => ({
                                                    border: `1px dashed ${theme.colors.gray[4]}`,
                                                    borderRadius: theme.radius.sm,
                                                    padding: 3
                                                })}
                                            >
                                                <Image src={`/assets/products/${product.icon}`} alt='test' height={22} width={22} style={{ pointerEvents: 'none' }} />
                                            </Box>
                                            <Text sx={{ whiteSpace: 'nowrap' }}>{product.name}</Text>
                                        </Group>
                                    </Group>
                                </Box>
                            )
                        })}
                    </Stack>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Stack spacing="sm" justify="space-around" sx={{ marginRight: -14 }} align="flex-end">
                        {Object.keys(outputs).sort((a, b) => sortArray(outputs[a].name, outputs[b].name)).map(productId => {
                            let product = outputs[productId]
                            return (
                                <Box key={`recipe-handle-output-${productId}`}>
                                    <Group spacing={5} noWrap>
                                        <Group spacing={5} noWrap>
                                            <Text sx={{ whiteSpace: 'nowrap' }}>{product.name}</Text>
                                            <Box
                                                sx={theme => ({
                                                    border: `1px dashed ${theme.colors.gray[4]}`,
                                                    borderRadius: theme.radius.sm,
                                                    padding: 3
                                                })}
                                            >
                                                <Image src={`/assets/products/${product.icon}`} alt='test' height={22} width={22} style={{ pointerEvents: 'none' }} />
                                            </Box>
                                        </Group>
                                        <Handle
                                            key={`${id}-${product.id}-output`}
                                            id={`${id}-${product.id}-output`}
                                            type="source"
                                            position={Position.Right}
                                            style={handleStyle}
                                        >
                                            <Box sx={theme => ({
                                                width: 28,
                                                height: 28,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: theme.colors.green[8],
                                                borderRadius: theme.radius.sm,
                                                pointerEvents: 'none'
                                            })}
                                            >
                                                <Text color="white" align="center" size="sm" sx={{ lineHeight: 24 }}>{product.quantity}</Text>
                                            </Box>
                                        </Handle>
                                    </Group>
                                </Box>
                            )
                        })}
                    </Stack>
                </Grid.Col>
            </Grid>

            <Divider py="xs" variant="solid" labelPosition="center" label="Costs & Needs" color="gray" sx={theme => ({ borderTopColor: theme.colors.gray[4] })} />
            <Box pb="md" px="md">

                <Group spacing={4} position="center">
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


        </Box >


    );
}

const RecipeEdgeType = ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerStart,
    markerEnd,
}: EdgeProps<any>) => {

    const nodes = useNodes()

    const getSmartEdgeResponse = getSmartEdge({
        sourcePosition,
        targetPosition,
        sourceX,
        sourceY,
        targetX,
        targetY,
        nodes,
        options: {
            nodePadding: 30,
            generatePath: pathfindingAStarNoDiagonal
        }
    })

    if (!getSmartEdgeResponse) return null

    const { svgPathString } = getSmartEdgeResponse

    return (
        <>
            <path
                style={style}
                className='react-flow__edge-path'
                d={svgPathString}
                markerEnd={markerEnd}
                markerStart={markerStart}
            />
        </>
    );

}

const nodeTypes: NodeTypes = { RecipeNode: RecipeNodeType }
const edgeTypes: EdgeTypes = { smart: RecipeEdgeType }

const Setup = () => {

    const { currentItem: currentProduct } = useAppState(state => state.products)
    const { currentItem: currentMachine } = useAppState(state => state.machines)
    const { currentItem: currentRecipe, currentNode } = useAppState(state => state.recipes)

    const { setNodes, getNodes } = useReactFlow();

    const handleSelect = async () => {
        let prevNodes = getNodes()
        let graph = await createGraphLayout(prevNodes.concat([{
            id: Date.now().toString(),
            type: 'source',
            data: {},
            position: { x: 0, y: 0 }
        }]), [])
        setNodes(graph)
        //linkRecipe(recipeId)

    }

    //const { fitView, getEdges, getNodes, setNodes, setCenter } = useReactFlow();

    // const fit = async () => {
    //     let graph = await createGraphLayout(getNodes(), getEdges())
    //     setNodes(graph)
    //     //fitView({ padding: 0.25 });
    // }

    return (
        <Box>
            <Divider label="Production Chain Setup" mb="sm" />
            <Stack>
                <ProductSelectDrawer />
                {currentProduct && <MachineSelectDrawer />}
                {currentMachine && <RecipeSelectDrawer />}
            </Stack>
            {currentRecipe && (
                <Divider label="Assitional Settings" my="md" mt="xl" />
            )}
            <button onClick={handleSelect}>fit</button>
            <NodeDrawer />
            <Text size="xs"><pre>{JSON.stringify(currentNode?.sources, null, 4)}</pre></Text>
        </Box>
    )

}

const handleStyle: React.CSSProperties = { width: 'auto', height: 'auto', position: 'relative', top: 'initial', left: 'initial', right: 'initial', bottom: 'initial', borderRadius: 0, transform: 'initial', backgroundColor: 'transparent' }

const EditorWrapper: React.FC = () => {

    //const { fitView, getEdges, setNodes } = useReactFlow();
    const selectNode = useActions().recipes.selectNode
    const reaction = useReaction()
    // const [graph, setGraph] = React.useState<Array<Node>>()

    // const [nodes, setNodes, onNodesChange] = useNodesState([]);
    // const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const [nodes, setNodes] = React.useState<Node<RecipeNodeData>[]>([]);
    const [edges, setEdges] = React.useState([]);

    React.useEffect(() => reaction(
        (state) => state.recipes.nodesList,
        (nodesList) => {
            console.log('ReactionRan')
            if (nodesList.length) {
                let nodes = nodesList.map(node => {
                    return {
                        id: node.id,
                        type: 'RecipeNode',
                        data: node,
                        position: { x: 0, y: 0 }
                    }
                })
                createGraphLayout(nodes, [])
                    .then(graph => {
                        setNodes(graph)
                    })
            }
        },
        {
            immediate: false
        }
    ))

    // const handleNodesChange = (nodes: NodeChange[]) => {
    //     console.log('handleNodesChange', nodes)
    //     //fitView({ padding: 1 , includeHiddenNodes: true});
    // }

    // const onNodesChange = React.useCallback(
    //     (changes) => setNodes(async (nds: SetStateAction<Node<ProductionNode>[]>) => {
    //         let changed = applyNodeChanges(changes, nds)
    //         let graph = await createGraphLayout(changed, [])
    //         return graph
    //     }),
    //     [setNodes]
    // );
    // const onEdgesChange = React.useCallback(
    //     (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    //     [setEdges]
    // );

    // const onConnectEnd = async () => {
    //     console.log('onConnectEnd')
    // }

    // const onConnect = async (params: Connection) => {
    //     console.log('onConnect')
    //     // @ts-ignore
    //     params.style.stroke = generateDarkColorHex()
    //     setEdges((eds) => addEdge(params, eds))
    // }

    // const onInit = async (reactFlowInstance: ReactFlowInstance<RecipeNodeData>) => {
    //     console.log('onInit');
    // };

    const onNodeClick = (e: any, node: Node<RecipeNodeData>) => {
        selectNode(node.data.id)
    }

    return (
        <ReactFlow
            //defaultZoom={1}
            nodes={nodes}
            edges={edges}
            //onNodesChange={handleNodesChange}
            //onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            //onConnect={onConnect}
            //onInit={onInit}            
            //onConnectEnd={onConnectEnd}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={{ style: { stroke: '#000', strokeWidth: 3 }, animated: true, type: "smart" }}
        >
            <MiniMap />
            <Controls />
        </ReactFlow>
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
        <Box>

            <Text weight="bold" mb="xs">Production Chain Summary</Text>

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
        </Box>
    )

}

const EditorLayout = () => {

    return (
        <Box
            sx={theme => ({
                height: '100%',
                display: 'grid',
                gridTemplateColumns: '300px 1fr 300px',
                gridColumnGap: 0,
                gridRowGap: 0
            })}
        >
            <Box
                p="md"
                sx={theme => ({ backgroundColor: theme.colors.gray[1] })}
            >
                <Setup />
            </Box>
            <Box sx={theme => ({
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/squared-metal.png")',
                borderRight: `1px solid ${theme.colors.gray[4]}`,
                borderLeft: `1px solid ${theme.colors.gray[4]}`
            })}>
                <EditorWrapper />
            </Box>
            <Box
                p="md"
                sx={theme => ({ backgroundColor: theme.colors.gray[1] })}
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