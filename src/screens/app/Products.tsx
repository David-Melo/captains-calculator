import { Box, Card, Grid, Group, Text, Image } from '@mantine/core';
import PageHeader from 'components/layout/page/PageHeader';
import PageLayout from 'components/layout/page/PageLayout';
import React from 'react';
import { useAppState } from 'state';
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom';

const Products: React.FC = () => {

    const { itemsList } = useAppState(state => state.products)
    const transition = { duration: 0.2, staggerChildren: 0.05 };

    return (
        <PageLayout
            header={<PageHeader
                title={`Products`}
            />}
        >

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
                        {itemsList.map((i, k) => {
                            return (
                                <Grid.Col md={4} key={k}>
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
                                                    <Text weight={500}>{i.name}</Text>
                                                    <Box
                                                        p="xs"
                                                        sx={theme=>({
                                                            borderRadius: theme.radius.md,
                                                            border: `1px solid ${theme.colors.gray[1]}`,
                                                            background: theme.colors.gray[7]
                                                        })}
                                                    >
                                                        <Image
                                                            height={30}
                                                            radius="md"
                                                            src={`/assets/products/${i.icon}`} alt="Random unsplash image"
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

export default Products;