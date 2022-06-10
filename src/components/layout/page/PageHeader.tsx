import React, { ReactElement } from 'react';
import { Title, Box, Group } from '@mantine/core';
import BreadCrumbs from './BreadCrumbs';
import ResponsiveView from 'components/ui/ResponsiveView';
import { BackButton } from 'components/navigation/BackButton';
type PageHeaderProps = {
    title: string;
    badge?: ReactElement;
    renderAction?: ReactElement;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, renderAction, badge }) => {

    return (
        <Box sx={(theme) => ({
            background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1],
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            [theme.fn.smallerThan('md')]: {
                height: 70,
            },
            [theme.fn.largerThan('md')]: {
                height: 90,
            },
        })}>
            <ResponsiveView
                renderDesktop={
                    <Group position='apart' px="md">
                        <Box>
                            <BreadCrumbs />
                            <Group>
                                <Title order={2} sx={{ lineHeight: '30px' }}>{title}</Title>
                                {badge}
                            </Group>
                        </Box>
                        {renderAction}
                    </Group>
                }
                renderMobile={
                    <Box px="md">
                        <Group position='apart'>
                            <Group spacing="xs">
                                <BackButton/>
                                <Group>
                                    <Title order={2} sx={theme => ({ fontSize: theme.fontSizes.lg })}>{title}</Title>
                                    {badge}
                                </Group>
                            </Group>
                            {renderAction}
                        </Group>
                    </Box>
                }
            />
        </Box>
    )
}

export default PageHeader;