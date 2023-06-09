import { useState } from 'react';
import {
    ConfigurationMenuProps, CONFIG_ROUTE
} from './configuration.type';
import { Text, Button } from '@components/index'

export default function SelectWallets({
    setTitle,
    handleNavigation
}: ConfigurationMenuProps) {
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
                <Button
                    className='configuration-cancel-btn'
                    onClick={() => {
                        setTitle(CONFIG_ROUTE.SET_UP);
                        handleNavigation(CONFIG_ROUTE.SET_UP)
                    }}
                >
                    CANCEL
                </Button>
                <Button className='configuration-continue-btn'>FINISH</Button>
            </div>
        </div>
    );
}