import React from 'react';
import { Card, Group, Box, Text, Image, Tooltip, Indicator } from '@mantine/core';
import { Recipe } from 'state/app/effects/loadJsonData';
import { RecipeId } from 'state/app/effects/loadJsonData';
import { useAppState } from 'state';
import { Icon } from '@iconify/react';

type RecipeListCardProps = {
    item: Recipe;
    active: boolean;
    onSelect(id: RecipeId): void;
}

const RecipeListCard: React.FC<RecipeListCardProps> = ({ item, active, onSelect }) => {

    const products = useAppState(state => state.products.items)

    let recipeInputs = item.inputs.map(p => {
        return {
            ...products[p.id],
            quantity: p.quantity
        }
    })
    let recipeOutputs = item.outputs.map(p => {
        return {
            ...products[p.id],
            quantity: p.quantity
        }
    })

    const onItemClick = React.useCallback((id: RecipeId) => {
        onSelect(id)
    }, [item, onSelect]);
    
    return (
        <Card
            onClick={() => onItemClick(item.id)}
            shadow="xs"
            sx={(theme) => ({
                cursor: 'pointer',
                backgroundColor: active ? theme.colors.gray[4] : '',
                '&:hover': {
                    backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[6] : theme.colors.dark[9],
                },
            })}
        >
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
                                    <Tooltip
                                        label={product.name}
                                        withArrow
                                        color="green"
                                        withinPortal
                                    >
                                        <Indicator label={product.quantity} color="green" radius="xs" styles={{ indicator: { fontSize: 11, height: 'auto', paddingRight: 5, paddingLeft: 5 } }} size={8}>
                                            <Box
                                                p={8}
                                                sx={theme => ({
                                                    borderRadius: theme.radius.md,
                                                    border: `1px solid ${theme.colors.gray[1]}`,
                                                    background: theme.colors.gray[7]
                                                })}
                                            >
                                                <Image src={`/assets/products/${product.icon}`} height={22} width={22} />
                                            </Box>
                                        </Indicator>
                                    </Tooltip>
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
                                    <Tooltip
                                        label={product.name}
                                        withArrow
                                        color="red"
                                        withinPortal
                                    >
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
                                    </Tooltip>
                                    <Icon className="product-icon" icon="icomoon-free:plus" width={10} />
                                </Group>
                            )
                        })}
                    </Group>
                </Group>
        </Card>
    );
};

export default RecipeListCard;