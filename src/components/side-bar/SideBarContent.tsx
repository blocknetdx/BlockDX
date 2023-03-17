import React from 'react';
import { SvgIcon } from '../svg-icon';
import { Input } from '../input/input';
import { Text } from '../text/Text';
import { ToggleSwitch } from '../toggle-switch/ToggleSwitch';
import { Select } from '../select/Select';
import { Button } from '../button/Button';

interface SideBarContentProps {
    type: SideBarContentHeaderTitleType
    handleCloseSideBarContent: () => void
}

export const sideBarContentHeaderTitles = {
    'swap-horizontal': 'select market pair',
    'wallet': 'connected wallets',
    'setting': 'advanced settings',
    'help-circle-outline': 'help',
    'none': '',
}

export type SideBarContentHeaderTitleType = keyof typeof sideBarContentHeaderTitles;

const helpTitles = {
    'help': 'Getting started guide',
    'video': 'Video tutorials',
    'lifebuoy': 'Support',
    'discord-white': 'Join Blocknet Discord',
    'file-document-outline': 'API docs'
}

export type SideBarContentHelpTitleType = keyof typeof helpTitles;

const coinData = {
    'Litecoin': 43.52,
    'Blocknet': 24244.56,
    'PIVX': 4610.943,
    'Digibyte': 188.31,
    'Bitcoin': 0.4567211
}

export type CoinDataType = keyof typeof coinData;

const connectedAssets = {
    'BTC': 'Bitcoin',
    'BLOCK': 'Blocknet',
    'PIVX': 'PIVX',
    'DASH': 'Dash',
    'DOGE': 'Dogecoin',
    'LBRY': 'LBRY Credits',
    'LTC': 'Litecoin',
}

export type ConnectedAssetsType = keyof typeof connectedAssets;

const allAssets = {
    'ABC': 'Abosom',
    'AEX': 'AeriumX',
    'ABET': 'Altbet',
    'APR': 'APR Coin',
    'AGM': 'Argoneum',
    'ATB': 'ATBCoin',
    'AUS': 'AustraliaCash',
    'BAD': 'BadCoin',
    'BTDX': 'Bitccloud',
    'BTC': 'Bitcoin',
    'BCH': 'Bitcoin  Cash',
    'BCZ': 'Bitcoin CZ',
    'BCD': 'Bitcoin Diamond',
    'BTG': 'Bitcoin Gold',
    'BITG': 'BitGreen',
    'BLOCK': 'Blocknet',
    'PIVX': 'PIVX',
    'DASH': 'Dash',
    'DOGE': 'Dogecoin',
    'LBRY': 'LBRY Credits',
    'LTC': 'Litecoin',
}

export type AllAssetsType = keyof typeof allAssets;

