import { Box } from '@mantine/core';
import PageHeader from 'components/layout/page/PageHeader';
import PageLayout from 'components/layout/page/PageLayout';
import { ProductMachineSelect } from 'components/products/ProductMachineSelect';
import { ProductSelect } from 'components/ui/ProductSelect';
import React from 'react';
import { useAppState } from 'state';


const Home: React.FC = () => {

    const { currentItem: currentProduct } = useAppState(state=>state.products)

    const renderProduct = () => {
        if (!currentProduct) return null
        return (
            <Box>
                <ProductMachineSelect/>
                <pre>{JSON.stringify(currentProduct, null, 2)}</pre>
            </Box>
        )
    }

    return (
        <PageLayout
            header={<PageHeader
                title={`Welcome`}
            />}
        >
            <ProductSelect/>
            {renderProduct()}

        </PageLayout>
    )
}

export default Home;