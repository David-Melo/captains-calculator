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
                p={6}
                sx={theme => ({
                    borderRadius: theme.radius.md,
                    border: `1px solid ${theme.colors.gray[1]}`,
                    background: theme.colors.gray[7]
                })}
            >
                <Image src={`/assets/products/${product.icon}`} height={28} width={28} />
            </Box>
        </Tooltip>
    )

}

export default ProductIcon; 