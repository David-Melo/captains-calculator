import React from "react";
import { Box, Drawer, Text, Stack } from "@mantine/core";
import { useAppState, useActions, useReaction } from 'state';
import { DrawerBody, DrawerBodyScrollArea } from "components/ui/DrawerBody";
import { ProductId } from "state/app/effects";
import { NodeRecipeLink } from "./NodeRecipeSelect";

export const NodeDrawer = () => {

    const reaction = useReaction()
    const node = useAppState(state => state.recipes.currentNode)
    const deSelectNode = useActions().recipes.deSelectNode
    const [opened, setOpened] = React.useState(false)

    React.useEffect(() => reaction(
        (state) => state.recipes.currentNode,
        (currentNode) => {
            if(currentNode) {
                setOpened(true)
            } else {
                setOpened(false)
            }
        },
        {
            immediate: false
        } 
    ))

    const handleClose = () => {
        deSelectNode()
    }

    if (!node) return null

    const renderBody = () => {
        return (
            <DrawerBody>
                <DrawerBodyScrollArea>
                    <Box p="xl">
                        <Stack spacing="xs">
                            <Text weight="bold" mb="xs">1. Desired Product</Text>
                            {Object.keys(node.inputs).map((productId, key) => {
                                try {
                                    let sources = node.sources[productId as ProductId]
                                    let product = node.inputs[productId]
                                    return (
                                        <NodeRecipeLink
                                            key={key}
                                            direction="input"
                                            recipes={sources}
                                            label={product.name}
                                            currentNodeId={node.id}
                                            productId={product.id}
                                            onSelect={()=>null}
                                        />
                                    )
                                } catch (e: any) {
                                    console.error(e.message)
                                    return productId
                                }
                            })}
                            <Text size="xs">{node.id}</Text>
                        </Stack>
                    </Box>
                </DrawerBodyScrollArea>
            </DrawerBody>
        )
    }

    return (
        <>
            <Drawer
                opened={opened}
                onClose={handleClose}
                title={node.machine.name}
                padding={0}
                size="xl"
                overlayBlur={3}
                position="left"
                styles={(theme) => ({
                    header: {
                        borderBottom: `1px solid ${theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[5]}`,
                        marginBottom: 0,
                        padding: theme.spacing.xl
                    },
                    drawer: {
                        height: '100%',
                        minHeight: '100%',
                        maxHeight: '100%',
                        backgroundColor: theme.colors.gray[1]
                    },
                })}
            >
                {renderBody()}
            </Drawer>
            {/* {Object.keys(node.inputs).map((productId, key) => {
                try {
                    let sources = node.sources[productId as ProductId]
                    let product = node.inputs[productId]
                    return (
                        <NodeRecipeLink
                            key={key}
                            direction="input"
                            recipes={sources}
                            label={product.name}
                            currentNodeId={node.id}
                            productId={product.id}
                        />
                    )
                } catch (e: any) {
                    console.error(e.message)
                    return productId
                }
            })} */}
        </>
    );

}