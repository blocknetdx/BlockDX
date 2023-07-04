import React, { useContext, useEffect, useState } from 'react';
import { Text, Button, Select, CheckBox } from '@/components';
import Wallet from '@/configuration/modules/wallet';
import { SubRouteType } from '@/configuration/add-wallet-expert';
import { ConfigDataContext } from '@/context';
import { CONFIG_ROUTE, ConfigurationMenuProps } from '@/configuration/configuration.type';
import _ from 'lodash';

interface SelectVersionsProps {
    filteredWallets?: Wallet[]
    handleSubNavigation?: (route: SubRouteType) => void
}

export default function SelectWalletVersions({
    setTitle,
    handleNavigation
}: ConfigurationMenuProps): React.ReactElement {
    const { state, updateSingleState } = useContext(ConfigDataContext);
    const { configurationType, wallets, selectedAbbrs, configuringWallets = [] } = state;
    const [displayWalletList, setDisplayWalletList] = useState<Wallet[]>([]);

    const addingWallets = configurationType === 'ADD_WALLET';
    const updatingWallets = configurationType === 'UPDATE_WALLET';

    console.log('configuringWallets: ', configuringWallets);
    
    useEffect(() => {
        setTitle(configurationType === 'FRESH_SETUP' ? 'fresh setup - quick configuration setup' : configurationType === 'ADD_WALLET' ? 'add wallet - quick configuration setup' : 'update wallet - quick configuration setup')
        if (!!window) {
            getFilteredWallets();
        }
    }, []);

    async function getFilteredWallets() {
        const filteredWallets: Wallet[] = await window?.api?.getFilteredWallets(wallets);
        console.log('filteredWallets: ', filteredWallets);

        const displayWalletList = addingWallets ? filteredWallets.filter(w => !selectedAbbrs.includes(w.abbr)) :
            updatingWallets ? filteredWallets.filter(w => selectedAbbrs.includes(w.abbr)) : filteredWallets

        setDisplayWalletList(displayWalletList);
        updateSingleState('configuringWallets', displayWalletList);
    }

    const isAllWalletSelected = configurationType === 'FRESH_SETUP' ? configuringWallets.length === 1 : displayWalletList.length === configuringWallets.length;

    function handleSelectAll() {
        if (configurationType === 'FRESH_SETUP') {
            updateSingleState('configuringWallets', !isAllWalletSelected ? [displayWalletList.find(w => w.abbr === 'BLOCK')] : displayWalletList)
        } else {
            updateSingleState('configuringWallets', isAllWalletSelected ? [] : displayWalletList)
        }
    }

    function handleSelectOneWallet(wallet: Wallet) {
        const { abbr } = wallet;
        updateSingleState('configuringWallets', 
            configuringWallets.findIndex(w => w.abbr === abbr) !== -1 ? configuringWallets.filter(w => w.abbr !== abbr) : _.uniq([...configuringWallets, wallet])
        )
    }

    function onVersionChange(abbr: string, version: string) {
        const idx = configuringWallets.findIndex(w => w.abbr === abbr && w.versions.includes(version));
        updateSingleState('configuringWallets', [
            ...configuringWallets.slice(0, idx),
            {
                ...configuringWallets[idx],
                version: version
            },
            ...configuringWallets.slice(idx + 1)
        ])
    }

    const isShowWalletSelectError = configurationType !== 'FRESH_SETUP' && configuringWallets.length === 0;

    const allSelectLabel = configurationType === 'FRESH_SETUP' ? 'Skip All' : configurationType === 'ADD_WALLET' ? 'Add' : 'Update';

    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='p-h-20'>
                <Text>Please select the wallet version installed for each of the following assets. DO NOT use any wallet versions not listed here. They have either not been tested yet or are not compatible.</Text>
            </div>
            {
                configuringWallets.length > 0 ?
                    <div className={`d-flex align-items-center p-h-20 m-v-10 ${(!isShowWalletSelectError) ? 'justify-content-end' : 'justify-content-between'}`}>
                        {
                            !isShowWalletSelectError ? null :
                                <Text className='text-error'>Please select at least one wallet to continue.</Text>
                        }
                        <CheckBox
                            label={allSelectLabel}
                            name="walletCheckbox"
                            value='selectAll'
                            className="form-check-input"
                            checked={isAllWalletSelected}
                            onPress={() => handleSelectAll()}
                        />
                    </div> : null
            }
            <div className='m-h-20 m-v-20 flex-grow-1 wallets-list-container p-h-20'>
                {
                    displayWalletList.map((wallet) => (
                        <div key={`add-wallet-${wallet.name}`} className='wallet-versions-container p-20 m-v-20'>
                            <div className='d-flex justify-content-between align-items-center m-v-10'>
                                <Text>{wallet.name}</Text>
                                {
                                    !(configurationType === 'FRESH_SETUP' && wallet.abbr === 'BLOCK') ?
                                        <CheckBox
                                            className="form-check-input"
                                            name="walletCheckbox"
                                            value='selectAll'
                                            checked={
                                                configurationType === 'FRESH_SETUP' ?
                                                configuringWallets.findIndex(w => w.abbr === wallet.abbr) === -1
                                                : configuringWallets.findIndex(w => w.abbr === wallet.abbr) !== -1
                                            }
                                            onPress={() => {
                                                handleSelectOneWallet(wallet)
                                            }}
                                            label={configurationType === 'FRESH_SETUP' ? 'Skip' : configurationType === 'ADD_WALLET' ? 'Add' : 'Update'}
                                        /> : null
                                }
                            </div>
                            <div className='wallet-version-select-container'>
                                <Text className='flex-grow-1 m-l-10'>Wallet Version</Text>
                                <Select
                                    className='select-wallet-version'
                                    optionClassName='order-tab-option-text'
                                    lists={wallet.versions}
                                    handleChange={(version) => onVersionChange(wallet.abbr, version)}
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
                        handleNavigation(CONFIG_ROUTE.SELECT_SETUP_TYPE)
                    }}
                >
                    BACK
                </Button>
                <Button
                    className='configuration-continue-btn'
                    onClick={() => {
                        handleNavigation(CONFIG_ROUTE.FINISH);
                    }}
                >CONTINUE</Button>
            </div>
        </div>
    );
}