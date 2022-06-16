import React from "react";
import { createStyles, Box, Tabs, Card, Grid, Group, Image } from '@mantine/core';
import { useAppState, useActions } from 'state';
import { CategoryId } from "state/app/effects";
import { GenericDictionary } from "state/_types";
import AnimatedList, { AnimateListItem } from "./AnimatedList";


type CategoryTabsProps = {

}

let catOrderArray = [
    'general_machines',
    'water_extraction_and_processing',
    'food_production',
    'metallurgy_and_smelting',
    'power_production',
    'crude_oil_refining', 
    'waste_management',
    'storage',
    'buildings',
    'buildings_for_vehicles',
    'housing_and_services',
    'cargo_docks'
]

export const CategoryTabs: React.FC<CategoryTabsProps> = () => {

    const { items: categories, currentItemId: currentCategoryId } = useAppState(state => state.categories)
    const { selectCategory } = useActions().categories
    const { classes } = useTabStyles();
    const [activeTab, setActiveTab] = React.useState(currentCategoryId === null ? 0 : Object.keys(categories).indexOf(currentCategoryId) + 1)

    let categoryTabs: GenericDictionary[] = [
        {
            id: 'all',
            label: 'Categories',
            icon: `all.png`,
        },
        ...catOrderArray.map(catId => {
            let cat = categories[catId];
            return {
                id: cat.id,
                label: cat.name,
                icon: `${cat.id}.png`
            }
        })
    ]

    const onChange = (active: number, tabKey: CategoryId | 'all') => {
        setActiveTab(active);
        selectCategory(tabKey === 'all' ? null : tabKey);
    };

    if (currentCategoryId === null) {
        return (
            <Box>
                <AnimatedList>
                    <Grid>
                        {categoryTabs.filter(c => c.id !== 'all').map((cat, key) => {
                            return (
                                <Grid.Col md={6} key={cat.id}>
                                    <AnimateListItem itemKey={cat.id} >
                                        <Card
                                            onClick={() => onChange(key, cat.id)}
                                            shadow="xs"
                                            sx={(theme) => ({
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[9],
                                                },
                                            })}
                                        >
                                            <Group position="apart">
                                                {cat.label}
                                                <Box
                                                    p={3}
                                                    sx={theme => ({
                                                        borderRadius: theme.radius.sm,
                                                        background: theme.colors.dark[5]
                                                    })}
                                                >
                                                    <Image src={`/assets/categories/${cat.icon}`} alt={cat.label}/>
                                                </Box>
                                            </Group>
                                        </Card>
                                    </AnimateListItem>
                                </Grid.Col>
                            )
                        })}
                    </Grid>
                </AnimatedList>
            </Box>
        )
    }

    return (
        <Tabs
            active={activeTab}
            onTabChange={onChange}
            grow
            variant="unstyled"
            mb="md"
            classNames={{
                tabsListWrapper: classes.tabsListWrapper,
                tabControl: classes.tabControl,
                tabActive: classes.tabActive,
            }}
        >
            {categoryTabs.map(tab => {
                return <Tabs.Tab key={tab.id} tabKey={tab.id} icon={tab.icon ? <img height={20} src={`/assets/categories/${tab.icon}`} alt={tab.label} /> : null} />
            })}

        </Tabs>
    )

}

export const useTabStyles = createStyles((theme) => ({
    tabsListWrapper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.dark[9],
        padding: 3,
        borderRadius: theme.radius.sm
    },
    tabActive: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[5],
        color: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.dark[1],
    },
    tabControl: {
        fontWeight: 500,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.gray[6] : theme.colors.dark[4],
        '&:hover': {
            color: theme.colorScheme === 'dark' ? theme.black : theme.white,
        }
    }
}))