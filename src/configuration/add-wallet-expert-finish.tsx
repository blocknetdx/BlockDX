import { useState } from 'react';
import {
    ConfigurationMenuProps, CONFIG_ROUTE, ConfigurationMenuOptionsType
} from './configuration.type';
import { Text, Button, SvgIcon, Select } from '@components/index'

export default function AddWalletExpertFinish({
    setTitle,
    handleNavigation
}: ConfigurationMenuProps): React.ReactElement {
    const options: ConfigurationMenuOptionsType[] = [
        {
            option: 'Configuration Setup',
            content: 'This option automatically detects the wallets installed and simplifies the process to configure them for trading. If using a custom data directory location, you must use Expert Setup.',
            route: CONFIG_ROUTE.ADD_WALLET_QUICK,
        },
        {
            option: 'RPC Settings',
            content: 'This option allows you to specify the data directory locations and RPC credentials',
            route: CONFIG_ROUTE.ADD_WALLET_EXPERT
        }
    ]
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
            <div className='d-flex flex-row flex-grow-1'>
                <div className='p-h-20 w-p-55 bg-182a3e'>
                    {
                        options.map(({ option, content, route }, index) => (
                            <div className="form-check m-v-20" key={`configuration-menu-${index}`}>
                                <div>
                                    <input
                                        className="form-check-input"
                                        type="radio" name="exampleRadios"
                                        id={`menu-${index}`}
                                        value={route}
                                        checked={true}
                                    // onChange={(e) => {
                                    //     console.log('radio inside input: ', e.target.value)
                                    //     setSelectedOption(options[index]);
                                    // }}
                                    />
                                    <Text className="configuration-setup-label" >
                                        {option}
                                    </Text>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='m-h-20 d-flex flex-column'>
                    <div className='d-flex flex-column flex-grow-1'>
                        <div className='m-v-5'>
                            <Text>In order to conduct peer-to-peer trades, Block DX requires the Blocknet wallet and the wallets of any assets you want to trade with. Select the wallets that are installed to begin setup.</Text>
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
                    </div>

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
                        <Button className='configuration-continue-btn'
                            onClick={() => {
                                handleNavigation(CONFIG_ROUTE.CONFIGURATION_COMPLETE)
                            }}
                        >CONTINUE</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}