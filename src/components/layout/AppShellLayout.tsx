import { AppShell, Box, Burger, Button, Divider, Group, Header, MediaQuery, Navbar, ThemeIcon, useMantineTheme, Text, Anchor, useMantineColorScheme } from "@mantine/core"
import React from "react"
import { Link, NavLink, useRoutes } from "react-router-dom"
import { Icon } from '@iconify/react';
import NavContext from "components/navigation/NavContext";
import { RenderNavigator } from "components/navigation/Layout";
import { useAppState } from "state";
import Icons from "components/ui/Icons";

type SideBarNavButtonProps = {
    to: string;
    label: string;
    icon: string;
    onClick?(): void;
}

const SideBarNavButton: React.FC<SideBarNavButtonProps> = ({ to, label, icon, onClick }) => {
    const theme = useMantineTheme();
    return (
        <Button
            variant="subtle"
            color="dark"
            to={to}
            component={NavLink}
            size="lg"
            leftIcon={<ThemeIcon color="dark" variant="outline" size="lg"><Icon icon={icon} width="20" color={theme.colors.red[9]} /></ThemeIcon>}
            onClick={onClick}
            styles={{
                inner: {
                    justifyContent: 'flex-start',

                },
                label: {
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.dark[4]
                }
            }}
            sx={{
                '&.active': {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[3],
                }
            }}
        >
            {label}
        </Button>
    )
}

const TopBarNavButton: React.FC<SideBarNavButtonProps> = ({ to, label, icon, onClick }) => {
    const theme = useMantineTheme();
    return (
        <Button
            variant="subtle"
            color="dark"
            to={to}
            component={NavLink}
            onClick={onClick}
            styles={theme => ({
                inner: {
                    justifyContent: 'flex-start',

                },
                label: {
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[6],

                }
            })}
            sx={{
                '&.active': {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3],
                    '.mantine-Button-label': {
                        color: theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[9],
                    }
                },
                '&:hover .mantine-Button-label': {
                    color: theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[9],
                }
            }}
        >
            {label}
        </Button>
    )
}

const ColorSchemeToggle = () => {
    const theme = useMantineTheme();
    const { toggleColorScheme } = useMantineColorScheme();
    return (
        <Button
            variant="default" 
            color="gray"
            onClick={()=>toggleColorScheme()}
            styles={theme => ({
                inner: {
                    justifyContent: 'flex-start',

                },
                label: {
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[6],

                }
            })}
            sx={{
                '&.active': {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[3],
                    '.mantine-Button-label': {
                        color: theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[9],
                    }
                },
                '&:hover .mantine-Button-label': {
                    color: theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[9],
                }
            }}
        >
            <Icon icon={theme.colorScheme === 'light' ? Icons.dark : Icons.light} color={theme.colorScheme === 'dark' ? theme.white : theme.black}/>
        </Button>
    )
}

const TopBarNavLink: React.FC<SideBarNavButtonProps> = ({ to, label }) => {
    const theme = useMantineTheme();
    return (
        <Button
            variant="subtle"
            color="dark"
            href={to}
            target="_blank"
            component="a"
            styles={theme => ({
                inner: {
                    justifyContent: 'flex-start',

                },
                label: {
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],

                }
            })}
            sx={{
                '&.active': {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3],
                    '.mantine-Button-label': {
                        color: theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[9],
                    }
                },
                '&:hover .mantine-Button-label': {
                    color: theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[9],
                }
            }}
        >
            {label}
        </Button>
    )
}

const AppShellLayout: React.FC = () => {
    const appVersion = useAppState(state=>state.version)
    const { routes, menu } = React.useContext(NavContext);
    const navigator = useRoutes(routes);
    const [opened, setOpened] = React.useState(false);
    const theme = useMantineTheme();
    return (
        <AppShell
            navbarOffsetBreakpoint="md"
            fixed
            padding={0}
            navbar={
                <MediaQuery largerThan="md" styles={{ display: 'none' }}>
                    <Navbar
                        p="md"
                        mt={1}
                        hiddenBreakpoint="xl"
                        hidden={!opened}
                    >
                        <Navbar.Section>
                            <Box px='xl' pt="xs">
                                <Divider mt="lg" mb="md" variant="dashed" />
                            </Box>
                        </Navbar.Section>
                        <Navbar.Section grow>
                            <Group direction="column" spacing="xs" grow>
                                {menu.map((i, k) => {
                                    return <SideBarNavButton key={`nav-item-${k}`} to={i.to} label={i.label} icon={i.icon} onClick={() => setOpened((o) => !o)} />
                                })}
                            </Group>
                        </Navbar.Section>
                    </Navbar>
                </MediaQuery>
            }
            styles={{
                root: {
                    height: '100%'
                },
                body: {
                    height: '100%'
                },
                main: {
                    height: '100%',
                    minHeight: '100%',
                    maxHeight: '100%'
                }
            }}
        >
            <Box
                sx={(theme) => ({
                    height: "100%"
                })}
            >

                <Box>

                    <Header
                        height={70}
                        px="md"
                        sx={theme => ({
                            borderImageSlice: 2,
                            borderBottomWidth: 5,
                            borderImageSource: 'linear-gradient(45deg, #FCA23A, #FCA23A)',
                            backgroundColor: theme.colors.dark[8],

                        })}
                    >

                        <Box
                            sx={(theme) => ({
                                display: 'grid',
                                gridTemplateColumns: '1fr auto',
                                height: '100%'
                            })}
                        >

                            <Group>

                                <MediaQuery largerThan="md" styles={{ display: 'none' }}>
                                    <Burger
                                        opened={opened}
                                        onClick={() => setOpened((o) => !o)}
                                        size="sm"
                                        color={theme.colors.gray[6]}
                                    />
                                </MediaQuery>
                                <Group spacing="xs" align="flex-end">
                                    <a href="/" title="Captain's Calculator">
                                        <img src="/img/logo.png" alt="Captain's Calculator" title="Captain's Calculator" />
                                    </a>
                                    <Text color="white" size="sm">v{appVersion}</Text>
                                </Group>

                            </Group>

                            <Box>

                                <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
                                    <Group
                                        spacing="xs"
                                        grow
                                        sx={{height:'100%'}}
                                    >
                                        {menu.map((i, k) => {
                                            return <TopBarNavButton key={`nav-item-${k}`} to={i.to} label={i.label} icon={i.icon} onClick={() => setOpened((o) => !o)} />
                                        })}
                                        <TopBarNavLink to="https://github.com/David-Melo/captains-calculator/issues" label="Bugs & Issues" icon="bug" />
                                        <ColorSchemeToggle/>
                                    </Group>
                                </MediaQuery>

                            </Box>

                        </Box>

                    </Header>
                </Box>

                <Box
                    className="page-shell-wrapper"
                    sx={{ height: '100%', overflow: 'hidden' }}
                >
                    <RenderNavigator navigator={navigator} />
                </Box>

            </Box>

        </AppShell >
    )
}

export default AppShellLayout