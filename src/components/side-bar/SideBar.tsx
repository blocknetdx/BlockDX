import React, { useState } from 'react';
import { SvgIcon } from '../svg-icon';
import './SideBar.css'
import { SideBarContent, SideBarContentHeaderTitleType, sideBarContentHeaderTitles } from './SideBarContent';

export default function SideBar() {
    const sideBarTopIcons = [
        'swap-horizontal',
        'wallet',
        'setting',
        'help-circle-outline'
    ]
    const sideBarBottomIcons = [
        'twitter',
        'discord',
        'github',
        'web'
    ]

    const [showSideBarContent, setShowSideBarContent] = useState<SideBarContentHeaderTitleType>('none');

    const handleShowSideBarContent = (type?: SideBarContentHeaderTitleType) => {
        console.log('showSideBarContent: ', showSideBarContent, type);
        
        setShowSideBarContent(showSideBarContent === type ? 'none' : type);
    }

    const renderSideBarHeaderIcons = () => {
        return (
            <ul className="nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mx-auto text-center justify-content-between w-100 px-3 align-items-center side-bar-icons-container">
                {
                    Object.keys(sideBarContentHeaderTitles).map((icon: SideBarContentHeaderTitleType) => {
                        if (icon === 'none') return null;
                        return (
                            <li className="nav-item side-bar-icon-container" key={`side-top-bar-${icon}`}>
                                <SvgIcon 
                                    classProp='nav-link p-0'
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
                            <li className="nav-item side-bar-icon-container" key={`side-top-bar-${icon}`}>
                                <SvgIcon 
                                    classProp='nav-link p-0'
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
        <div className="container-fluid h-100">
            <div className="row h-100">
                <div className="col-sm-auto sticky-top h-100 side-bar-container">
                    <div className="d-flex flex-column flex-nowrap align-items-center sticky-top h-100 justify-content-between common-bg-color">
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