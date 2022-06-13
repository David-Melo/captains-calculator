import { Box, Text, Image, Group } from "@mantine/core";
import React from "react";

type NeedsBageProps = {
    need: 'electricity' | 'workers' | 'unity' | 'computing' | 'maintenance',
    value: number;
    mode?: 'long' | 'short'
    suffix?: string;
}

const needMap = {
    electricity: {
        label: 'Electricity',
        icon: 'electricity.png',
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
    maintenance: {
        label: 'Maintenance',
        icon: 'Maintenance.png',
        color: '#888c90'
    },
}

const NeedsBage: React.FC<NeedsBageProps> = ({ need, value, mode = 'long', suffix = null }) => {

    if (value === 0) return null;

    if (need === 'electricity') {
        if (value >= 1000) {
            value = value / 1000
            suffix = "mw"
        } else {
            suffix = "kw"
        }
    }

    if (need === 'maintenance') {
        value = Math.round(value * 10) / 10
    }

    if (need === 'unity') {
        value = Math.round(value * 10) / 10
    }

    return (
        <Box
            p={3}
            sx={theme => ({
                borderRadius: theme.radius.sm,
                background: needMap[need].color,
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
                        <Image sx={{ display: 'block' }} height={12} src={`/assets/ui/${needMap[need].icon}`} />
                        <Text color="white" size="xs">{needMap[need].label}</Text>
                    </Group>
                ) : (

                    <Box
                        px={4}
                    >
                        <Image sx={{ display: 'block' }} height={12} src={`/assets/ui/${needMap[need].icon}`} />
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
    )

}

export default NeedsBage;