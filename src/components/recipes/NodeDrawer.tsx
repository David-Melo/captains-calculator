import React from "react";
import { Box, Button, Drawer, Text, Stack, Card, Group, Image, Divider } from "@mantine/core";

import { useAppState, useActions, useReaction } from 'state';
import RecipeListCard from "./RecipeListCard";
import { DrawerBody, DrawerBodyScrollArea } from "components/ui/DrawerBody";
import { RecipeId } from "state/app/effects";

export const NodeDrawer = () => {

    const reaction = useReaction()
    const node = useAppState(state=>state.recipes.currentNode)
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

    const renderBody = () => {
        return (
            <DrawerBody>
                <DrawerBodyScrollArea>
                    <Box p="xl">
                        <Stack spacing="xs">
                            <Text weight="bold" mb="xs">1. Desired Product</Text>
                        </Stack>
                    </Box>
                </DrawerBodyScrollArea>
            </DrawerBody>
        )
    }

    if (!node) return null

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
        </>
    );

}