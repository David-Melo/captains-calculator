import { Icon } from "@iconify/react";
import { MantineColor } from "@mantine/core";
import { Box, Card, Group, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import Icons, { IconNames } from "./Icons";

type StatsCardProps = {
    icon?: IconNames;
    label?: string;
    value?: number;
    link?: string;
    iconColor?: MantineColor;
}

const StatsCard: React.FC<StatsCardProps> = ({icon = null, label = null,value = null, link = false, iconColor = false, children}) => {

    const renderCardContent = () => {
        return (
            <>
            <Text color="gray" size="xs">{label}</Text>
            <Group position="apart">
                  
                   {icon&&(
                        <Box
                            py="3px"
                            sx={theme=>({
                                lineHeight: `${theme.fontSizes.md}px`,
                                '& .stats-card-icon': {
                                    color: iconColor ? theme.colors[iconColor as MantineColor][9] : theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6]
                                }
                            })}
                        >
                            <Icon icon={Icons[icon]} width="24" className="stats-card-icon" />
                        </Box>
                    )}
                     <Box>                        
                        <Text weight={700} size="xl" sx={theme=>({lineHeight:`${theme.fontSizes.lg}px`})}>{value}</Text>
                   </Box>
               </Group>
            </>
        )
    }

    if (link) {

        return (
            <Card
                component={Link}
                to={link as string}
                shadow="sm"
                p="md"
                sx={(theme) => ({
                    '&:hover': {
                        backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[9],
                    },
                })}
            >
                {renderCardContent()}
            </Card>
        )

    }

    if ( label !== null && value !== null ) {

        return (
            <Card
                shadow="sm"
            >
               {renderCardContent()}
            </Card>
        )

    }

    return (
        <Card
            shadow="sm"
        >
            {children}
        </Card>
    )

}

export default StatsCard;