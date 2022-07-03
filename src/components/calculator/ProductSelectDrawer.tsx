import React, { ChangeEvent } from "react";
import { Icon } from "@iconify/react";
import { Box, Button, Drawer, Input, Text, Stack } from "@mantine/core";

import Icons from "components/ui/Icons";

import { useAppState, useActions } from 'state';
import ProductListCard from "./ProductListCard";
import { DrawerBody, DrawerBodyScrollArea } from "components/ui/DrawerBody";
import { ProductId } from "state/app/effects";

export const ProductSelectDrawer = () => {

    const { itemsList, currentItem } = useAppState(state => state.products)

    const selectProduct = useActions().products.selectProduct
    const selectMachine = useActions().machines.selectMachine
    const selectRecipe = useActions().recipes.selectRecipe
    const delectRecipesItem = useActions().recipes.delectRecipesItem
    const resetNodes = useActions().recipes.resetNodes

    const [opened, setOpened] = React.useState(false)
    const [filter,setFilter] = React.useState('')

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => { 
        setFilter(e.target.value)
    }

    const handleSelectProduct = (id: ProductId) => {
        setFilter('')
        selectMachine(null)
        selectRecipe(null)
        delectRecipesItem(null)
        resetNodes()
        selectProduct(id)
        setOpened(false)
    }

    let filteredItems = filter.length < 3 ? itemsList : itemsList.filter(item=>item.name.toLowerCase().includes(filter.toLowerCase().trim()))

    const renderBody = () => {
        return (
            <DrawerBody>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateRows: 'auto 1fr'
                    }}
                >
                    <Box
                        p="md"
                    >
                        <Input
                            value={filter}
                            onChange={handleFilterChange}
                            icon={<Icon icon={Icons.search} />}
                            placeholder="Product Search"
                            size="lg"
                        />
                    </Box>
                    <DrawerBodyScrollArea>
                        <Box p="md" pt={0}>
                            <Stack spacing="xs">
                                {filteredItems.map((i, k) => <ProductListCard key={k} item={i} active={currentItem?.id === i.id} onSelect={() => handleSelectProduct(i.id)} />)}
                            </Stack>
                        </Box>
                    </DrawerBodyScrollArea>
                </Box>
            </DrawerBody>
        )
    }
 
    return (
        <>
            <Drawer
                opened={opened}
                onClose={() => setOpened(false)}
                title="Select Product"
                padding={0}
                size="xl"
                overlayBlur={3}
                position="left"
            >
                {renderBody()}
            </Drawer>

            <Box>
                <Text weight="bold" mb="xs">1. Desired Product</Text>
                {currentItem ? (
                    <ProductListCard item={currentItem} active={false} onSelect={() => setOpened(true)} />
                ) : (
                    <Button onClick={() => setOpened(true)}>Click To Select</Button>
                )}
            </Box>
        </>
    );

}