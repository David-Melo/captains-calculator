import React from 'react';
import ReactFlow, { MiniMap, Controls, Position, NodeTypes, useNodesState, useEdgesState, addEdge, ReactFlowInstance, Connection, EdgeTypes, Edge, Node } from 'react-flow-renderer';
import dagre from 'dagre';

import { useAppState } from 'state';
import ProductionNode from 'state/recipes/ProductionNode';

import { generateDarkColorHex } from 'utils/colors';

import { RecipeNodeType } from './RecipeNodeType';
import { RecipeEdgeType } from './RecipeEdgeType';
import { Box, Loader } from '@mantine/core';
import { AnimatePresence, motion } from 'framer-motion';

export type RecipeNodeData = ProductionNode
export type RecipeNode = Node<RecipeNodeData>

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

        node.position = {
            x: nodeWithPosition.x - (!!node.width ? node.width / 2 : 0),
            y: nodeWithPosition.y - (!!node.height ? node.height / 2 : 0)
        };

        return node;
    });

    return { nodes, edges };
};

const nodeTypes: NodeTypes = { RecipeNode: RecipeNodeType }
const edgeTypes: EdgeTypes = { smart: RecipeEdgeType }

type EditorProps = {
    nodesData: Node<ProductionNode>[];
    edgesData: Edge<any>[];
}

export const Editor: React.FC<EditorProps> = ({ nodesData, edgesData }) => {

    // const { fitView, getEdges, setNodes } = useReactFlow();
    //const selectNode = useActions().recipes.selectNode
    // const reaction = useReaction()
    // const [graph, setGraph] = React.useState<Array<Node>>()

    const [loading, setLoading] = React.useState(true)

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
        reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false, duration: 100 });
        console.log(reactFlowInstance.getViewport())
        //await new Promise(resolve=>setTimeout(resolve,1000))
        setLoading(false)

    };

    // const onNodeClick = (e: any, node: Node<RecipeNodeData>) => {
    //     selectNode(node.data.id)
    // }

    return (
        <React.Fragment>
            <AnimatePresence>
                {loading && (
                    <motion.div
                        variants={{
                            enter: { opacity: 0, transition: { duration: 0 } },
                            target: { opacity: 1, transition: { duration: 0 } },
                            exit: { opacity: 0, transition: { duration: .5 } }
                        }}
                        initial="enter"
                        animate="target"
                        exit="exit"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            zIndex: 9999,
                            
                        }}
                    >

                        <Box sx={theme => ({
                            background: theme.colorScheme === 'light' ? theme.white : theme.colors.dark[8],
                            backgroundImage: 'url("https://www.transparenttextures.com/patterns/squared-metal.png")',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            zIndex: 9999,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        })}>
                            <Loader size="xl" color="dark" />
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
            <ReactFlow
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
        </React.Fragment>
    )

}

export const EditorWrapper = () => {

    let { nodesData, edgesData } = useAppState(state => state.recipes)

    if (!nodesData.length) return null

    return <Editor key={`editor-${nodesData.length}`} nodesData={nodesData} edgesData={edgesData} />

}
