import React, { useState } from 'react';
import { Button, SvgIcon, Text } from '@components/index'
import './configuration.css';

const configurationTitles = {
    setUp: 'configuration setup',
    addWallet: 'add wallet',
    updateWallet: 'update wallet',
    xLiteSetup: 'litewallet setup - select wallet',
    freshSetup: 'fresh setup',
    updateRpcSettings: 'update rpc settings',
}

type configurationTitlesType = keyof typeof configurationTitles;

interface ConfigurationMenuProps {
    setTitle: React.Dispatch<React.SetStateAction<string>>
}

type configurationMenuOptionsType = {
    title: string
    content: string
    route: configurationTitlesType
}

const ConfigurationMenu = ({
    setTitle
}: ConfigurationMenuProps) => {
    const options: configurationMenuOptionsType[] = [
        {
            title: 'XLite Setup',
            content: 'Use this to configure XLite with BlockDx',
            route: 'xLiteSetup',
        },
        {
            title: 'Add New Local Wallet(s)',
            content: 'Use this to configure new local wallets for trading. Newly added wallets will need to be restarted before trading',
            route: 'addWallet'
        },
        {
            title: 'Update Locall Wallet(s)',
            content: 'Use this to reconfigure existing local wallet(s). Updated wallets will need to be restarted before trading.',
            route: 'updateWallet',
        },
        {
            title: 'Fresh Setup',
            content: 'Use this to reconfigure all you local wallets. This will require all local wallets to be restarted before trading and will cancel any open and in-progress orders from these wallets',
            route: 'freshSetup'
        },
        {
            title: 'Update Blocknet RPC Settings',
            content: 'Use this to update the RPC credentials, port, and IP for the Blocknet Core wallet. This will require the Blocknet Core wallet to be restarted, which will cancel any open and in-progress orders from these wallets.',
            route: 'updateRpcSettings'
        },
    ]

    const [selectedOption, setSelectedOption] = useState<configurationTitlesType>('xLiteSetup');

    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='p-h-20'>
                <Text>Please select which of the following you would like to do:</Text>
            </div>
            <div className='p-h-20 flex-grow-1 m-t-10'>
                {
                    options.map(({ title, content, route }, index) => (
                        <div className="form-check m-v-5" key={`configuration-menu-${index}`}>
                            <div>
                                <input
                                    className="form-check-input"
                                    type="radio" name="exampleRadios"
                                    id={`menu-${index}`}
                                    value={route}
                                    checked={selectedOption === route}
                                    onChange={(e) => {
                                        console.log('radio inside input: ', e.target.value)
                                        setSelectedOption(route);
                                    }}
                                />
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
                <Button className='configuration-continue-btn' onClick={() => setTitle(configurationTitles[selectedOption])}>CONTINUE</Button>
            </div>
        </div>
    );
}

function SelectWallets({setTitle}: ConfigurationMenuProps) {
    const allWalletsList = [
        'Blocknet (Block)',
        'Bitcoin (BTC)',
        'Dash (DASH)',
        'Dogecoin (DOGE)',
        'Litecoin (LTC)',
        'PIVX (PIVX)',
        'Syscoin (SYS)'
    ]
    const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='p-h-20'>
                <Text>In order to conduct peer-to-peer trades, Block DX requires the  Blocknet wallet and the wallets of any assets you want to trade with. Select the wallets that are installed to begin setup.</Text>
            </div>
            <div className='d-flex justify-content-end align-items-center p-h-20 m-v-10'>
                <input
                    className="form-check-input"
                    type="checkbox"
                    name="walletCheckbox"
                    value='selectAll'
                    checked={selectedWallets.length === allWalletsList.length}
                    onChange={() => {
                        setSelectedWallets(allWalletsList.length !== selectedWallets.length ? allWalletsList : [])
                    }}
                />
                <Text className="configuration-setup-label" >Select All</Text>
            </div>
            <div className='m-h-20 flex-grow-1 wallets-list-container'>
                {
                    allWalletsList.map((wallet, index) => (
                        <div className="form-check m-v-20 d-flex align-items-center">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                name="walletCheckbox"
                                value={wallet}
                                checked={selectedWallets.includes(wallet) || false}
                                onChange={() => {
                                    setSelectedWallets(selectedWallets.includes(wallet) ? selectedWallets.filter(item => item !== wallet) : [...selectedWallets, wallet])
                                }}
                            />
                            <Text className="configuration-setup-label" >
                                {wallet}
                            </Text>
                        </div>
                    ))
                }
            </div>
            <div className='d-flex flex-row justify-content-between m-v-20'>
                <Button className='configuration-cancel-btn' onClick={() => {setTitle(configurationTitles['setUp'])}}>CANCEL</Button>
                <Button className='configuration-continue-btn'>FINISH</Button>
            </div>
        </div>
    );
}

function AddWallet({setTitle}: ConfigurationMenuProps) {
    const options: configurationMenuOptionsType[] = [
        {
            title: 'Quick Setup (recommended)',
            content: 'This option automatically detects the wallets installed and simplifies the process to configure them for trading. If using a custom data directory location, you must use Expert Setup.',
            route: 'xLiteSetup',
        },
        {
            title: 'Expert Setup (advanced users only)',
            content: 'This option allows you to specify the data directory locations and RPC credentials',
            route: 'addWallet'
        }
    ]

    const [selectedOption, setSelectedOption] = useState<configurationTitlesType>('xLiteSetup');

    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='p-h-20'>
                <div className='m-v-5'>
                    <Text>Block DX is the fastees, most secure, most reliable, and most decentralized exchange, allowing for peer-to-eer trading directly from your wallet.{'\n'}</Text>
                </div>
                <div className='m-v-5'>
                    <Text className='text-bold'>Prerequisites: </Text><Text>Block DX requires the latest Blocnet wallet and the wallets of any assets you want to trade with. These must be downloaded and installed before continuing. See the full list of compatible assets and wallet versions.</Text>
                </div>
            </div>
            <div className='p-h-20 flex-grow-1 m-t-10'>
                {
                    options.map(({ title, content, route }, index) => (
                        <div className="form-check m-v-5" key={`configuration-menu-${index}`}>
                            <div>
                                <input
                                    className="form-check-input"
                                    type="radio" name="exampleRadios"
                                    id={`menu-${index}`}
                                    value={route}
                                    checked={selectedOption === route}
                                    onChange={(e) => {
                                        console.log('radio inside input: ', e.target.value)
                                        setSelectedOption(route);
                                    }}
                                />
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
                <Button className='configuration-cancel-btn' onClick={() => setTitle(configurationTitles['setUp'])}>CANCEL</Button>
                <Button className='configuration-continue-btn' onClick={() => setTitle(configurationTitles[selectedOption])}>CONTINUE</Button>
            </div>
        </div>
    );
}

enum CONFIG_ROUTE {
    SET_UP = 'setUp',
    XLITE_SET_UP = 'xLiteSetup',
    ADD_WALLET = 'addWallet',
    ADD_WALLET_QUICK = 'addWalletQuick',
    ADD_WALLET_EXPERT = 'addWalletExpert',
    UPDATE_WALLET = 'updateWallet',
    FRESH_SET_UP = 'freshUpdate',
    UPDATE_RPC_SETTINGS = 'updateRpcSettings',
}

export const Configuration: React.FC = () => {
    const [title, setTitle] = useState(configurationTitles['setUp']);
    const [route, setRoute] = useState<CONFIG_ROUTE>(CONFIG_ROUTE.SET_UP);

    function handleNavigation(route: CONFIG_ROUTE) {
        setRoute(route);
    }

    const renderContent = () => {
        // switch (route) {
        //     case CONFIG_ROUTE.SET_UP:
        //         return <ConfigurationMenu setTitle={setTitle} />
        //     case CONFIG_ROUTE.XLITE_SET_UP:
        //         return <SelectWallets setTitle={setTitle} />
        //     case CONFIG_ROUTE.ADD_WALLET:
        //         return <SelectWallets setTitle={setTitle} />
        //     default:
        //         return <></>;
        // }
        if (configurationTitles['setUp'].includes(title)) {
            return <ConfigurationMenu setTitle={setTitle} />
        }

        if (configurationTitles['xLiteSetup'].includes(title)) {
            return <SelectWallets setTitle={setTitle} />
        }
        
        if (configurationTitles['addWallet'].includes(title)) {
            return <AddWallet setTitle={setTitle} />
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