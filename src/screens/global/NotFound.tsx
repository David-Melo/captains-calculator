import React from 'react';
import { Alert } from '@mantine/core';
import { Icon } from '@iconify/react';
import PageLayout from 'components/layout/page/PageLayout';
import PageHeader from 'components/layout/page/PageHeader';

const NotFound: React.FC = () => {
    return (
        <PageLayout
            header={<PageHeader
                title='Page Not Found'
            />}
        >

            <Alert icon={<Icon icon="ph:alien-bold" width="24" />} title="Oops!" color="red">
                Sorry, the page you are looking for cannot be found, my bad.
            </Alert>

        </PageLayout>
    )
}

export default NotFound;