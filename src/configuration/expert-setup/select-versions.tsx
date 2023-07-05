import React, { useContext, useEffect, useState } from 'react';
import { Text, Button, Select } from '@component';
import { ConfigDataContext } from '@context';
import { CONFIG_ROUTE } from '@/configuration/configuration.type';
import { SidePanel } from '@/configuration/side-panel';
import Wallet from '@wallet';

interface SelectVersionsProps {
    handleNavigation?: (route: CONFIG_ROUTE) => void
}

export default function SelectVersions({
    handleNavigation
}:SelectVersionsProps):React.ReactElement {
    const { state, updateSingleState } = useContext(ConfigDataContext);
    const { configuringWallets } = state;
    const [displayWalletList, setDisplayWalletList] = useState<Wallet[]>([]);

    useEffect(() => {
        setDisplayWalletList(configuringWallets);
    }, []);

    function onVersionChange(abbr: string, version: string) {
        // const idx = configuringWallets.findIndex(w => w.abbr === abbr && w.versions.includes(version));

        // updateSingleState('configuringWallets', [
        //     ...configuringWallets.slice(0, idx),
        //     {
        //         ...configuringWallets[idx],
        //         version: version
        //     } as Wallet,
        //     ...configuringWallets.slice(idx + 1)
        // ])

        updateSingleState('configuringWallets', configuringWallets.map(w => {
            if (w.abbr !== abbr) return w;

            return w.set({
                version
            })
        }))
    }
    console.log('configuringWallets: ', configuringWallets);
    return (
        <div className='d-flex flex-row flex-grow-1'>
            <SidePanel status={0} />
            <div className='d-flex flex-column flex-grow-1'>
                <div className='p-h-20'>
                    <Text>Please select the wallet version installed for each of the following assets. DO NOT use any wallet versions not listed here. They have either not been tested yet or are not compatible.</Text>
                </div>
                <div className='m-h-20 m-v-20 flex-grow-1 wallets-list-container p-h-20'>
                    {
                        displayWalletList.map((wallet) => (
                            <div key={`add-wallet-${wallet.name}-${wallet.version   }`} className='wallet-versions-container p-20 m-v-20'>
                                <div className='d-flex justify-content-between align-items-center m-v-10'>
                                    <Text>{wallet.name}</Text>
                                </div>
                                <div className='wallet-version-select-container'>
                                    <Text className='flex-grow-1 m-l-10'>Wallet Version</Text>
                                    <Select
                                        className='wallet-version'
                                        optionClassName='order-tab-option-text'
                                        lists={wallet.versions}
                                        handleChange={(value) => {
                                            onVersionChange(wallet.abbr, value)
                                        }}
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
                            handleNavigation(CONFIG_ROUTE.SELECT_WALLETS)
                        }}
                    >
                        BACK
                    </Button>
                    <Button
                        className='configuration-continue-btn'
                        onClick={() => {
                            handleNavigation(CONFIG_ROUTE.SELECT_WALLET_DIRECTORIES);
                        }}
                    >CONTINUE</Button>
                </div>
            </div>
        </div>
    );
}