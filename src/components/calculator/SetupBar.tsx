import { Box, Divider, Stack} from '@mantine/core';

import { useAppState } from 'state';

import { ProductSelectDrawer } from 'components/products/ProductSelectDrawer';
import { MachineSelectDrawer } from 'components/machines/MachineSelectDrawer';
import { RecipeSelectDrawer } from 'components/recipes/RecipeSelectDrawer';
import { NodeDrawer } from 'components/recipes/NodeDrawer';

export const SetupBar = () => {

    const { currentItem: currentProduct } = useAppState(state => state.products)
    const { currentItem: currentMachine } = useAppState(state => state.machines)
    const { currentItem: currentRecipe } = useAppState(state => state.recipes)

    return (
        <Box>
            <Divider label="Production Chain Setup" mb="sm" />
            <Stack>
                <ProductSelectDrawer />
                {currentProduct && <MachineSelectDrawer />}
                {currentMachine && <RecipeSelectDrawer />}
            </Stack>
            {currentRecipe && (
                <Divider label="Assitional Settings" my="md" mt="xl" />
            )}
            <NodeDrawer />
        </Box>
    )

}