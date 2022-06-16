import React from 'react';
import { Card, Group, Box, Text, Image } from '@mantine/core';
import { Machine } from 'state/app/effects/loadJsonData';
import { MachineId } from 'state/app/effects/loadJsonData';

type MachineListCardProps = {
    item: Machine;
    active: boolean;
    onSelect(id: MachineId): void;
}

const MachineListCard: React.FC<MachineListCardProps> = ({ item, active, onSelect }) => {
    const onItemClick = React.useCallback((id: MachineId) => {
        onSelect(id)
    }, [item, onSelect]);
    return (
        <Card
            onClick={() => onItemClick(item.id)}
            shadow="xs"
            p="xs"
            sx={(theme) => ({
                cursor: 'pointer',
                backgroundColor: active ? theme.colors.gray[4] : '',
                '&:hover': {
                    backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[6] : theme.colors.dark[9],
                },
            })}
        >
            <Group position='apart'>
                <Text weight={500} size="sm">{item.name}</Text>
                <Box
                    p="xs"
                    sx={theme => ({
                        borderRadius: theme.radius.sm,
                        background: theme.colors.dark[3]
                    })}
                >
                    <Image
                        height={24}
                        radius="md"
                        src={`/assets/buildings/${item.icon}`} alt={item.name}
                    />
                </Box>
            </Group>
        </Card>
    );
};

export default MachineListCard;