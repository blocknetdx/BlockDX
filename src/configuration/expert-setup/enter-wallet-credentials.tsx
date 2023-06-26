import React, { useContext, useEffect, useState } from 'react';
import { Text, Button, Select, Input } from '@component';
import Wallet from '@wallet';
import { ConfigDataContext } from '@context';
import { compareByVersion } from '@/src-back/util';
import { CONFIG_ROUTE } from '@/configuration/configuration.type';
import { SidePanel } from '@/configuration/side-panel';

interface IEnterWalletCredentialsProps {
    selectedAbbrs?: string[]
    handleNavigation?: (route: CONFIG_ROUTE) => void
}

export default function EnterWalletCredentials({
    selectedAbbrs = [],
    handleNavigation
}: IEnterWalletCredentialsProps): React.ReactElement {
    const { state, updateSingleState } = useContext(ConfigDataContext);
    const { configurationType, wallets, abbrToVersion, configuringWallets } = state;
    const [displayWalletList, setDisplayWalletList] = useState<Wallet[]>([]);

    useEffect(() => {
        setDisplayWalletList(
            [...wallets]
                .filter(w => selectedAbbrs.includes(w.abbr))
                .reduce((arr, w) => {
                    const idx = arr.findIndex(ww => ww.abbr === w.abbr);
                    if (idx > -1) { // coin is already in array
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

    function handleChangeUsername(abbr: string, username: string) {
        setDisplayWalletList(displayWalletList.map(w => {
            if (w.abbr !== abbr) return w;
            return w.set({ username })
        }))

        updateSingleState('configuringWallets', configuringWallets.map(w => {
            if (w.abbr !== abbr) return w;

            return w.set({ username })
        }))
    }
    
    function handleChangePassword(abbr: string, password: string) {
        setDisplayWalletList(displayWalletList.map(w => {
            if (w.abbr !== abbr) return w;
            return w.set({ password })
        }))

        updateSingleState('configuringWallets', configuringWallets.map(w => {
            if (w.abbr !== abbr) return w;

            return w.set({ password })
        }))
    }

    console.log('displayWalletList: ', displayWalletList);

    const isContinueBtnDisabled = displayWalletList.findIndex(wallet => !wallet.username || !wallet.password) !== -1;

    return (
        <div className='d-flex flex-row flex-grow-1'>
            <SidePanel status={1} />    
            <div className='d-flex flex-column flex-grow-1 basis-p-150'>
                <div className='p-h-20'>
                    <Text>Please set the RPC username and password for each wallet.</Text>
                </div>
                <div className='m-h-20 m-v-20 flex-grow-1 wallets-list-container p-h-20'>
                    {
                        configuringWallets.map((wallet) => (
                            <div key={`add-wallet-${wallet.name}-${wallet.version}`} className='enter-wallet-inputs-container p-20 m-v-20'>
                                <div className='d-flex justify-content-between align-items-center m-v-10'>
                                    <Text>{wallet.name}</Text>
                                </div>
                                <div className='enter-wallet-credential-container'>
                                    <Input
                                        className='flex-grow-1 wallet-credential-input m-r-10'
                                        type="text"
                                        name="walletCheckbox"
                                        onChange={(e) => {
                                            handleChangeUsername(wallet.abbr, e.target.value);
                                        }}
                                        value={wallet.username}
                                        placeholder='RPC username'
                                    />
                                    <Input
                                        className='flex-grow-1 wallet-credential-input'
                                        type="text"
                                        name="walletCheckbox"
                                        onChange={(e) => {
                                            handleChangePassword(wallet.abbr, e.target.value)
                                        }}
                                        value={wallet.password}
                                        placeholder='RPC password'
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
                            handleNavigation(CONFIG_ROUTE.EXPERT_SELECT_SETUP_TYPE)
                        }}
                    >
                        BACK
                    </Button>
                    <Button
                        className='configuration-continue-btn'
                        // disabled={isContinueBtnDisabled}
                        onClick={() => {
                            if (configurationType === 'ADD_WALLET' || configurationType === 'UPDATE_WALLET') {
                                handleNavigation(CONFIG_ROUTE.FINISH);
                            } else {
                                handleNavigation(CONFIG_ROUTE.ENTER_BLOCKNET_CREDENTIALS);
                            }
                        }}
                    >CONTINUE</Button>
                </div>
            </div>
        </div>
    );
}