import React, { useContext, useEffect, useState } from 'react';
import { Text, Button, Select, CheckBox } from '@/components';
import Wallet from '@/configuration/modules/wallet';
import { SubRouteType } from '@/configuration/add-wallet-expert';
import { ConfigDataContext } from '@/context';
import { CONFIG_ROUTE, ConfigurationMenuProps } from '@/configuration/configuration.type';

interface SelectVersionsProps {
    filteredWallets?: Wallet[]
    handleSubNavigation?: (route: SubRouteType) => void
}

export default function SelectWalletVersions({
    setTitle,
    handleNavigation
}: ConfigurationMenuProps): React.ReactElement {
    const { state, updateSingleState } = useContext(ConfigDataContext);
    const { configurationType, wallets, selectedAbbrs, selectedWallets } = state;
    const [filteredWallets, setFilteredWallets] = useState<Wallet[]>([]);
    const [selectedWalletAbbrs, setSelectedWalletAbbrs] = useState<string[]>([]);
    useEffect(() => {
        setTitle(configurationType === 'FRESH_SETUP' ? 'fresh setup - quick configuration setup' : configurationType === 'ADD_WALLET' ? 'add wallet - quick configuration setup' : 'update wallet - quick configuration setup')
        if (!!window) {
            getFilteredWallets();
        }
    }, []);

    async function getFilteredWallets() {
        const filteredWallets: Wallet[] = await window?.api?.getFilteredWallets(wallets);
        setFilteredWallets(filteredWallets);
        setSelectedWalletAbbrs(configurationType === 'FRESH_SETUP' ? [] : filteredWallets.map(wallet => wallet.abbr))
        updateSingleState('selectedWallets', filteredWallets.map(wallet => wallet.versionId));
    }

    const isAllWalletSelected = configurationType !== 'FRESH_SETUP' ? filteredWallets.length === selectedWalletAbbrs.length : filteredWallets.length - 1 === selectedWalletAbbrs.length;

    function handleSelectAll() {
        if (configurationType === 'FRESH_SETUP') {
            setSelectedWalletAbbrs(isAllWalletSelected ? [] : filteredWallets.filter(wallet => wallet.abbr !== 'BLOCK').map(wallet => wallet.abbr));
        } else {
            setSelectedWalletAbbrs(isAllWalletSelected ? [] : filteredWallets.map(wallet => wallet.abbr));
        }
    }

    function handleSelectOneWallet(abbr: string, versionId: string) {
        if (configurationType === 'FRESH_SETUP') {
            if (selectedWalletAbbrs.includes(abbr)) {
                updateSingleState('selectedWallets', [...selectedWallets.filter(item => item !== versionId), versionId]);
            } else {
                updateSingleState('selectedWallets', [...selectedWallets.filter(item => item !== versionId)]);
            }
        } else {
            if (selectedWalletAbbrs.includes(abbr)) {
                removeAddOneSelectedWallet(abbr);
            } else {
                updateSingleState('selectedWallets', [...selectedWallets.filter(item => item !== versionId), versionId]);
            }
        }
        setSelectedWalletAbbrs(selectedWalletAbbrs.includes(abbr) ? selectedWalletAbbrs.filter(item => item !== abbr) : [...selectedWalletAbbrs, abbr]);
    }

    function removeAddOneSelectedWallet(abbr: string, versionId?: string) {
        let temp = [...selectedWallets];

        wallets.forEach(wallet => {
            if (wallet.abbr === abbr) {
                temp = temp.filter(item => item !== wallet.versionId)
            }
        })

        updateSingleState('selectedWallets', versionId ? [...temp, versionId] : temp);
    }

    function onVersionChange(abbr: string, version: string) {
        console.log('onVersionChange version: ', version);
        
        const idx = wallets.findIndex(w => w.abbr === abbr && w.versions.includes(version));

        console.log('wallet test version: ', wallets[idx].set('version', version));
        
        updateSingleState('wallets', [...wallets.slice(0, idx), wallets[idx].set('version', version), ...wallets.slice(idx + 1)])

        const versionId = wallets[idx].versionId;

        removeAddOneSelectedWallet(abbr, versionId);
    }

    const isShowWalletSelectError = configurationType !== 'FRESH_SETUP' && selectedWalletAbbrs.length === 0;

    const allSelectLabel = configurationType === 'FRESH_SETUP' ? 'Skip All' : configurationType === 'ADD_WALLET' ? 'Add' : 'Update';

    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='p-h-20'>
                <Text>Please select the wallet version installed for each of the following assets. DO NOT use any wallet versions not listed here. They have either not been tested yet or are not compatible.</Text>
            </div>
            {
                filteredWallets.length > 0 ?
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
                            onChange={() => {
                                handleSelectAll();
                            }}
                        />
                    </div> : null
            }
            <div className='m-h-20 m-v-20 flex-grow-1 wallets-list-container p-h-20'>
                {
                    filteredWallets.map((wallet) => (
                        <div key={`add-wallet-${wallet.name}`} className='wallet-versions-container p-20 m-v-20'>
                            <div className='d-flex justify-content-between align-items-center m-v-10'>
                                <Text>{wallet.name}</Text>
                                {
                                    !(configurationType === 'FRESH_SETUP' && wallet.abbr === 'BLOCK') ? 
                                    <CheckBox
                                        className="form-check-input"
                                        name="walletCheckbox"
                                        value='selectAll'
                                        checked={selectedWalletAbbrs.includes(wallet.abbr)}
                                        onChange={() => {
                                            handleSelectOneWallet(wallet.abbr, wallet.versionId)
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
                    }}
                >CONTINUE</Button>
            </div>
        </div>
    );
}