import Elk, { ElkNode, ElkPrimitiveEdge } from "elkjs";
import { Node, Edge } from "react-flow-renderer";

/* From https://github.com/wbkd/react-flow/issues/5#issuecomment-954001434 */
/* 
Get a sense of the parameters at:
https://rtsys.informatik.uni-kiel.de/elklive/examples.html?e=general%2Fspacing%2FnodesEdges 
*/
 
const DEFAULT_WIDTH = 330;
const DEFAULT_HEIGHT = 75;
const DEFAULT_WIDTH_FOR_ROOT = 170;

const elk = new Elk({
  defaultLayoutOptions: {
    'elk.algorithm': 'layered',
    'elk.direction': 'RIGHT',
    'elk.spacing.edgeNode': '130',
    'elk.layered.spacing.nodeNodeBetweenLayers': '130'
  }
})

export const createGraphLayout = async (nodes: Array<Node>, edges: Array<Edge>): Promise<Array<Node>> => {
    const elkNodes: ElkNode[] = [];
    const elkEdges: ElkPrimitiveEdge[] = [];

    nodes.forEach((flowNode) => {
        elkNodes.push({
            id: flowNode.id,
            width: flowNode.id === "0" ? DEFAULT_WIDTH_FOR_ROOT : flowNode.width ?? DEFAULT_WIDTH,
            height: flowNode.height ?? DEFAULT_HEIGHT,
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