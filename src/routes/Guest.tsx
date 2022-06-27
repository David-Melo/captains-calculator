import Layout from "components/navigation/Layout";
import Icons from "components/ui/Icons";

import NotFound from "screens/global/NotFound";
//import Home from "screens/app/Home";
//import Buildings from "screens/app/Buildings";
//import Products from "screens/app/Products";
//import Recipes from '../screens/app/Recipes';
import Calculator from '../screens/app/Calculator';

let guestRoutes = {
    routes: [
        {
            path: '/',
            element: <Layout />,
            breadcrumb: 'Layout',
            children: [
                { index: true, element: <Calculator />, breadcrumb: 'Calculator' },
                //{ path: "buildings", element: <Buildings />, breadcrumb: 'Buildings' },
                //{ path: "products", element: <Products />, breadcrumb: 'Products' },
                //{ path: "recipes", element: <Calculator />, breadcrumb: 'Recipes' },
                { path: "*", element: <NotFound />, breadcrumb: 'Page Not Found', }
            ]
        }
    ],
    menu: [
        {
            to: '/',
            label: "Calculator",
            icon: Icons.home
        },
        // {
        //     to: '/buildings',
        //     label: "Buildings",
        //     icon: Icons.home
        // },
        // {
        //     to: '/products',
        //     label: "Products",
        //     icon: Icons.home
        // },
        // {
        //     to: '/recipes',
        //     label: "Recipes",
        //     icon: Icons.home
        // }
    ],
    mobile: [
        {
            to: '/',
            label: "Calculator",
            icon: Icons.home
        },
        // {
        //     to: '/buildings',
        //     label: "Home",
        //     icon: Icons.home
        // },
        // {
        //     to: '/products',
        //     label: "Products",
        //     icon: Icons.home
        // },
        // {
        //     to: '/recipes',
        //     label: "Recipes",
        //     icon: Icons.home
        // }
    ]
}

export default guestRoutes;