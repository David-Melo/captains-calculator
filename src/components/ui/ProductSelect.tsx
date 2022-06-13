import React from "react";
import { Avatar, Group, Text, Select } from "@mantine/core";
import { useAppState, useActions } from '../../state/index';
import { ProductId } from '../../state/app/effects/loadJsonData';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string;
    label: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, ItemProps>(
    ({ image, label, ...others }: ItemProps, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <Avatar src={image} />

                <div>
                    <Text size="sm">{label}</Text>
                </div>
            </Group>
        </div>
    )
);

export const ProductSelect = () => {
    const { itemsList, currentItemId } = useAppState(state=>state.products)
    const selectProduct = useActions().products.selectProduct
    const onChange = (productId: ProductId) => {
        selectProduct(productId)
    }
    return (
        <Select
            size="md"
            value={currentItemId} 
            onChange={onChange}
            label="Select Product"
            placeholder="Pick one"
            itemComponent={SelectItem}
            data={itemsList.map(p=>({
                label: p.name,
                image: `/assets/products/${p.icon}`,
                value: p.id
            }))}
            searchable
            maxDropdownHeight={400}
            nothingFound="Nobody here"
            filter={(value, item) => item.label ? item.label.toLowerCase().includes(value.toLowerCase().trim()) : false}
        />
    )
}