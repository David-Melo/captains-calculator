import { Box, Image, Tooltip } from "@mantine/core";
import React from "react";
import { Product } from "state/app/effects";

type CostsIconProps = {
    product: Product;
}

const ProductIcon: React.FC<CostsIconProps> = ({ product }) => {

    return (
        <Tooltip
            label={product.name}
            withArrow
            withinPortal
        >
            <Box
                p={5}
                sx={theme => ({
                    borderRadius: theme.radius.sm,
                    background: theme.colors.dark[4]
                })}
            >
                <Image src={`/assets/products/${product.icon}`} height={24} width={24} />
            </Box>
        </Tooltip>
    )

}

export default ProductIcon; 