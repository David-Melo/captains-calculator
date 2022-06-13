import React from "react";

export type NavContextType = {
    routes: any[];
    menu: any[];
    mobile: any[];
}

export const NavContext = React.createContext<NavContextType>({routes:[],menu:[],mobile:[]});

export default NavContext;