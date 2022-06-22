import React from "react";
import { Box, Button, Drawer, Text, Stack, Card, Group, Image } from "@mantine/core";

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
                    <Box p="md">
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
            >
                {renderBody()}
            </Drawer>

            <Box>
                <Text weight="bold" mb="xs">Production Recipe</Text>
                {currentItem ? (
                    <Card
                        onClick={() => setOpened(true)}
                        shadow="xs"
                        p="xs"
                        sx={(theme) => ({
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[6] : theme.colors.dark[9],
                            },
                        })}
                    >
                        <Group position='apart'>
                            <Text weight={500} size="sm">{currentItem.name}</Text>
                            <Box
                                p="xs"
                                sx={theme => ({
                                    borderRadius: theme.radius.sm,
                                    background: theme.colors.dark[3]
                                })}
                            >
                                <Image
                                    height={24}
                                    radius="md"
                                    src={`/assets/products/${currentProduct.icon}`} alt={currentProduct.name}
                                />
                            </Box>
                        </Group>


                    </Card>
                ) : (
                    <Button onClick={() => setOpened(true)}>Open Drawer</Button>
                )}
            </Box>
        </>
    );

}