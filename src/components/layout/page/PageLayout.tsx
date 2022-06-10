import React from 'react';
import { Box, Text, MediaQuery, ScrollArea } from '@mantine/core';
import NavContext from 'components/navigation/NavContext';
import { NavLink } from 'react-router-dom';
import { MobileNavIcon } from 'components/ui/Misc';

type PageLayoutProps = {
    header?: React.ReactElement;
    showFooterNav?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ header = null, children, showFooterNav = true }) => {
    const { mobile } = React.useContext(NavContext);
    return (
        <Box
            sx={theme=>({
                height: '100%',
                display: 'grid',
                [theme.fn.smallerThan('md')]: {
                    gridTemplateRows: showFooterNav ? 'auto 1fr auto' : 'auto 1fr',
                },
                [theme.fn.largerThan('md')]: {
                    gridTemplateRows: 'auto 1fr',
                },
            })}
        >

            {header}

            <Box sx={{ position: 'relative', height: '100%' }}>

                <ScrollArea
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0
                    }}
                >

                    <Box sx={(theme) => ({
                        padding: theme.spacing.md,
                        paddingTop: 0
                    })}>
                        {children}
                    </Box>

                </ScrollArea>

            </Box>

            {showFooterNav && (
                <MediaQuery largerThan="md" styles={{ display: 'none' }}>
                    <Box
                        sx={theme => ({
                            backgroundColor: theme.colors.dark[9]
                        })}
                    >
                        <Box sx={theme=>({
                            height: 70,
                            display: "grid",
                            gridTemplateColumns: `repeat(${mobile.length}, 1fr)`,
                            '& .mobile-nav-item': {
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                textTransform: "uppercase",
                                color: theme.colors.gray[0],
                                textDecoration: "none",
                                fontWeight: 800,
                                '&.active': {
                                    backgroundColor: theme.colors.dark[6]
                                },
                                '&:hover': {
                                    backgroundColor: theme.colors.dark[6]
                                }
                            }
                        })}>
                            {mobile.map((i, k) => {
                                return (
                                    <NavLink
                                        key={`mobile-nav-item-${k}`}
                                        to={i.to}
                                        className="mobile-nav-item"
                                    >
                                        <MobileNavIcon icon={i.icon} />
                                        <Text size="xs" mt={2}>{i.label}</Text>
                                    </NavLink>
                                )
                            })}
                        </Box>
                    </Box>
                </MediaQuery>
            )}

        </Box>
    )
}

export default PageLayout;