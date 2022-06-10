import React from "react";
import { Button, useMantineColorScheme } from "@mantine/core";
import { matchRoutes, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react"

import Icons from "components/ui/Icons"
import NavContext from "./NavContext";

export const BackButton = () => {

    const { routes } = React.useContext(NavContext);
    const navigate = useNavigate();
    const location = useLocation()
    const matchedRoutes = matchRoutes(routes, location)
    const { colorScheme } = useMantineColorScheme();
    
    const parentRoutes = matchedRoutes?.filter((match)=>{
        let isIndexRoute = !!match.route.index
        let isCurrentRoute = match.pathname === location.pathname
        return !isIndexRoute && !isCurrentRoute
    })

    const parentRoute = parentRoutes?.pop()

    if (!parentRoute) return null;

    const handleBack = () => {
        navigate(parentRoute.pathname)
    }

    return (
        <Button
            onClick={handleBack}
            color={colorScheme==='light'?'dark':'gray'}
            variant="light"
            size="xs"
            px={5}
        >
            <Icon icon={Icons.back} width={18} />
        </Button>
    )

}