import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';

import { EditorLayout } from './EditorLayout';
import PageLayoutBlank from '../../components/layout/page/PageLayoutBlank';

const Calculator: React.FC = () => {

    return (
        <PageLayoutBlank>
            <ReactFlowProvider>
                <EditorLayout />
            </ReactFlowProvider>
        </PageLayoutBlank>
    )
}

export default Calculator;