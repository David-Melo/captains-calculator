import React from "react";
import { createStyles, Divider, Tabs } from "@mantine/core";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react"

import Icons, { IconNames } from "components/ui/Icons"
import { useAppState } from "state";
import { CategoryId } from "state/app/effects";
import { GenericDictionary } from "state/_types";


type CategoryTabsProps = {
    onTabChange(id: CategoryId): void
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

export const CategoryTabs: React.FC<CategoryTabsProps> = ({onTabChange}) => {

    const { items } = useAppState(state => state.categories)
    const { classes } = useTabStyles();
    const [activeTab, setActiveTab] = React.useState(0);

    let categoryTabs: GenericDictionary[] = [
        {
            id: 'all',
            label: 'All',
            icon: `all.png`,
        },
        ...catOrderArray.map(catId=>{
            let cat = items[catId];
            return {
                id: cat.id,
                label: cat.name,
                icon: `${cat.id}.png`
            }
        })
    ]

    const onChange = (active: number, tabKey: CategoryId) => {
        setActiveTab(active);
        onTabChange(tabKey);
    };

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
                return <Tabs.Tab key={tab.id} tabKey={tab.id} icon={tab.icon ? <img height={20} src={`/assets/categories/${tab.icon}`} /> : null} />
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