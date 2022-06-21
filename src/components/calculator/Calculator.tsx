import React from 'react';
import { Box, Card, Grid, Image, Group, Divider, Stack, Tooltip, Text, Table } from '@mantine/core';
import PageLayoutBlank from '../../components/layout/page/PageLayoutBlank';
import ReactFlow, { MiniMap, Controls, ReactFlowProvider, Handle, Position, NodeTypes, NodeProps, useNodesState, useEdgesState, addEdge, ReactFlowInstance, Connection, MarkerType, EdgeProps, getSmoothStepPath, EdgeTypes, updateEdge, Edge, useReactFlow, useNodes, BezierEdge, Node, NodeChange, applyNodeChanges, applyEdgeChanges } from 'react-flow-renderer';
import { ProductSelect } from 'components/products/ProductSelect';
import { MachineRecipeSelect } from 'components/recipes/MachineRecipeSelect';
import { ProductMachineSelect } from 'components/products/ProductMachineSelect';
import { useActions, useAppState, useReaction } from 'state';
import { Category, Machine, ProductId, Recipe } from 'state/app/effects';
import { Icon } from '@iconify/react';
import CostsBadge from 'components/ui/CostsBadge';
import CostsIcon from 'components/ui/CostsIcons';
import NeedsBage, { needMap } from 'components/ui/NeedsBadge';
import { ProductSelectDrawer } from 'components/products/ProductSelectDrawer';
import { MachineSelectDrawer } from 'components/machines/MachineSelectDrawer';
import { RecipeSelectDrawer } from '../../components/recipes/RecipeSelectDrawer';
import { getSmartEdge, pathfindingAStarDiagonal, pathfindingAStarNoDiagonal, pathfindingJumpPointNoDiagonal, svgDrawSmoothLinePath, svgDrawStraightLinePath } from '@tisoap/react-flow-smart-edge'
import { sortArray } from 'utils/objects';
import { generateDarkColorHex } from 'utils/colors';
import ProductionNode, { RecipeIOProduct } from 'state/recipes/ProductionNode';
import { NodeDrawer } from 'components/recipes/NodeDrawer';
import logger from 'utils/logger';
import Elk, { ElkNode, ElkPrimitiveEdge } from "elkjs";
import dagre from 'dagre';
import Icons from 'components/ui/Icons';
import RecipeLinkModal from 'components/recipes/RecipeLinkModal';
import { useModals } from '@mantine/modals';
import { DrawerBody, DrawerBodyScrollArea } from 'components/ui/DrawerBody';
import { NodeRecipeLink } from 'components/recipes/NodeRecipeSelect';
import { relative } from 'node:path/win32';

export type RecipeNodeData = ProductionNode
export type LinkNodeData = { recipeId: string, product: RecipeIOProduct, type: string }
export type LinkNode = Node<LinkNodeData>
export type RecipeNode = Node<RecipeNodeData>

