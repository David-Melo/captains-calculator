import { Box, Card, Grid, Group, Text, Image, Stack } from '@mantine/core';
import PageHeader from 'components/layout/page/PageHeader';
import PageLayout from 'components/layout/page/PageLayout';
import React from 'react';
import { useAppState } from 'state';
import { Link } from 'react-router-dom';
import NeedsBage from 'components/ui/NeedsBadge';
import { CategoryTabs } from 'components/ui/CategoryTabs';
import AnimatedList, { AnimateListItem } from '../../components/ui/AnimatedList';

const Buildings: React.FC = () => {

    const { itemsList } = useAppState(state => state.machines)
    const { currentItemId: currentCategoryId, currentItem: currentCategory } = useAppState(state => state.categories)


    let filteredItems = itemsList.filter(items => {
        if (currentCategoryId === null) return true;
        return currentCategoryId === items.category_id
    })

    return (
        <PageLayout
            header={<PageHeader
                title={`Buildings & Machines`}
            />}
        >

            {currentCategoryId === null ? (
                <Box>
                    <CategoryTabs />
                </Box>
            ) : (
                <Box>
                    <CategoryTabs />
                    <Text size="xl" weight="bold" mb="md">{currentCategoryId === null ? 'All Items' : currentCategory?.name}</Text>
                    <AnimatedList>
                        <Grid>
                            {filteredItems.map((i, key) => {
                                return (
                                    <Grid.Col md={12} key={key}>
                                        <AnimateListItem itemKey={i.id} >

                                            <Box>
                                                <Card
                                                    component={Link}
                                                    to={`/buildings/${i.id}`}
                                                    shadow="xs"
                                                    sx={(theme) => ({
                                                        '&:hover': {
                                                            backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[9],
                                                        },
                                                    })}
                                                >
                                                    <Group position='apart'>
                                                        <Stack justify="space-between">
                                                            <Text weight={500} size="lg">{i.name}</Text>
                                                            <Group spacing={2}>
                                                                <NeedsBage need="workers" value={i.workers} />
                                                                <NeedsBage need="maintenance" value={i.maintenance_cost_quantity} />
                                                                <NeedsBage need="electricity" value={i.electricity_consumed} />
                                                                <NeedsBage need="unity" value={i.unity_cost} />
                                                                <NeedsBage need="computing" value={i.computing_consumed} suffix="tf" />
                                                            </Group>
                                                        </Stack>
                                                        <Box
                                                            p="sm"
                                                            sx={theme => ({
                                                                borderRadius: theme.radius.md,
                                                                border: `1px solid ${theme.colors.gray[2]}`,
                                                                background: theme.colors.gray[0]
                                                            })}
                                                        >
                                                            <Image
                                                                height={43}
                                                                radius="md"
                                                                src={`/assets/buildings/${i.icon}`} alt={i.name}
                                                            />
                                                        </Box>
                                                    </Group>
                                                </Card>
                                            </Box>

                                        </AnimateListItem>
                                    </Grid.Col>
                                )
                            })}
                        </Grid>
                    </AnimatedList>
                </Box>
            )}

        </PageLayout>
    )
}

export default Buildings;