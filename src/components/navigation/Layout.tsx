import { AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return <Outlet />
}

export type RenderNavigatorProps = {
    navigator: React.ReactElement | null
}


export const Portal = () => {

    return (
        <AnimatePresence exitBeforeEnter initial={true} presenceAffectsLayout={false}>
            <Outlet />
        </AnimatePresence>
    )

}

export const RenderNavigator: React.FC<RenderNavigatorProps> = ({ navigator }) => {

    return (
        <AnimatePresence exitBeforeEnter initial={true} presenceAffectsLayout={false}>
            {navigator}
        </AnimatePresence>
    )
}

export default Layout;

