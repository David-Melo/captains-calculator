import React from "react";
import { createStyles, Divider, Tabs } from "@mantine/core";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react"

import Icons, { IconNames } from "components/ui/Icons"

type PageTab = {
    label: string;
    icon?: IconNames;
    route: string;
}

type PageTabsProps = {
    parentId: string;
    tabs: Record<string,PageTab>;
    urlRoot: string;
}

export const PageTabs: React.FC<PageTabsProps> = ({tabs, urlRoot, parentId}) => {

    const {classes} = useTabStyles();
    const navigate = useNavigate();
    const location = useLocation()
    const match = matchPath({ path: `${urlRoot}/:id/:page`, end: true }, location.pathname)

    let activeTab = 0;

    if (match?.params.page) {
        let currentTabIndex = Object.keys(tabs).indexOf(match?.params.page)
        if (currentTabIndex>=0) {
            activeTab = currentTabIndex
        }
    }

    const onChange = (newTabIndex: number) => {
        let newTabKey = Object.keys(tabs)[newTabIndex]
        if (newTabKey) {
            let newTab = tabs[newTabKey]
            navigate(`${urlRoot}/${parentId}/${newTab.route}`)
        }
    };

    if (!parentId) return null;

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
            {Object.keys(tabs).map(tabKey=>{
                let tab = tabs[tabKey];
                return <Tabs.Tab key={tabKey} label={tab.label} icon={ tab.icon ? <Icon icon={Icons[tab.icon]} width={17}/> : null } />
            })}
            
        </Tabs>
    )

}

export const useTabStyles = createStyles((theme) => ({
    tabsListWrapper: {
        backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[9],
        padding: 3,
        borderRadius: theme.radius.sm
    },
    tabActive: {
        backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[0] : theme.colors.dark[5],
        color: theme.colorScheme === 'light' ? theme.colors.gray[8] : theme.colors.dark[1],
    },
    tabControl: {
        fontWeight: 500,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === 'light' ? theme.colors.gray[6] : theme.colors.dark[4],
        '&:hover': {
            color: theme.colorScheme === 'light' ? theme.black : theme.white,
        }
    }
}))

export const TabDivider: React.FC<{label: string}> = ({label}) => <Divider my="xs" mt={0} mb="md" label={label} variant="dashed" labelPosition="center" />
export const TabDividerSpacing: React.FC<{label: string}> = ({label}) => <Divider my="md" label={label} variant="dashed" labelPosition="center" />