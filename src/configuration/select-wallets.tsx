import { useState } from 'react';
import {
    ConfigurationMenuProps, CONFIG_ROUTE
} from './configuration.type';
import { Text, Button } from '@components/index'
import { ConfigDataContext } from '@/context';
import { SubRouteType } from '@/configuration/add-wallet-expert';

interface SelectWalletsProps {
    selectWallet?: (versionId: string) => void
    selectedWallets?: string[]
    selectAll?: (wallets: string[]) => void
    handleSubNavigation?: (route: SubRouteType) => void
}

type Props = SelectWalletsProps & ConfigurationMenuProps;

export default function SelectWallets({
    setTitle,
    handleNavigation,
    selectWallet,
    selectedWallets,
    selectAll,
    handleSubNavigation,
}: Props) {
    const { state } = useContext(ConfigDataContext);
    const { wallets } = state;
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
                    checked={selectedWallets.length !== 0 && selectedWallets.length === wallets.length}
                    onChange={() => {
                        selectAll(selectedWallets.length !== wallets.length ? wallets.reduce((selectedWallets, wallet) => {
                            return [...selectedWallets, wallet.versionId];
                        }, []) : [])
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
                                    selectWallet(wallet.versionId)
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
                        handleNavigation(CONFIG_ROUTE.ADD_WALLET)
                    }}
                >
                    BACK
                </Button>
                <Button 
                    className='configuration-continue-btn'
                    disabled={selectedWallets.length === 0}
                    onClick={() => handleSubNavigation('selectVersion')}
                >FINISH</Button>
            </div>
        </div>
    );
}