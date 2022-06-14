import { Box, Text, Image, Group, Tooltip } from "@mantine/core";
import React from "react";
import { useAppState } from "state";
import { BuildCost } from "state/app/effects";

type CostsBadgeProps = {
    product: BuildCost;
    mode?: 'long' | 'short'
    suffix?: string;
}

const CostsBadge: React.FC<CostsBadgeProps> = ({ product, mode = 'short', suffix = null }) => {

    const products = useAppState(state => state.products.items)
    const productData = products[product.id]
    let value = Math.round(product.quantity * 10) / 10

    return (
        <Tooltip
            label={product.name}
            withArrow
            withinPortal
        >
            <Box
                p={3}
                sx={theme => ({
                    borderRadius: theme.radius.sm,
                    background: theme.colors.dark[8],
                    display: 'inline-block'
                })}
            >
                <Box
                    sx={theme => ({
                        display: 'flex',
                        alignItems: 'center'
                    })}
                >

                    {mode === 'long' ? (
                        <Group position="left" spacing={5}>
                            <Image sx={{ display: 'block' }} height={15} src={`/assets/products/${productData.icon}`} />
                            <Text color="white" size="xs">{product.name}</Text>
                        </Group>
                    ) : (

                        <Box
                            px={4}
                        >
                            <Image sx={{ display: 'block' }} height={15} src={`/assets/products/${productData.icon}`} />
                        </Box>)}

                    <Box
                        px={6}
                        py={2}
                        sx={theme => ({
                            borderRadius: theme.radius.sm,
                            background: '#141517'
                        })}
                    >
                        <Text color="white" weight="lighter" sx={{ fontSize: 10 }}>{value}{suffix ? ` ${suffix}` : ''}</Text>
                    </Box>
                </Box>
            </Box>
        </Tooltip>
    )

}

export default CostsBadge;