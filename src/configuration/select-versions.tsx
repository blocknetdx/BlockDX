import React, { useContext } from 'react';
import { Text, Button, Select } from '@/components';
import Wallet from '@/configuration/modules/wallet';
import { SubRouteType } from '@/configuration/add-wallet-expert';
import { ConfigDataContext } from '@/context';

interface SelectVersionsProps {
    filteredWallets?: Wallet[]
    handleSubNavigation?: (route: SubRouteType) => void
    selectedAbbrs?: string[]
}

export default function SelectVersions({
    filteredWallets = [],
    selectedAbbrs = [],
    handleSubNavigation
}:SelectVersionsProps):React.ReactElement {
    const { state } = useContext(ConfigDataContext);
    const { configurationType, wallets } = state;

    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='p-h-20'>
                <Text>Please select the wallet version installed for each of the following assets. DO NOT use any wallet versions not listed here. They have either not been tested yet or are not compatible.</Text>
            </div>
            <div>

            </div>
            <div className='m-h-20 m-v-20 flex-grow-1 wallets-list-container p-h-20'>
                {
                    filteredWallets.map((wallet) => (
                        <div key={`add-wallet-${wallet.name}`} className='wallet-versions-container p-20 m-v-20'>
                            <div className='d-flex justify-content-between align-items-center m-v-10'>
                                <Text>{wallet.name}</Text>
                            </div>
                            <div className='wallet-version-select-container'>
                                <Text className='flex-grow-1 m-l-10'>Wallet Version</Text>
                                <Select
                                    className='wallet-version'
                                    optionClassName='order-tab-option-text'
                                    lists={wallet.versions}
                                />
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='d-flex flex-row justify-content-between m-v-20'>
                <Button
                    className='configuration-cancel-btn'
                    onClick={() => {
                        handleSubNavigation('selectWallet')
                    }}
                >
                    BACK
                </Button>
                <Button
                    className='configuration-continue-btn'
                    onClick={() => {
                        handleSubNavigation('selectDirectories')
                    }}
                >CONTINUE</Button>
            </div>
        </div>
    );
}