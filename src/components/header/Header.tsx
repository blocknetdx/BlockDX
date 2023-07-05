import './header.css';
import { SvgIcon } from '../svg-icon';
import React from 'react';

interface headerNavItemProps {
    label: string
    content: string
}

export function Header():React.ReactElement {
    const headerNavItems = [
        {
            label: 'Selected Market',
            content: 'PIVX/LTC'
        },
        {
            label: 'Latest Trade Price',
            content: '0.004924 LTC',
        },
        {
            label: '24hr Price',
            content: '+119.79%',
        },
        {
            label: '24 hr Volume',
            content: '238.5 LTC',
        },
    ];

    const headerTitle = 'BLOCK DX';

    const renderNavItems = ():React.ReactElement => {
        return (
            <ul className="navbar-nav">
                {
                    headerNavItems.map(({label, content}: headerNavItemProps, index) => (
                        <li className="nav-item nav-item-container d-flex flex-column" key={`${label}-${index}`}>
                            <span className="nav-item-label" aria-current="page">{label}</span>
                            <span className="nav-item-content">{content}</span>
                        </li>
                    ))
                }
            </ul>
        )
    }
    return (
        <nav className="navbar navbar-expand-sm navbar-light bg">
            <div className="container-fluid">
                <SvgIcon classProp='navbar-brand logo' rightIcon='logo' type='link' />
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    {renderNavItems()}
                </div>
            </div>
        </nav>
    );

}