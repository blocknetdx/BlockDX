import React, { useState } from 'react';
import { SvgIcon } from '../svg-icon';
import './SideBar.css'
import { SideBarContent, sideBarContentHeaderTitleType, sideBarContentHeaderTitles } from './SideBarContent';

export default function SideBar() {
    const sideBarTopIcons = [
        'swap-horizontal',
        'wallet',
        'setting',
        'help'
    ]
    const sideBarBottomIcons = [
        'twitter',
        'discord',
        'github',
        'email'
    ]

    const [showSideBarContent, setShowSideBarContent] = useState<sideBarContentHeaderTitleType>('none');

    const handleShowSideBarContent = (type?: sideBarContentHeaderTitleType) => {
        console.log('showSideBarContent: ', showSideBarContent, type);
        
        setShowSideBarContent(showSideBarContent === type ? 'none' : type);
    }

    const renderSideBarHeaderIcons = () => {
        return (
            <ul className="nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mx-auto text-center justify-content-between w-100 px-3 align-items-center side-bar-icons-container">
                {
                    Object.keys(sideBarContentHeaderTitles).map((icon: sideBarContentHeaderTitleType) => {
                        if (icon === 'none') return null;
                        return (
                            <li className="nav-item" key={`side-top-bar-${icon}`}>
                                <SvgIcon 
                                    classProp='nav-link py-3 px-2'
                                    rightIconCategory='sideBar'
                                    rightIcon={icon}
                                    type={'button'}
                                    onClick={() => handleShowSideBarContent(icon)}
                                />
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
    const renderSideBarBottomIcons = () => {
        return (
            <ul className="nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mx-auto text-center justify-content-between w-100 px-3 align-items-center side-bar-icons-container">
                {
                    sideBarBottomIcons.map((icon) => {
                        if (icon === 'none') return null;
                        return (
                            <li className="nav-item" key={`side-top-bar-${icon}`}>
                                <SvgIcon 
                                    classProp='nav-link py-3 px-2'
                                    rightIconCategory='sideBar'
                                    rightIcon={icon}
                                    type='link'
                                />
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
    return (
        <div className="container-fluid px-1 h-100">
            <div className="row h-100">
                <div className="col-sm-auto sticky-top h-100">
                    <div className="d-flex flex-column flex-nowrap bg-dark align-items-center sticky-top h-100 justify-content-between">
                        {renderSideBarHeaderIcons()}
                        {renderSideBarBottomIcons()}
                    </div>
                </div>
                {
                    showSideBarContent !== 'none' ? 
                        <SideBarContent type={showSideBarContent} handleCloseSideBarContent={() => setShowSideBarContent('none')} /> :
                        null
                }
            </div>
        </div>
    );
}