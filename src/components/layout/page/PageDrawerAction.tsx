import React from 'react';
import { Text, Box, Drawer, Button, MediaQuery, MantineColor, MantineSize, ButtonVariant } from '@mantine/core';
import Icons from 'components/ui/Icons';
import { Icon } from '@iconify/react';

export type PageDrawerActionProps<T extends DrawerActionProps> = {
    title: string;
    icon?: string;
    action: React.FC<any>;
    props: Omit<T, "onClose">;
    color?: MantineColor;
    variant?: ButtonVariant;
    size?: MantineSize;
    iconColor?: string;
}

export type DrawerActionProps = {
    onClose: () => void;
}
 
function PageDrawerAction<T extends DrawerActionProps>({
    title,
    icon = Icons.add,
    action,
    props,
    color = "blue",
    iconColor = "white",
    size = "sm",
    variant = "filled"
}: React.PropsWithChildren<PageDrawerActionProps<T>>
): React.ReactElement {

    const PageAction = action
    const [opened, setOpened] = React.useState(false);

    return (
        <Box>

            <Drawer
                position="right"
                opened={opened}
                onClose={() => setOpened(false)}
                title={title}
                padding={0}
                size="xl"
                styles={(theme)=>({
                    header: {
                        borderBottom: `1px solid ${theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[5]}`,
                        marginBottom: 0,
                        padding: theme.spacing.xl
                    },
                    drawer: { 
                        height: '100%',
                        minHeight: '100%',
                        maxHeight: '100%',
                    },
                })}
            >
                <PageAction {...props} onClose={() => setOpened(false)} />
            </Drawer>

            <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
                <Button
                    onClick={() => setOpened(true)}
                    rightIcon={<Icon icon={icon} color={iconColor} width={18} />}
                    color={color}
                    variant={variant}
                    size={size}
                >
                    <Text>{title}</Text>
                </Button>
            </MediaQuery>

            <MediaQuery largerThan="md" styles={{ display: 'none' }}>
                <Box>
                    <Button 
                        onClick={() => setOpened(true)}
                        color={color}
                        variant={variant}
                        size="xs"
                        px={5}
                    >
                        <Icon icon={icon} color={iconColor} width={18} />
                    </Button>
                </Box>
            </MediaQuery>

        </Box>
    );
}

export default PageDrawerAction;