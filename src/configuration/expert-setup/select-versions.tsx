import React, { useContext, useEffect, useState } from 'react';
import { Text, Button, Select } from '@/components';
import Wallet from '@/configuration/modules/wallet';
import { SubRouteType } from '@/configuration/add-wallet-expert';
import { ConfigDataContext } from '@/context';
import { compareByVersion } from '@/src-back/util';

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
    const { state, updateSingleState } = useContext(ConfigDataContext);
    const { configurationType, wallets, abbrToVersion } = state;
    const [displayWalletList, setDisplayWalletList] = useState<Wallet[]>([]);

    useEffect(() => {
        setDisplayWalletList(
            [...wallets]
        .filter(w => selectedAbbrs.includes(w.abbr))
        .reduce((arr, w) => {
            const idx = arr.findIndex(ww => ww.abbr === w.abbr);
            if(idx > -1) { // coin is already in array
              arr[idx].versions = [...arr[idx].versions, ...w.versions];
              return arr;
            } else {
              return [...arr, w];
            }
        }, [])
        .map(w => {
            w?.versions.sort(compareByVersion);
            if (abbrToVersion?.has(w.abbr)) {
                w.version = abbrToVersion.get(w.abbr);
            } else {
                w.version = w.versions[0];
            }
            return w;
        }));
    }, [])
    
    useEffect(() => {
        if (displayWalletList.length > 0 && abbrToVersion.size === 0) {
            displayWalletList.forEach(w => {
                abbrToVersion.set(w.abbr, w.version);
            })
            updateSingleState('abbrToVersion', abbrToVersion);
        }
    }, [displayWalletList])

    function handleSelectVersion() {
        console.log('abbrToVersion: ', abbrToVersion);

    }

    console.log('displayWalletList: ', displayWalletList);
    
    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='p-h-20'>
                <Text>Please select the wallet version installed for each of the following assets. DO NOT use any wallet versions not listed here. They have either not been tested yet or are not compatible.</Text>
            </div>
            <div>

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
                                        updateSingleState('abbrToVersion', abbrToVersion.set(wallet.abbr, value))
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
                        handleSubNavigation('selectWallet')
                    }}
                >
                    BACK
                </Button>
                <Button
                    className='configuration-continue-btn'
                    onClick={() => {
                        console.log('abbrToVersion: ', abbrToVersion);
                        
                        // handleSubNavigation('selectDirectories');
                    }}
                >CONTINUE</Button>
            </div>
        </div>
    );
}