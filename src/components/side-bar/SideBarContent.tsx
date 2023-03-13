import React from 'react';
import { SvgIcon } from '../svg-icon';
import { Input } from '../input/input';

interface SideBarContentProps {
    type: sideBarContentHeaderTitleType
    handleCloseSideBarContent: () => void
}

export const sideBarContentHeaderTitles = {
    'swap-horizontal': 'select market pair',
    'wallet': 'connected wallets',
    'setting': 'advanced settings',
    'help': 'help',
    'none': '',
}

export type sideBarContentHeaderTitleType = keyof typeof sideBarContentHeaderTitles;

const helpTitles = {
    'help': 'Getting started guide',
    'video': 'Video tutorials',
    'support': 'Support',
    'discord': 'Join Blocknet Discord',
    'doc': 'API docs'
}

export type sideBarContentHelpTitleType = keyof typeof helpTitles;

const coinData = {
    'Litecoin': 43.52,
    'Blocknet': 24244.56,
    'PIVX': 4610.943,
    'Digibyte': 188.31,
    'Bitcoin': 0.4567211
}

export type coinDataType = keyof typeof coinData;

export const SideBarContent = ({ type, handleCloseSideBarContent }: SideBarContentProps) => {
    const renderContent = () => {
        if (type === 'help') {
            return (
                <React.Fragment>
                {
                    Object.keys(helpTitles).map((keyTitle: sideBarContentHelpTitleType) => (
                        <SvgIcon 
                            classProp='px-3 py-2'
                            content={helpTitles[keyTitle]}
                            leftIconCategory='sideBarContent'
                            leftIcon={keyTitle}
                            rightIconCategory='sideBarContent'
                            rightIcon='open-external'
                            contentClass='text-white mx-2'
                            containerClass='px-3'
                            type='link'
                        />
                    ))
                }
                </React.Fragment>
            )
        } else if(type === 'wallet') {
            return (
                <div className='px-2'>
                    <SvgIcon
                        content={'LOCAL WALLETS'}
                        leftIconCategory='sideBar'
                        leftIcon={'wallet'}
                        contentClass='text-white mx-2'
                    />
                    <ul className='px-0 py-3'>
                        {
                            Object.keys(coinData).map((coin: coinDataType) => (
                                <li className='d-flex flex-row content py-1'>
                                    <span className='col-3'>{coin}</span>
                                    <span className='col-9'>{coinData[coin]}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            );
        } else if (type === 'swap-horizontal') {
            return (
                <div className='px-2'>
                    <div className='d-flex flex-row align-items-center'>
                        <Input />
                        <Input />
                    </div>
                </div>
            );
        }
    }


    return (
        <div className='side-bar-content-container'>
            <SvgIcon 
                classProp='no-background-border-button title' 
                rightIconCategory='sideBarContent'
                content={sideBarContentHeaderTitles[type].toUpperCase()}
                rightIcon='close' 
                contentClass='title'
                type='button'
                onClick={handleCloseSideBarContent}
            />

            {renderContent()}
        </div>
    )
}