const RecipeNodeType = ({ id, data: { recipe, machine, category, inputs, outputs, sources } }: NodeProps<RecipeNodeData>) => {

    const modals = useModals();

    const openContentModal = (direction: 'input'|'output', product: RecipeIOProduct) => {
        const id = modals.openModal({
            title: `Select ${direction==='input'?'Source':'Target'} For ${product.name}`,
            size: 'xl', 
            children: (
                <>
                    <Box sx={{height:400}}>
                    <DrawerBody>
                        <DrawerBodyScrollArea>
                            <Box>
                                <Stack spacing="xs">
                                    {Object.keys(inputs).map((productId, key) => {
                                        try {
                                            let sourceRecipes = sources[productId as ProductId]
                                            let product = inputs[productId]
                                            return (
                                                <NodeRecipeLink
                                                    key={key}
                                                    direction="input"
                                                    recipes={sourceRecipes}
                                                    label={product.name}
                                                    currentNodeId={recipe.id}
                                                    productId={product.id}
                                                />
                                            )
                                        } catch (e: any) {
                                            console.error(e.message)
                                            return productId
                                        }
                                    })}
                                </Stack>
                            </Box>
                        </DrawerBodyScrollArea>
                    </DrawerBody>
                    </Box>
                </>
            ),
        });
    };

    const handleLinkCreate = (direction: 'input'|'output',product: RecipeIOProduct) => {
        console.log('clicked')
        openContentModal(direction,product)
    }

    return (

        <Box
            key={`recipe-node-${id}`}
            sx={theme => ({
                backgroundColor: theme.white,
                borderRadius: theme.radius.sm,
                boxShadow: theme.shadows.sm,
                width: 400
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
                    <Stack spacing="sm" justify="space-around">
                        {Object.keys(inputs).sort((a, b) => sortArray(inputs[a].name, inputs[b].name)).map(productId => {
                            let product = inputs[productId]
                            return (
                                <Box key={`recipe-handle-input-${productId}`} sx={{ marginLeft: !!product.source ? -14 : -47 }} className='nodrag'>
                                    <Group spacing={5} noWrap>
                                        {!product.source && (
                                            <Tooltip
                                                label="Add Input Source"
                                                withArrow
                                                withinPortal
                                                allowPointerEvents
                                            >
                                                <Box
                                                    onClick={()=>handleLinkCreate('input',product)}
                                                    sx={theme => ({
                                                        width: 28,
                                                        height: 28,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        backgroundColor: theme.white,
                                                        borderRadius: theme.radius.sm,
                                                        boxShadow: theme.shadows.sm,
                                                        cursor: "default",
                                                        '&:hover': {
                                                            backgroundColor: theme.colors.gray[2],
                                                        }
                                                    })}
                                                >
                                                    <Icon icon={Icons.add} />
                                                </Box>
                                            </Tooltip>
                                        )}
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
                    <Stack spacing="sm" justify="space-around" align="flex-end">
                        {Object.keys(outputs).sort((a, b) => sortArray(outputs[a].name, outputs[b].name)).map(productId => {
                            let product = outputs[productId]
                            return (
                                <Box key={`recipe-handle-output-${productId}`} sx={{ marginRight: !!product.target ? -14 : -47 }} className='nodrag'>
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
                                        {!product.target && (
                                            <Tooltip
                                                label="Add Output Target"
                                                withArrow
                                                withinPortal
                                                allowPointerEvents
                                            >
                                                <Box
                                                    onClick={()=>handleLinkCreate('output',product)}
                                                    sx={theme => ({
                                                        width: 28,
                                                        height: 28,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        backgroundColor: theme.white,
                                                        borderRadius: theme.radius.sm,
                                                        boxShadow: theme.shadows.sm,
                                                        cursor: "default",
                                                        '&:hover': {
                                                            backgroundColor: theme.colors.gray[2],
                                                        }
                                                    })}
                                                >
                                                    <Icon icon={Icons.add} />
                                                </Box>
                                            </Tooltip>
                                        )}
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

const LinkNodeType = ({ id, data: { product, recipeId, type } }: NodeProps<LinkNodeData>) => {

    return (
        <Handle
            id={`${recipeId}-${product.id}-${type}-add`}
            type={type === 'input' ? 'source' : 'target'}
            position={type === 'input' ? Position.Right : Position.Left}
            style={handleStyle}
        >
            <Box>
                <Tooltip
                    label="Connect Recipe"
                    withArrow
                    withinPortal
                    sx={{ pointerEvents: 'none' }}
                >
                    <Box
                        key={id}
                        sx={theme => ({
                            width: 28,
                            height: 28,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: theme.white,
                            borderRadius: theme.radius.sm,
                            boxShadow: theme.shadows.sm,
                            pointerEvents: 'none',
                            cursor: "default"
                        })}
                    >
                        <Icon icon={Icons.add} />
                    </Box>
                </Tooltip>
            </Box>
        </Handle>
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
            nodePadding: 40,
            drawEdge: svgDrawSmoothLinePath,
            generatePath: pathfindingAStarDiagonal
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

/* From https://github.com/wbkd/react-flow/issues/5#issuecomment-954001434 */
/* 
Get a sense of the parameters at:
https://rtsys.informatik.uni-kiel.de/elklive/examples.html?e=general%2Fspacing%2FnodesEdges 
*/

const elk = new Elk({
    defaultLayoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': 'RIGHT',
        'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
        'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
        'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
        'elk.layered.nodePlacement.strategy': 'LINEAR_SEGMENTS',
        'elk.spacing.nodeNode': '50',
        'elk.layered.spacing.nodeNodeBetweenLayers': '200',
        'elk.layered.crossingMinimization.semiInteractive': 'true'
    }
})

export const createGraphLayout = async (nodes: Array<Node>, edges: Array<Edge>): Promise<Array<Node>> => {
    console.log('generatingLayout')
    const elkNodes: ElkNode[] = [];
    const elkEdges: ElkPrimitiveEdge[] = [];

    nodes.forEach((flowNode) => {
        elkNodes.push({
            id: flowNode.id,
            width: flowNode.width ?? 0,
            height: flowNode.height ?? 0,
        });
    });
    edges.forEach((flowEdge) => {
        elkEdges.push({
            id: flowEdge.id,
            target: flowEdge.target,
            source: flowEdge.source,
        });
    });

    const newGraph = await elk.layout({
        id: "root",
        children: elkNodes,
        edges: elkEdges,
    });
    return nodes.map((flowNode) => {
        const node = newGraph?.children?.find((n) => n.id === flowNode.id);
        if (node?.x && node?.y && node?.width && node?.height) {
            flowNode.position = {
                x: node.x - node.width / 2 + Math.random() / 1000,
                y: node.y - node.height / 2,
            };
        }
        return flowNode;
    });
};

const nodeWidth = 300;
const nodeHeight = 200;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node<any>[], edges: Edge<any>[]) => {

    dagreGraph.setGraph({
        rankdir: 'LR',
        align: 'UR',
        nodesep: 50,
        edgesep: 50,
        ranksep: 150,
        ranker: 'network-simplex',
        acyclicer: 'greedy'
    });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: node.width, height: node.height });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {

        const nodeWithPosition = dagreGraph.node(node.id);

        node.targetPosition = Position.Right
        node.sourcePosition = Position.Left

        let w = node.width !== null ? node.width as number : nodeWidth
        let h = node.height !== null ? node.height as number : nodeHeight

        node.position = {
            x: nodeWithPosition.x,
            y: nodeWithPosition.y,
        };

        return node;
    });

    return { nodes, edges };
};


const nodeTypes: NodeTypes = { RecipeNode: RecipeNodeType, LinkNode: LinkNodeType }
const edgeTypes: EdgeTypes = { smart: RecipeEdgeType }

const Setup = () => {

    const { currentItem: currentProduct } = useAppState(state => state.products)
    const { currentItem: currentMachine } = useAppState(state => state.machines)
    const { currentItem: currentRecipe, currentNode } = useAppState(state => state.recipes)

    const { fitView, getEdges, getNodes, setNodes, setCenter, setEdges } = useReactFlow();

    const fit = async () => {
        let data = getLayoutedElements(
            getNodes(),
            getEdges()
        );
        setNodes(data.nodes)
        setEdges(data.edges)
        fitView({ padding: 0.1, includeHiddenNodes: false, duration: 102 });
    }

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
            <button onClick={fit}>fit</button>
            <NodeDrawer />
        </Box>
    )

}

const handleStyle: React.CSSProperties = { border: 'none', width: 'auto', height: 'auto', position: 'relative', top: 'initial', left: 'initial', right: 'initial', bottom: 'initial', borderRadius: 0, transform: 'initial', backgroundColor: 'transparent' }

type EditorProps = {
    nodesData: Node<ProductionNode | RecipeIOProduct>[];
    edgesData: Edge<any>[];
}

const Editor: React.FC<EditorProps> = ({ nodesData, edgesData }) => {

    // const { fitView, getEdges, setNodes } = useReactFlow();
    const selectNode = useActions().recipes.selectNode
    // const reaction = useReaction()
    // const [graph, setGraph] = React.useState<Array<Node>>()

    const [nodes, setNodes, onNodesChange] = useNodesState(nodesData);
    const [edges, setEdges, onEdgesChange] = useEdgesState(edgesData);



    // const [nodes, setNodes] = React.useState<Node<RecipeNodeData>[]>([]);
    // const [edges, setEdges] = React.useState([]);

    // React.useEffect(() => reaction(
    //     (state) => state.recipes.nodesList,
    //     (nodesList) => {
    //         console.log('ReactionRan')
    //         if (nodesList.length) {
    //             let nodes = nodesList.map(node => {
    //                 return {
    //                     id: node.id,
    //                     type: 'RecipeNode',
    //                     data: node,
    //                     position: { x: 0, y: 0 }
    //                 }
    //             })
    //             createGraphLayout(nodes, [])
    //                 .then(graph => {
    //                     setNodes(graph)
    //                 })
    //         }
    //     },
    //     {
    //         immediate: false
    //     }
    // ))

    // const handleNodesChange = (nodes: NodeChange[]) => {
    //     console.log('handleNodesChange', nodes)
    //     //fitView({ padding: 1 , includeHiddenNodes: true});
    // }

    // const onNodesChange = React.useCallback(
    //     (changes) => console.log(changes),
    //     [setNodes]
    // );

    // const onEdgesChange = React.useCallback(
    //     (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    //     [setEdges]
    // );

    // const onConnectEnd = async () => {
    //     console.log('onConnectEnd')
    // }

    const onConnect = async (params: Connection) => {
        console.log(params)
        console.log('onConnect')
        // @ts-ignore
        params.style.stroke = generateDarkColorHex()
        setEdges((eds) => addEdge(params, eds))
    }

    const onInit = async (reactFlowInstance: ReactFlowInstance<RecipeNodeData>) => {
        reactFlowInstance.setCenter(0, 0)
        let data = getLayoutedElements(
            reactFlowInstance.getNodes(),
            reactFlowInstance.getEdges()
        );
        reactFlowInstance.setNodes(data.nodes)
        reactFlowInstance.setEdges(data.edges)
        reactFlowInstance.fitView({ padding: 0.1, includeHiddenNodes: false, duration: 102 });

    };

    const onNodeClick = (e: any, node: Node<RecipeNodeData>) => {
        selectNode(node.data.id)
    }

    return (
        <ReactFlow
            //defaultZoom={1}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            //onNodeClick={onNodeClick}
            onConnect={onConnect}
            onInit={onInit}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={{ style: { stroke: '#000', strokeWidth: 3 }, animated: true, type: "smart" }}
            snapToGrid
            maxZoom={1}
            minZoom={0.1}
            nodesConnectable={true}
        >
            <MiniMap />
            <Controls />
        </ReactFlow>
    )

}

const EditorWrapper = () => {

    let { nodesData, edgesData } = useAppState(state => state.recipes)

    if (!nodesData.length) return null

    return <Editor key={`editor-${nodesData.length}`} nodesData={nodesData} edgesData={edgesData} />

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
                borderRight: `1px solid ${theme.colors.gray[4]}`,
                borderLeft: `1px solid ${theme.colors.gray[4]}`,
                position: 'relative',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/squared-metal.png")',
                    filter: 'filter: invert(1)',
                },
                '& > div': {
                    position: 'relative'
                }
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