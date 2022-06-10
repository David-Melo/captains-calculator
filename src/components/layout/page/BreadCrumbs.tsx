import React from 'react';
import { NavLink } from "react-router-dom";
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import { Breadcrumbs as BreadcrumbsComponent } from '@mantine/core';
import { Icon } from '@iconify/react';
import NavContext from 'components/navigation/NavContext';

const BreadCrumbs: React.FC<{ current?: string }> = ({ current = null }) => {
    const navContext = React.useContext(NavContext);
    const breadcrumbs = useBreadcrumbs(navContext.routes);

    return (
        <div className="text-sm breadcrumbs">
            <BreadcrumbsComponent separator={<Icon icon="eva:chevron-right-fill" width={18} />}
                styles={theme=>({
                    separator: {
                        margin: 0
                    },
                    breadcrumb: {
                        color: theme.colors.gray[7],
                        fontSize: 12,
                        lineHeight: "20px",
                        textDecoration: "none"
                    }
                })}
                style={{ marginBottom: 0 }}>
                {breadcrumbs.map((item, k) => {
                    return <NavLink key={`breadcrumb-${k}`} to={item.match.pathname}>{item.breadcrumb}</NavLink>
                })}
                {current && <NavLink to="#">{current}</NavLink>}
            </BreadcrumbsComponent>
        </div>

    );
}

export default BreadCrumbs;