import React from "react";
import { Box, Button, Drawer, Text, Stack, Card } from "@mantine/core";

import { useAppState, useActions } from 'state';
import RecipeListCard from "./RecipeListCard";
import { DrawerBody, DrawerBodyScrollArea } from "components/ui/DrawerBody";
import { RecipeId } from "state/app/effects";

export const RecipeSelectDrawer = () => {

    const currentProduct = useAppState(state => state.products.currentItem)
    const currentMachine = useAppState(state => state.machines.currentItem)

    const { itemsList, currentItem } = useAppState(state => state.recipes)

    const selectRecipe = useActions().recipes.selectRecipe
    const selectRecipesItem = useActions().recipes.selectRecipesItem

    const [opened, setOpened] = React.useState(false)

    const handleSelectMachine = (id: RecipeId) => {
        selectRecipe(id)
        selectRecipesItem(id)
        setOpened(false)
    }

    if (!currentMachine || !currentProduct) return null;

    let filteredItems = itemsList.filter(recipe => {
        return currentMachine.recipes.indexOf(recipe.id as RecipeId) >= 0 && recipe.outputs.find(product => product.id === currentProduct.id)
    })

    const renderBody = () => {
        return (
            <DrawerBody>
                <DrawerBodyScrollArea>
                    <Box p="md" pt={0}>
                        <Stack spacing="xs">
                            {filteredItems.map((i, k) => <RecipeListCard key={k} item={i} active={currentItem?.id === i.id} onSelect={() => handleSelectMachine(i.id)} />)}
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
                onClose={() => setOpened(false)}
                title="Select Recipe"
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

            <Box>
                <Text weight="bold" mb="xs">Production Recipe</Text>
                {currentItem ? (
                    <Card
                        onClick={() => setOpened(true)}
                        shadow="xs"
                        sx={(theme) => ({
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[6] : theme.colors.dark[9],
                            },
                        })}
                    >
                        <Text weight={500}>{currentItem.name}</Text>
                        <Text size="sm">{currentMachine.name}</Text>
                    </Card>
                ) : (
                    <Button onClick={() => setOpened(true)}>Open Drawer</Button>
                )}
            </Box>
        </>
    );

}