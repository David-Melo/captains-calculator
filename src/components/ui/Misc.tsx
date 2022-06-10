import { Icon } from "@iconify/react";
import { Paper, Text, useMantineTheme } from "@mantine/core"

export const EmptyPageComponent: React.FC<{ label: string }> = ({ label }) => {
    return (
        <Paper
            p="lg"
            sx={(theme) => ({
                backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[8],
            })}
        >
            <Text
                align='center'
                weight={100}
                size='xs'
                sx={(theme) => ({
                    color: theme.colorScheme === 'light' ? theme.colors.gray[5] : theme.colors.dark[4],
                })}
            >
                No {label} Match The Current Filter
            </Text>
        </Paper>
    )
}

export const MobileNavIcon: React.FC<{ icon: string }> = ({ icon }) => {
    const theme = useMantineTheme();
    return (
        <Icon icon={icon} width="24" color={theme.colors.red[9]} />
    )
}