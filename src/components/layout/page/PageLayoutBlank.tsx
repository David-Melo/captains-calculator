import React from 'react';
import { Box } from '@mantine/core';
import { motion } from 'framer-motion'
import { useReaction } from 'state';
import Loader from 'components/app/Loader';

const PageLayoutBlank: React.FC = ({ children }) => {

    const [navigating, setNavigating] = React.useState<boolean>(false)
    const reaction = useReaction()

    React.useEffect(() => reaction(
        (state) => state.navigating,
        (navigating) => {
            setNavigating(navigating)
        },
        {
            immediate: true
        }
    ))

    return (
        <Box
            sx={{
                height: '100%',
            }}
        >

            <motion.div
                variants={{
                    enter: { y: -100, opacity: 0, transition: { duration: 0.25 } },
                    target: { y: 0, opacity: 1, transition: { duration: 0.25 } },
                    exit: { y: 0, opacity: 0, transition: { duration: 0.25 } }
                }}
                initial="enter"
                animate="target"
                exit="exit"
                style={{ height: '100%', position: 'relative' }}
            >
                { !navigating ? children : <Loader />}
            </motion.div>

        </Box>
    )
}

export default PageLayoutBlank;