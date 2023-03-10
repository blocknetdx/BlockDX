import React, { useState } from 'react';
import './header.css';

export default function Header() {
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

    const renderNavItems = () => {
        return (
            <ul className="navbar-nav">
                {
                    headerNavItems.map(({label, content}) => (
                        <li className="nav-item nav-item-container d-flex flex-column">
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
                <a className="navbar-brand logo">
                    <img className='logo-vector' />
                    {headerTitle}
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    {renderNavItems()}
                </div>
            </div>
        </nav>
    );

}