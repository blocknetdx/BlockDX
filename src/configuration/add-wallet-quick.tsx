import { useState } from 'react';
import {
    ConfigurationMenuProps, CONFIG_ROUTE, ConfigurationMenuOptionsType
} from './configuration.type';
import { Text, Button, SvgIcon, Select } from '@components/index'

export default function AddWalletQuick({
    setTitle,
    handleNavigation
}: ConfigurationMenuProps) {
    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='p-h-20'>
                <Text>Please select the wallet version installed for each of the following assets. DO NOT use any wallet versions not listed here. They have either not been tested yet or are not compatible.</Text>
            </div>
            <div className='d-flex justify-content-between align-items-center p-h-20 m-v-10'>
                <Text>Please select at least one wallet to continue.</Text>
                <div className='d-flex align-items-center'>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="walletCheckbox"
                        value='selectAll'
                        onChange={() => {
                        }}
                    />
                    <Text className="configuration-setup-label" >Add</Text>
                </div>
            </div>
            <div className='m-h-20 flex-grow-1 wallets-list-container p-20'>
                <div className='wallet-versions-container p-20'>
                    <div className='d-flex justify-content-between align-items-center m-v-10'>
                        <Text>Xaya</Text>
                        <div className='d-flex align-items-center'>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="walletCheckbox"
                                value='selectAll'
                                onChange={() => {
                                }}
                            />
                            <Text className="configuration-setup-label" >Add Wallet</Text>
                        </div>
                    </div>
                    <div className='wallet-version-select-container'>
                        <Text className='flex-grow-1 m-l-10'>Wallet Version</Text>
                        <Select
                            className='wallet-version'
                            optionClass='order-tab-option-text'
                            lists={['v1.4.1', 'v1.4.0']}
                        />
                    </div>
                </div>
            </div>
            <SvgIcon
                containerClass='m-h-20 m-v-10'
                classProp='m-l-10'
                content="Don't see a wallet in the list?"
                rightIcon='help'
                rightIconCategory='sideBar'
                contentClass='m-r-10'
            />
            <div className='d-flex flex-row justify-content-between m-v-20'>
                <Button
                    className='configuration-cancel-btn'
                    onClick={() => {
                        setTitle(CONFIG_ROUTE.SET_UP);
                        handleNavigation(CONFIG_ROUTE.SET_UP)
                    }}
                >
                    CANCEL
                </Button>
                <Button
                    className='configuration-continue-btn'
                    onClick={() => handleNavigation(CONFIG_ROUTE.ADD_WALLET_QUICK_FINISH)}
                >CONTINUE</Button>
            </div>
        </div>
    );
}