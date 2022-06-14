import { Box, Image, Tooltip, Indicator } from "@mantine/core";
import React from "react";
import { useAppState } from "state";
import { BuildCost } from "state/app/effects";

type CostsIconProps = {
    product: BuildCost;
}

const CostsIcon: React.FC<CostsIconProps> = ({ product }) => {

    const products = useAppState(state => state.products.items)
    const productData = products[product.id]
    let value = Math.round(product.quantity * 10) / 10

    return (
        <Tooltip
            label={product.name}
            withArrow
            withinPortal
        >
            <Indicator label={value} color="red" radius="xs" styles={{ indicator: { fontSize: 11, height: 'auto', paddingRight: 5, paddingLeft: 5 } }} size={8}>
                <Box
                    p={6}
                    sx={theme => ({
                        borderRadius: theme.radius.md,
                        border: `1px solid ${theme.colors.gray[1]}`,
                        background: theme.colors.gray[7]
                    })}
                >
                    <Image src={`/assets/products/${productData.icon}`} height={24} width={24} />
                </Box>
            </Indicator>
        </Tooltip>
    )

} 

export default CostsIcon; 