import { Menu, Button, useMantineTheme, Divider, useMantineColorScheme } from "@mantine/core";
import { Icon } from "@iconify/react";
import Icons from "./Icons";

const ProfileMenu = () => {
    const theme = useMantineTheme();
    const { toggleColorScheme } = useMantineColorScheme();
    return (
        <Menu
            withArrow
            control={
                <Button 
                    px={7} 
                    variant="subtle" 
                    color={theme.colorScheme === 'light' ? 'dark' : 'dark'}
                    
                >
                    <Icon icon={Icons.user} color={theme.colorScheme === 'light' ? theme.colors.red[9] : theme.colors.dark[5]} width={28} />
                </Button>
            }
            sx={{
                display: 'flex'
            }}
        >
            <Menu.Item 
                icon={<Icon icon={theme.colorScheme === 'light' ? Icons.dark : Icons.light} />}
                onClick={()=>toggleColorScheme()}
            >
                Toggle {theme.colorScheme === 'light' ? 'Dark' : 'Light'} Theme
            </Menu.Item>
            <Divider />
        </Menu>
    )
} 

export default ProfileMenu 