import { Box, Image, Tooltip, Text, MantineColor, Stack } from "@mantine/core";
import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { useAppState } from "state";
import { BuildCost } from "state/app/effects";

type CostsIconProps = {
    recipeId: string;
    product: BuildCost;
    color?: MantineColor;
}

const CostsIcon: React.FC<CostsIconProps> = ({ product, recipeId, color = "dark" }) => {

    const products = useAppState(state => state.products.items)
    const productData = products[product.id]
    let value = Math.round(product.quantity * 10) / 10

    return (

        <Stack align="center" spacing={5}>
            <Tooltip
                label={product.name}
                withArrow
                withinPortal
            >
                <Box
                    p={6}
                    sx={theme => ({
                        borderRadius: theme.radius.sm,
                        background: theme.colors.dark[3]
                    })}
                >
                    <Image src={`/assets/products/${productData.icon}`} height={28} width={28} />
                </Box>
            </Tooltip>
            <Text weight="bold" size="sm" sx={theme => ({ lineHeight: `${theme.fontSizes.sm}px` })}>{value}</Text>
                    
        </Stack>

    )

}

const CostsIconWithHandleWrapper: React.FC<CostsIconProps> = ({ product, color = "dark" }) => {

    const products = useAppState(state => state.products.items)
    const productData = products[product.id]
    let value = Math.round(product.quantity * 10) / 10

    return (
        <Tooltip
            label={product.name}
            withArrow
            withinPortal
        >
            <Stack align="center" spacing={5}>
                <Box
                    p={6}
                    sx={theme => ({
                        borderRadius: theme.radius.sm,
                        background: theme.colors.dark[4]
                    })}
                >
                    <Image src={`/assets/products/${productData.icon}`} height={28} width={28} />
                </Box>
                <Text weight="bold" size="sm" sx={theme => ({ lineHeight: `${theme.fontSizes.sm}px` })}>{value}</Text>
            </Stack>
        </Tooltip>
    )

}

export default CostsIcon; 