export const SideBarContent = ({ type, handleCloseSideBarContent }: SideBarContentProps) => {

    const renderAssets = (assets: any) => {
        return (
            <ul className='m-t-19 px-0'>
            {
                Object.keys(assets).map((asset: any) => (
                    <li className='d-flex flex-row'>
                        <Text classProp='common-body w-105'>{asset}</Text>
                        <Text classProp='common-body'>{assets[asset]}</Text>
                    </li>
                ))
            }
            </ul>
        );
    }

    const renderContent = () => {
        if (type === 'help-circle-outline') {
            return (
                <div className='side-bar-content-section'>
                {
                    Object.keys(helpTitles).map((keyTitle: SideBarContentHelpTitleType) => (
                        <SvgIcon 
                            classProp='px-3'
                            content={helpTitles[keyTitle]}
                            leftIconCategory='sideBarContent'
                            leftIcon={keyTitle}
                            rightIconCategory='sideBarContent'
                            rightIcon='open-external'
                            contentClass='text-white mx-2'
                            containerClass='p-v-10'
                            type='link'
                            leftContainerClass='w-30'
                        />
                    ))
                }
                </div>
            )
        } else if(type === 'wallet') {
            return (
                <div className='d-flex flex-column'>
                    <div className='side-bar-content-section common-border-bottom flex flex-grow-1'>
                        <SvgIcon
                            content={'LOCAL WALLETS'}
                            leftIconCategory='sideBar'
                            leftIcon={'wallet'}
                            contentClass='text-white mx-2'
                        />
                        <ul className='px-0 p-t-20'>
                            {
                                Object.keys(coinData).map((coin: CoinDataType) => (
                                    <li className='d-flex flex-row content p-b-4'>
                                        <Text classProp='normal-title w-109'>{coin}</Text>
                                        <Text classProp='normal-title'>{coinData[coin]}</Text>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className='side-bar-content-section wallet-button-container'>
                        <Button classProp='primary-btn' content='CONNECT A WALLET' />
                        <SvgIcon 
                            classProp='m-l-10'
                            content={'Learn how to connect to a wallet'}
                            rightIconCategory='sideBarContent'
                            rightIcon='open-external'
                            contentClass='icon-button-content'
                            containerClass='connect-wallet-guide-container'
                            type='link'
                        />
                    </div>
                </div>
            );
        } else if (type === 'swap-horizontal') {
            return (
                <div className='side-bar-content-section'>
                    <div className='d-flex flex-row align-items-center'>
                        <Input classProp='side-bar-input' placeholder='Select asset' />
                        <span className='text-white p-h-10'>/</span>
                        <Input classProp='side-bar-input' placeholder='Priced in...'/>
                        <SvgIcon 
                            rightIcon='arrow-right'
                            rightIconCategory='sideBarContent'
                            type='button'
                            classProp='arrow-right-button-container'
                        />
                    </div>

                    <div className='d-flex flex-row m-l-166 p-t-5'>
                        {
                            ['LTC', 'BTC', 'PIVX', 'XMR'].map(item => (
                                <Text classProp='market-pill'>{item}</Text>
                            ))
                        }
                    </div>

                    <div className='m-t-36'>
                        <Text content='CONNECTED ASSETS' classProp='common-title'/>
                        {renderAssets(connectedAssets)}
                        <Text content='ALL ASSETS' classProp='common-title mt-5'/>
                        {renderAssets(allAssets)}
                    </div>
                </div>
            );
        } else if (type === 'setting') {
            return (
                <div className='d-flex flex-column'>
                    <div className='side-bar-content-section common-border-bottom d-flex flex-column'>
                        <Text content='MARKET PRICING' classProp='common-title py-1'/>
                        <Text classProp='common-body p-v-10' content='Select one of the available price sources for the Block DX application (*requires a restart):'/>

                        <div className='d-flex flex-row justify-content-between align-items-center p-v-10'>
                            <Text classProp='common-body'>Selct pricing source:</Text>
                            <Select classProp='w-176' list={['PRICE SOURCE API', 'SECOND API']} />
                        </div>
                        <div className='d-flex flex-row justify-content-between align-items-center p-v-10'>
                            <Text classProp='common-body'>API key:</Text>
                            <Input classProp='middle-input' />
                        </div>
                        <div className='d-flex flex-row justify-content-between align-items-center p-v-10 p-b-30'>
                            <Text classProp='common-body'>Update frequency (in seconds):</Text>
                            <Input classProp='small-input '/>
                        </div>
                    </div>
                    <div className='side-bar-content-section common-border-bottom d-flex flex-column p-b-30'>
                        <Text content='PARTIAL ORDER SETTINGS' classProp='common-title p-v-10 pb-2'/>
                        <Text classProp='common-body p-v-10'>Advanced settings for partial orders:</Text>
                        <div className='d-flex flex-row justify-content-between align-items-center p-v-10'>
                            <Text classProp='common-body'>Partial order lower limit:</Text>
                            <ToggleSwitch />
                        </div>
                        <div className='d-flex flex-row justify-content-between align-items-center p-v-10'>
                            <Text classProp='common-body'>Automatically repost partial orders:</Text>
                            <ToggleSwitch />
                        </div>
                    </div>
                    <div className='side-bar-content-section d-flex flex-column'>
                        <Text content='LANGUAGE' classProp='common-title p-v-10 pb-2'/>
                        <Text classProp='common-body p-v-10'>Select one of the available languages for the Block DX application (*requires a restart).</Text>
                        <div className='d-flex flex-row justify-content-between align-items-center p-v-10'>
                            <Text classProp='common-body'>Select language locale:</Text>
                            <Select classProp='w-154' list={['EN - ENGLISH', 'ES - SPANISH']} />
                        </div>
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
                containerClass='title-container common-border-bottom'
            />

            {renderContent()}
        </div>
    )
}