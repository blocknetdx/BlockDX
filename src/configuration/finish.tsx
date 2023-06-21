import React, { useContext, useEffect } from 'react';
import { Text, Button } from '@/components';
import { CONFIG_ROUTE, ConfigurationMenuProps } from '@/configuration/configuration.type';
import { ConfigDataContext } from '@/context';
import { SidePanel } from '@/configuration/side-panel';
import _ from 'lodash';
import Wallet from '@/configuration/modules/wallet';

export function Finish({
    setTitle,
    handleNavigation
}: ConfigurationMenuProps): React.ReactElement {
    const { state, updateSingleState } = useContext(ConfigDataContext);
    const { setupType, configurationType, addAbbrToVersion, updateAbbrToVersion, skipList, wallets, selectedWallets } = state;

    const addingWallets = configurationType === 'ADD_WALLET';
    const updatingWallets = configurationType === 'UPDATE_WALLET';

    useEffect(() => {
        setTitle(`${configurationType === 'FRESH_SETUP' ? 'fresh setup' : configurationType === 'UPDATE_WALLET' ? 'update wallet' : 'add wallet'} - ${setupType === 'QUICK_SETUP' ? 'quick' : 'expert'} configuration setup`);
    }, [])

    async function handleFinish() {
        const userName = await window.api?.getUser();
        const password = await window.api?.getPassword();
        if (configurationType === 'RPC_SETTINGS') {
        } else if (setupType === 'QUICK_SETUP') {
            const filtered:Wallet[] = wallets.filter(w => addingWallets ? addAbbrToVersion.has(w.abbr) : updatingWallets ? updateAbbrToVersion.has(w.abbr) : !skipList.includes(w.abbr)).filter(w => addingWallets ? w.versions.includes(addAbbrToVersion.get(w.abbr)) : updatingWallets ? w.versions.includes(updateAbbrToVersion.get(w.abbr)) : selectedWallets.includes(w.versionId)).map(w => {
                if (updatingWallets && w.abbr === 'BLOCK') {
                    return w.set({
                        username: userName,
                        password: password
                    })
                } else {
                    const credentials = w.generateCredentials();
                    return w.set({
                        username: credentials.username,
                        password: credentials.password
                    })
                }
            });

            if (configurationType !== 'ADD_WALLET') {
                await window?.api?.setTokenPaths(null);
            }

            if (addingWallets) {
                for (const [abbr, version] of addAbbrToVersion.entries()) {
                    const filteredWallets = wallets.filter(w => w.abbr === abbr);
                    const selectedWallet = wallets.find(w => w.abbr === abbr && w.versions.includes(version));
                    let tempSelectedWallets = [...selectedWallets];
                    for (const w of filteredWallets) {
                        tempSelectedWallets = [..._.pull(tempSelectedWallets, w.versionId)];
                    }
                    updateSingleState('selectedWallets', [...tempSelectedWallets, selectedWallet.versionId]);
                }
            } else if (updatingWallets) {
                for (const [abbr, version] of updateAbbrToVersion.entries()) {
                    const filteredWallets = wallets.filter(w => w.abbr === abbr);
                    const selectedWallet = wallets.find(w => w.abbr === abbr && w.versions.includes(version));
                    let tempSelectedWallets = [...selectedWallets];
                    for (const w of filteredWallets) {
                        tempSelectedWallets = [..._.pull(tempSelectedWallets, w.versionId)];
                    }
                    updateSingleState('selectedWallets', [...tempSelectedWallets, selectedWallet.versionId]);
                }
            } else {
                for (const versionId of [...selectedWallets]) {
                    if (!filtered.some(w => w.versionId === versionId)) {
                        updateSingleState('selectedWallets', _.pull(selectedWallets, versionId));
                    }
                }
            }

            if (addingWallets) {
                
            }
        }
    }

    const backRoute = configurationType === 'RPC_SETTINGS' ? CONFIG_ROUTE.UPDATE_RPC_SETTINGS : CONFIG_ROUTE.SELECT_WALLET_VERSIONS;

    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='d-flex flex-row flex-grow-1'>
                <SidePanel />
                <div className='m-h-20 d-flex flex-column'>
                    <div className='flex-grow-1'>
                        <div className='m-v-5'>
                            <Text>Upon selecting FINISH, the configurations set will be saved</Text>
                        </div>
                        <Text className='text-bold'>Note: </Text><Text>Straking will be disabled on all configured wallets. Staking is not recommended for any wallet connected to Block DX, as it can interfere with your ability to trade.</Text>
                    </div>

                    <div className='d-flex flex-row justify-content-between m-v-20'>
                        <Button
                            className='configuration-cancel-btn'
                            onClick={() => {
                                handleNavigation(backRoute);
                            }}
                        >
                            BACK
                        </Button>
                        <Button className='configuration-continue-btn'
                            onClick={() => {
                                handleFinish();
                                // handleNavigation(CONFIG_ROUTE.CONFIGURATION_COMPLETE)
                            }}
                        >FINISH</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}