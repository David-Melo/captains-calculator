import { AnimatePresence, motion } from "framer-motion";

const AnimatedList: React.FC = ({ children }) => {
    const transition = { duration: 0.15, staggerChildren: 0.04 };
    return (
        <AnimatePresence>
            <motion.div
                key="tabs"
                variants={{
                    hidden: { opacity: 0, transition },
                    show: { opacity: 1, transition },
                    close: { opacity: 0 }
                }}
                initial="hidden"
                animate="show"
                exit="close"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )

}

export const AnimateListItem: React.FC<{ itemKey: string }> = ({ itemKey, children }) => {
    return (
        <motion.div
            key={itemKey}
            variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1 },
                close: { opacity: 0 }
            }}
        >
            {children}
        </motion.div>
    )
}

export default AnimatedList;