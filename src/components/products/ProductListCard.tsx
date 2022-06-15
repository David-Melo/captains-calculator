import React from 'react';
import { Card, Group, Box, Text, Image } from '@mantine/core';
import { Product } from 'state/app/effects/loadJsonData';
import { ProductId } from '../../state/app/effects/loadJsonData';

type ProductListCardProps = {
    item: Product;
    active: boolean;
    onSelect(id: ProductId): void;
}

export const ProductListCardEmpty: React.FC<{onSelect(): void}> = ({ onSelect }) => {
    const onItemClick = React.useCallback(() => {
        onSelect()
    }, [onSelect]);
    return (
        <Card
            onClick={() => onItemClick()}
            shadow="xs"
            sx={(theme) => ({
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[6] : theme.colors.dark[9],
                },
            })}
        >
            <Group position='apart'>
                <Text weight={500} color="dimmed">No Product Selected</Text>
                <Box
                    p="xs"
                    sx={theme => ({
                        borderRadius: theme.radius.md,
                        background: theme.colors.gray[7]
                    })}
                >
                    <Image
                        height={30}
                        radius="md"
                        src={`/assets/products/Placeholder.png`} alt="No Product Selected"
                    />
                </Box>
            </Group>
        </Card>
    );
};

const ProductListCard: React.FC<ProductListCardProps> = ({ item, active, onSelect }) => {
    const onItemClick = React.useCallback((id: ProductId) => {
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
            <Group position='apart'>
                <Text weight={500}>{item.name}</Text>
                <Box
                    p="xs"
                    sx={theme => ({
                        borderRadius: theme.radius.md,
                        background: theme.colors.gray[7]
                    })}
                >
                    <Image
                        height={30}
                        radius="md"
                        src={`/assets/products/${item.icon}`} alt={item.name}
                    />
                </Box>
            </Group>
        </Card>
    );
};

export default ProductListCard;