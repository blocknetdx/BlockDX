import React, { useState } from 'react';
import { Button, SvgIcon, Text } from '@components/index'
import './configuration.css';

const ConfigurationMenu = () => {
    const options = [
        {
            title: 'XLite Setup',
            content: 'Use this to configure XLite with BlockDx'
        },
        {
            title: 'Add New Locall Wallet(s)',
            content: 'Use this to configure new local wallets for trading. Newly added wallets will need to be restarted before trading'
        },
        {
            title: 'Update Locall Wallet(s)',
            content: 'Use this to reconfigure existing local wallet(s). Updated wallets will need to be restarted before trading.'
        },
        {
            title: 'Fresh Setup',
            content: 'Use this to reconfigure all you local wallets. This will require all local wallets to be restarted before trading and will cancel any open and in-progress orders from these wallets'
        },
        {
            title: 'Update Blocknet RPC Settings',
            content: 'Use this to update the RPC credentials, port, and IP for the Blocknet Core wallet. This will require the Blocknet Core wallet to be restarted, which will cancel any open and in-progress orders from these wallets.'
        },
    ]
    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='p-h-20 flex-grow-1'>
                {
                    options.map(({title, content}) => (
                        <div className="form-check m-v-5">
                            <div>
                                <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked />
                                <Text className="configuration-setup-label" >
                                    {title}
                                </Text>
                            </div>
                            <Text>{content}</Text>
                        </div>
                    ))
                }
            </div>
            <div className='d-flex flex-row justify-content-between m-v-20'>
                <Button className='configuration-cancel-btn'>CANCEL</Button>
                <Button className='configuration-continue-btn'>CONTINUE</Button>
            </div>
        </div>
    );
}

const configurationTitles = {
    setUp: 'configuration setup',
    addWallet: 'add wallet',
    updateWallet: 'update wallet',
    xLiteSetup: 'litewallet setup - select wallet'
}

export const Configuration:React.FC = () => {
    const [title, setTitle] = useState(configurationTitles['setUp']);

    const renderContent = () => {
        if (configurationTitles['setUp'].includes(title)) {
            return <ConfigurationMenu />
        }

        return <></>
    }

    return (
        <div className='configuration-container d-flex flex-column h-100'>
            <SvgIcon
                classProp='logo-full'
                rightIcon='logo-full'
                type='link'
                containerClass='justify-content-center p-v-20'
            />

            <h3>{title.toUpperCase()}</h3>
            {renderContent()}
        </div>
    );
}