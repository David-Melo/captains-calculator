import React from "react";
import { Box, Group, Text, Select, Image, Tooltip, Indicator, Stack } from "@mantine/core";
import { useAppState, useActions } from '../../state/index';
import { Recipe, RecipeId } from '../../state/app/effects/loadJsonData';
import { Icon } from "@iconify/react";


export const RecipeCard = () => {

    const { currentItem: currentRecipe } = useAppState(state => state.recipes)
    const products = useAppState(state => state.products.items)

    if (!currentRecipe) return null

    let recipeInputs = currentRecipe.inputs.map(p => {
        return {
            ...products[p.id],
            quantity: p.quantity
        }
    })
    let recipeOutputs = currentRecipe.outputs.map(p => {
        return {
            ...products[p.id],
            quantity: p.quantity
        }
    })

    return (
        <Group spacing="xs" noWrap>
            <Group
                noWrap
                spacing="xs"
                sx={theme => ({
                    '& .product-input .product-icon': {
                        color: theme.colors.gray[6]
                    },
                    '& .product-input:last-child .product-icon': {
                        display: 'none'
                    }
                })}
            >
                {recipeInputs.map(product => {
                    return (
                        <Group className="product-input" spacing="xs" key={`input_${product.id}`} noWrap>
                            <Stack spacing={5} align="center">
                                <Indicator label={product.quantity} color="green" radius="xs" styles={{ indicator: { fontSize: 11, height: 'auto', paddingRight: 5, paddingLeft: 5 } }} size={8}>
                                    <Box
                                        p={8}
                                        sx={theme => ({
                                            borderRadius: theme.radius.md,
                                            border: `1px solid ${theme.colors.gray[1]}`,
                                            background: theme.colors.gray[7]
                                        })}
                                    >
                                        <Image src={`/assets/products/${product.icon}`} height={26} width={26} />
                                    </Box>
                                </Indicator>
                                <Text size="xs">{product.name}</Text>
                            </Stack>
                            <Icon className="product-icon" icon="icomoon-free:plus" width={10} />
                        </Group>
                    )
                })}
            </Group>
            <Group
                spacing="xs">
                <Icon className="results-icon" icon="icomoon-free:arrow-right" width={15} />
            </Group>
            <Group
                noWrap
                spacing="xs"
                sx={theme => ({
                    '& .product-output .product-icon': {
                        color: theme.colors.gray[6]
                    },
                    '& .product-output:last-child .product-icon': {
                        display: 'none'
                    }
                })}
            >
                {recipeOutputs.map(product => {
                    return (
                        <Group className="product-output" spacing="xs" key={`output_${product.id}`} noWrap>
                            <Stack spacing={5}>
                                <Indicator label={product.quantity} color="red" radius="xs" styles={{ indicator: { fontSize: 11, height: 'auto', paddingRight: 5, paddingLeft: 5 } }} size={8}>
                                    <Box
                                        p={8}
                                        sx={theme => ({
                                            borderRadius: theme.radius.md,
                                            border: `1px solid ${theme.colors.gray[1]}`,
                                            background: theme.colors.gray[7]
                                        })}
                                    >
                                        <Image src={`/assets/products/${product.icon}`} height={26} width={26} />
                                    </Box>
                                </Indicator>
                            </Stack>
                            <Icon className="product-icon" icon="icomoon-free:plus" width={10} />
                        </Group>
                    )
                })}
            </Group>
        </Group>
    )
}