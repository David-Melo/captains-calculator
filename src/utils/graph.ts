import Elk, { ElkNode, ElkPrimitiveEdge } from "elkjs";
import { Node, Edge } from "react-flow-renderer";

/* From https://github.com/wbkd/react-flow/issues/5#issuecomment-954001434 */
/* 
Get a sense of the parameters at:
https://rtsys.informatik.uni-kiel.de/elklive/examples.html?e=general%2Fspacing%2FnodesEdges 
*/

const elk = new Elk({
    defaultLayoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': 'RIGHT',
        'elk.hierarchyHandling': 'SEPARATE_CHILDREN',
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