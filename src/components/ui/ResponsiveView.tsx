import { MediaQuery } from "@mantine/core";
import React from "react";

type ResponsiveViewProps = {
    breakPoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    renderDesktop: React.ReactElement;
    renderMobile: React.ReactElement;
}

const ResponsiveView: React.FC<ResponsiveViewProps> = ({ breakPoint = 'md', renderDesktop, renderMobile }) => {

    return (
        <React.Fragment>
            <MediaQuery smallerThan={breakPoint} styles={{ display: 'none' }}>
                {renderDesktop}
            </MediaQuery>
            <MediaQuery largerThan={breakPoint} styles={{ display: 'none' }}>
                {renderMobile}
            </MediaQuery>
        </React.Fragment>
    )

}

export default ResponsiveView;