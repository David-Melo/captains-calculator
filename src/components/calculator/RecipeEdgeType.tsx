import { EdgeProps, useNodes } from 'react-flow-renderer';
import { getSmartEdge, pathfindingAStarDiagonal, svgDrawSmoothLinePath } from '@tisoap/react-flow-smart-edge'

export const RecipeEdgeType = ({
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