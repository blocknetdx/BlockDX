import Wallet from '@wallet';
import { SidePanel } from '@/configuration/side-panel';
import React, { useContext, useEffect, useState } from 'react';
import { Text, CheckBox, Button, } from '@component'
import { ConfigDataContext } from '@context';
import { CONFIG_ROUTE } from '@/configuration/configuration.type';
import { compareByVersion } from '@/src-back/util';
import _ from 'lodash'
import { LiteWalletDataType } from '@/configuration/preload';

interface ISelectWalletsProps {
    handleNavigation?: (route: CONFIG_ROUTE) => void
}

export default function SelectWallets({
    handleNavigation,
}: ISelectWalletsProps): React.ReactElement {
    const { state, updateSingleState } = useContext(ConfigDataContext);
    const { wallets, skipSetup, configurationType, selectedAbbrs, configuringAbbrs = ['BLOCK'], litewalletConfigDirectory } = state || {};
    const [displayLiteWallets, setDisplayLiteWallets] = useState<LiteWalletDataType[]>([]);
    const [selectedLiteWallets, setSelectedLiteWallets] = useState<string[]>([]);

    const addingWallets = configurationType === 'ADD_WALLET';
    const updatingWallets = configurationType === 'UPDATE_WALLET';

    useEffect(() => {
        onInit();
    }, [])

    async function onInit() {
        if (configurationType !== 'LITEWALLET_RPC_SETUP') {
            const installedWallets: Wallet[] = await window?.api?.getFilteredWallets(wallets);
    
            updateSingleState('configuringAbbrs', configurationType !== 'ADD_WALLET' ? installedWallets.filter(w => w.abbr !== 'LTC').map(w => w.abbr)
                : installedWallets.filter(w => !selectedAbbrs.includes(w.abbr) && w.abbr !== 'LTC').map(w => w.abbr)
            )
        } else {
            const litewallets:LiteWalletDataType[] = await window.api?.getLiteWallets({
                directory: litewalletConfigDirectory,
                wallets: wallets
            });

            setDisplayLiteWallets(litewallets);
            setSelectedLiteWallets(litewallets.map(wallet => wallet.abbr))

            console.log('litewallets: ', litewallets);
            
        }
    }

    const displayWalletList: Wallet[] = [...wallets.filter(w => addingWallets ? !selectedAbbrs.includes(w.abbr) : updatingWallets ? selectedAbbrs.includes(w.abbr) : true).reduce((arr: Wallet[], w) => {
        const idx = arr.findIndex((ww:any )=> ww.abbr === w.abbr);
        // console.log('idx: ', idx, arr);
        
        if (idx > -1) { // coin is already in array
          arr[idx].versions = _.uniq([...arr[idx].versions, ...w.versions]);
          return arr;
        } else {
          return [...arr, w];
        }
      }, [])
      .map(w => {
        w?.versions.sort(compareByVersion);
        return w;
        })
    ]

    const isLiteWalletsAllSelected = !!selectedLiteWallets && selectedLiteWallets.length === displayLiteWallets.length;

    const isAllSelected = configurationType !== 'LITEWALLET_RPC_SETUP' ? configuringAbbrs.length > 0 && displayWalletList.length === configuringAbbrs.length : isLiteWalletsAllSelected;

    function handleSelectWallet(abbr: string) {
        if (abbr === 'BLOCK') return;
        updateSingleState('configuringAbbrs', configuringAbbrs.includes(abbr) ? configuringAbbrs.filter(item => item !== abbr) : [...configuringAbbrs, abbr]);
    }

    function handleSelectAll() {
        if (configurationType !== 'LITEWALLET_RPC_SETUP') {
            updateSingleState('configuringAbbrs', !isAllSelected ? displayWalletList.map(w => w.abbr) : configurationType === 'FRESH_SETUP' ? ['BLOCK'] : []);
        } else {
            setSelectedLiteWallets(isLiteWalletsAllSelected ? [] : displayLiteWallets.map(w => w.abbr))
        }
    }

    function renderWallets():React.ReactElement {
        if (configurationType !== 'LITEWALLET_RPC_SETUP') {
            return (
                <div className={`m-h-20 flex-grow-1 wallets-list-container ${showSkip ? 'max-h-210' : ''} ${skipSetup ? 'opacity-25' : ''}`}>
                    {
                        displayWalletList.map((wallet, index) => (
                            <CheckBox
                                key={`exper-wallet-setup-${wallet.abbr}-${index}`}
                                className="form-check-input"
                                containerClass='form-check m-v-20 d-flex align-items-center'
                                name="walletCheckbox"
                                value={wallet.versionId}
                                checked={configuringAbbrs.includes(wallet.abbr) || false}
                                onPress={() => {
                                    if (wallet.abbr === 'BLOCK' || skipSetup) return;
                                    handleSelectWallet(wallet.abbr);
                                }}
                                label={`${wallet.name} (${wallet.abbr})`}
                                labelClass='configuration-setup-label'
                            />
                        ))
                    }
                </div>
            );
        }

        return (
            <div className={`m-h-20 flex-grow-1 wallets-list-container ${showSkip ? 'max-h-210' : ''} ${skipSetup ? 'opacity-25' : ''}`}>
                {
                    displayLiteWallets.map(({ wallet }, index) => (
                        <CheckBox
                            key={`exper-wallet-setup-${wallet.abbr}-${index}`}
                            className="form-check-input"
                            containerClass='form-check m-v-20 d-flex align-items-center'
                            name="walletCheckbox"
                            value={wallet.versionId}
                            checked={selectedLiteWallets.includes(wallet.abbr) || false}
                            onPress={() => {
                                // handleSelectWallet(wallet.abbr);
                                setSelectedLiteWallets(selectedLiteWallets.includes(wallet.abbr) ? selectedLiteWallets.filter(abbr => wallet.abbr !== abbr) : [...selectedLiteWallets, wallet.abbr])
                            }}
                            label={`${wallet.name} (${wallet.abbr})`}
                            labelClass='configuration-setup-label'
                        />
                    ))
                }
            </div>
        )
    }

    async function handleFinish() {
        await window.api?.restart();
    }

    const showSkip = configurationType === 'FRESH_SETUP';
    return (
        <div className='d-flex flex-row flex-grow-1'>
            <SidePanel status={configurationType !== 'LITEWALLET_RPC_SETUP' ? 0 : -1} />
            <div className='d-flex flex-column flex-grow-1'>
                <div className='p-h-20'>
                    <Text>In order to conduct peer-to-peer trades, Block DX requires the  Blocknet wallet and the wallets of any assets you want to trade with. Select the wallets that are installed to begin setup.</Text>
                </div>
                <div className='d-flex justify-content-end align-items-center p-h-20 m-v-10'>
                    <CheckBox
                        className="form-check-input"
                        name="walletCheckbox"
                        checked={isAllSelected}
                        onPress={() => {
                            if (skipSetup) return;
                            handleSelectAll();
                        }}
                        label="Select All"
                        labelClass='configuration-setup-label'
                    />
                </div>
                {renderWallets()}
                {/* <div className={`m-h-20 flex-grow-1 wallets-list-container ${showSkip ? 'max-h-210' : ''} ${skipSetup ? 'opacity-25' : ''}`}>
                    {
                        displayWalletList.map((wallet, index) => (
                            <CheckBox
                                key={`exper-wallet-setup-${wallet.abbr}-${index}`}
                                className="form-check-input"
                                containerClass='form-check m-v-20 d-flex align-items-center'
                                name="walletCheckbox"
                                value={wallet.versionId}
                                checked={configuringAbbrs.includes(wallet.abbr) || false}
                                onPress={() => {
                                    if (wallet.abbr === 'BLOCK' || skipSetup) return;
                                    handleSelectWallet(wallet.abbr);
                                }}
                                label={`${wallet.name} (${wallet.abbr})`}
                                labelClass='configuration-setup-label'
                            />
                        ))
                    }
                </div> */}
                {
                    !showSkip ? null :
                        <CheckBox
                            className="form-check-input"
                            containerClass='form-check m-v-20 d-flex align-items-center'
                            name="walletCheckbox"
                            checked={skipSetup || false}
                            onPress={() => { updateSingleState('skipSetup', !skipSetup) }}
                            label="Skip and setup Block DX manually (not recommended)"
                            labelClass='configuration-setup-label'
                        />
                }
                <div className='d-flex flex-row justify-content-between m-v-20'>
                    <Button
                        className='configuration-cancel-btn'
                        onClick={() => {
                            handleNavigation(CONFIG_ROUTE.SELECT_SETUP_TYPE);
                        }}
                    >
                        BACK
                    </Button>
                    <Button
                        className='configuration-continue-btn'
                        disabled={configurationType !== 'LITEWALLET_RPC_SETUP' ? false : (!selectedLiteWallets || selectedLiteWallets.length === 0)}
                        onClick={() => {
                            if (configurationType !== 'LITEWALLET_RPC_SETUP') {
                                updateSingleState('configuringWallets', displayWalletList.filter(w => configuringAbbrs.includes(w.abbr)));
                                handleNavigation(!skipSetup ? CONFIG_ROUTE.EXPERT_SELECT_WALLET_VERSIONS : CONFIG_ROUTE.ENTER_BLOCKNET_CREDENTIALS)
                            } else {
                                handleFinish();
                            }
                        }}
                    >
                        FINISH
                    </Button>
                </div>
            </div>
        </div>
    );
}