import { Box, Text, Image, Group, Tooltip } from "@mantine/core";
import React from "react";

type NeedsBageProps = {
    need: 'electricity' | 'workers' | 'unity' | 'computing' | 'maintenance1' | 'maintenance2',
    value: number;
    mode?: 'long' | 'short'
    suffix?: string;
}

export const needMap = {
    electricity: {
        label: 'Electricity',
        icon: 'Electricity.png',
        color: '#be7405'
    },
    workers: {
        label: 'Workers',
        icon: 'Worker.png',
        color: '#1483b9'
    },
    unity: {
        label: 'Unity',
        icon: 'UnitySmall.png',
        color: '#7026cc'
    },
    computing: {
        label: 'Computing',
        icon: 'Computing.png',
        color: '#3b939f'
    },
    maintenance1: {
        label: 'Maintenance',
        icon: 'Maintenance.png',
        color: '#888c90'
    },
    maintenance2: {
        label: 'Maintenance',
        icon: 'Maintenance.png',
        color: '#888c90'
    },
}

const NeedsBage: React.FC<NeedsBageProps> = ({ need, value, mode = 'short', suffix = null }) => {

    if (value === 0) return null;

    if (need === 'electricity') {
        if (value >= 1000) {
            value = value / 1000
            suffix = "mw"
        } else {
            suffix = "kw"
        }
    }

    if (need === 'maintenance1'||need === 'maintenance2') {
        value = Math.round(value * 10) / 10
    }

    if (need === 'unity') {
        value = Math.round(value * 10) / 10
    }

    let iconFilter = need === 'maintenance2' ? 'brightness(0) saturate(100%) invert(99%) sepia(95%) saturate(7485%) hue-rotate(323deg) brightness(104%) contrast(97%)': ''

    return (
        <Tooltip
            label={needMap[need].label}
            withArrow
            withinPortal
        >
            <Box
                pl={3}
                pr={5}
                sx={theme => ({
                    borderRadius: theme.radius.sm,
                    background: needMap[need].color,
                    height: 30,
                    display: 'flex',
                    alignItems: 'center'
                })}
            >

                {mode === 'long' ? (
                    <Group position="left" spacing={5}>
                        <Image sx={{ display: 'block' }} height={16} src={`/assets/ui/${needMap[need].icon}`} />
                        <Text color="white" size="xs">{needMap[need].label}</Text>
                    </Group>
                ) : (

                    <Box
                        px={6}
                    >
                        <Image sx={{ display: 'block' }} height={16} src={`/assets/ui/${needMap[need].icon}`} styles={{image:{filter:iconFilter}}} />
                    </Box>)}

                <Box
                    px={4}
                    py={1}
                    sx={theme => ({
                        borderRadius: theme.radius.sm,
                        background: '#141517'
                    })}
                >
                    <Text color="white" weight="lighter" sx={{ fontSize: 12 }}>{value}{suffix ? ` ${suffix}` : ''}</Text>
                </Box>
            </Box>
        </Tooltip>
    )

}

export default NeedsBage;