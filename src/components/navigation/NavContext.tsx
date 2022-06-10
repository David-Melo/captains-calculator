import React from "react";

type NavContextType = {
    routes: any[];
    menu: any[];
    mobile: any[];
}

export const NavContext = React.createContext<NavContextType>({routes:[],menu:[],mobile:[]});

export default NavContext;