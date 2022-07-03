import { Box, Divider, Stack} from '@mantine/core';

import { useAppState } from 'state';

import { ProductSelectDrawer } from 'components/calculator/ProductSelectDrawer';
import { BuildingSelectDrawer } from 'components/calculator/BuildingSelectDrawer';
import { RecipeSelectDrawer } from 'components/calculator/RecipeSelectDrawer';
import { NodeDrawer } from 'components/calculator/NodeDrawer';

export const SetupBar = () => {

    const { currentItem: currentProduct } = useAppState(state => state.products)
    const { currentItem: currentMachine } = useAppState(state => state.machines)
    const { currentItem: currentRecipe } = useAppState(state => state.recipes)

    return (
        <Box>
            <Divider label="Production Chain Setup" mb="sm" />
            <Stack>
                <ProductSelectDrawer />
                {currentProduct && <BuildingSelectDrawer />}
                {currentMachine && <RecipeSelectDrawer />}
            </Stack>
            {/* {currentRecipe && (
                <Divider label="Additional Settings" my="md" mt="xl" />
            )} */}
            <NodeDrawer />
        </Box>
    )

}