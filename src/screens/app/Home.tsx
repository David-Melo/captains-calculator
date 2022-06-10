import PageHeader from 'components/layout/page/PageHeader';
import PageLayout from 'components/layout/page/PageLayout';
import React from 'react';

const Home: React.FC = () => {

    return (
        <PageLayout
            header={<PageHeader
                title={`Welcome`}
            />}
        >

        </PageLayout>
    )
}

export default Home;