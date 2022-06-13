import React from "react";
import { Avatar, Group, Text, Select } from "@mantine/core";
import { useAppState, useActions } from '../../state/index';
import { MachineId } from '../../state/app/effects/loadJsonData';

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

export const ProductMachineSelect = () => {
    const currentProduct = useAppState(state=>state.products.currentItem)
    const { itemsList, currentItemId } = useAppState(state=>state.machines)
    const selectMachine = useActions().machines.selectMachine
    const onChange = (machineId: MachineId) => {
        selectMachine(machineId)
    }
    if (!currentProduct) return null;
    let filteredMachines = itemsList.filter(m=>currentProduct.machines.output.indexOf(m.id)>=1)
    return (
        <Select
            size="md"
            value={currentItemId} 
            onChange={onChange}
            label="Select Building"
            placeholder="Pick one"
            itemComponent={SelectItem}
            data={filteredMachines.map(p=>({
                label: p.name,
                image: `/assets/buildings/${p.icon}`,
                value: p.id
            }))}
            searchable
            maxDropdownHeight={400}
            nothingFound="Nobody here"
            filter={(value, item) => item.label ? item.label.toLowerCase().includes(value.toLowerCase().trim()) : false}
        />
    )
}