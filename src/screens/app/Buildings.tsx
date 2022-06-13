import { Box, Card, Grid, Group, Text, Image, Stack, Tabs } from '@mantine/core';
import PageHeader from 'components/layout/page/PageHeader';
import PageLayout from 'components/layout/page/PageLayout';
import React from 'react';
import { useAppState } from 'state';
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom';
import NeedsBage from 'components/ui/NeedsBadge';
import { CategoryTabs } from 'components/ui/CategoryTabs';
import { CategoryId } from 'state/app/effects';

const Buildings: React.FC = () => { 

    const { itemsList } = useAppState(state => state.machines)
    const { items: categories } = useAppState(state => state.categories)
    const [currentCategory,setCurrentCategory] = React.useState<'all'|CategoryId>('all')
    const transition = { duration: 0.2, staggerChildren: 0.05 };

    const onTabChange = (catId: CategoryId) => {
        setCurrentCategory(catId)
    }

    let filteredItems = itemsList.filter(items=>{
        if (currentCategory==='all') return true;
        return currentCategory === items.category_id
    })

    return (
        <PageLayout
            header={<PageHeader
                title={`Buildings & Machines`}
            />}
        >

            <CategoryTabs onTabChange={onTabChange}/>

            <Text size="xl" weight="bold" mb="md">{currentCategory==='all'?'All Items':categories[currentCategory].name}</Text>

            <AnimatePresence>
                <motion.div
                    variants={{
                        hidden: { opacity: 0, transition },
                        show: { opacity: 1, transition },
                        close: {
                            opacity: 0,
                            transition
                        }
                    }}
                    initial="hidden"
                    animate="show"
                    exit="close"
                >
                    <Grid>
                        {filteredItems.map((i, k) => {
                            return (
                                <Grid.Col md={12} key={k}>
                                    <motion.div
                                        variants={{
                                            hidden: { opacity: 0, transition },
                                            show: { opacity: 1, transition },
                                            close: {
                                                opacity: 0,
                                                transition
                                            }
                                        }}
                                    >
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
                                    </motion.div>
                                </Grid.Col>
                            )
                        })}
                    </Grid>
                </motion.div>
            </AnimatePresence>

        </PageLayout>
    )
}

export default Buildings;