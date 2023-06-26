import React, { useContext } from 'react';
import { Text, Button } from '@component';
import { CONFIG_ROUTE, ConfigurationMenuProps } from '@/configuration/configuration.type';
import { ConfigDataContext } from '@context';
import { SidePanel } from '@/configuration/side-panel';
import _ from 'lodash';
import Wallet from '@wallet';

export function Finish({
    handleNavigation
}: ConfigurationMenuProps): React.ReactElement {
    const { state, updateSingleState } = useContext(ConfigDataContext);
    const { setupType, configurationType, wallets, selectedWallets, username, password, rpcIP, rpcPort, configuringWallets, skipSetup, generateCredentials = false } = state;

    const addingWallets = configurationType === 'ADD_WALLET';
    const updatingWallets = configurationType === 'UPDATE_WALLET';

    async function handleFinish() {
        const username = await window.api?.getUser();
        const password = await window.api?.getPassword();
        if (configurationType === 'RPC_SETTINGS') {
            const { username, password, rpcIP, rpcPort } = state;
            if (!username || !password || rpcPort || rpcIP) {
                window.api.showWarning('Something went wrong, please go back and set credentials again');
                return;
            }
            await window.api?.saveDXData(username, password, rpcPort, rpcIP);
        } else if (setupType === 'QUICK_SETUP') {
            const filtered: Wallet[] = configuringWallets.map(w => {
                return wallets.find(wallet => wallet.abbr === w.abbr && wallet.versions.includes(w.version))
            }).map(w => {
                if (updatingWallets && w.abbr === 'BLOCK') {
                    return w.set({
                        username,
                        password
                    })
                } else {
                    const { username, password } = w.generateCredentials();
                    return w.set({
                        username,
                        password
                    })
                }
            })

            console.log('filteredWallets: ', filtered);
            

            if (configurationType !== 'ADD_WALLET') {
                await window?.api?.setTokenPaths(null);
            }

            let updatingSelectedWallets = [...selectedWallets]

            if (addingWallets || updatingWallets) {
                filtered.forEach(({abbr, versionId}) => {
                    const filteredWallets = wallets.filter(w => w.abbr === abbr);
                    for (const w of filteredWallets) {
                        updatingSelectedWallets = [..._.pull(updatingSelectedWallets, w.versionId)];
                    }
                    updatingSelectedWallets = _.uniq([...updatingSelectedWallets, versionId])
                })
            } else {
                updatingSelectedWallets = filtered.map(w => w.versionId);
            }

            console.log('updatingSelectedWallets: ', updatingSelectedWallets);

            const block = wallets.find(w => w.abbr === 'BLOCK');

            if (addingWallets) {
                addConfs(filtered, block.directory);
            } else if (updatingWallets) {
                updateConfs(filtered, block.directory);
            } else {
                saveConfs(filtered, block.directory);
                const { username, password } = block;
                await window.api?.saveDXData(username, password, rpcPort, rpcIP);
            }

            await window.api?.saveSelected(updatingSelectedWallets)
        } else {
            const filtered: Wallet[] = configuringWallets.map((w: Wallet) => {
                return wallets.find(wallet => wallet.abbr === w.abbr && wallet.versions.includes(w.version))
            }).map((w: Wallet) => {
                if (!generateCredentials) return w;

                if (updatingWallets && w.abbr === 'BLOCK') {
                    return w.set({
                        username,
                        password
                    })
                } else {
                    const { username, password } = w.generateCredentials();
                    return w.set({
                        username,
                        password
                    })
                }
            }).map((w: Wallet, index) => {
                return w.set({
                    directory: configuringWallets[index].directory || ''
                })
            });

            await window?.api?.setTokenPaths(filtered);

            let updatingSelectedWallets = configurationType === 'FRESH_SETUP' ? [...filtered.map(w => w.versionId)] : [...selectedWallets]

            const block = wallets.find(w => w.abbr === 'BLOCK');
            if (!skipSetup) {

                if (addingWallets || updatingWallets) {
                    filtered.forEach(({abbr, versionId}) => {
                        const filteredWallets = wallets.filter(w => w.abbr === abbr);
                        for (const w of filteredWallets) {
                            updatingSelectedWallets = [..._.pull(updatingSelectedWallets, w.versionId)];
                        }
                        updatingSelectedWallets = _.uniq([...updatingSelectedWallets, versionId])
                    });
                    
                    if (addingWallets) {
                        addConfs(filtered, block.directory);
                    } else {
                        updateConfs(filtered, block.directory);
                        if (filtered.some(w => w.abbr === 'BLOCK')) {
                            await window.api?.saveDXData(block.username || username, block.password || password, rpcPort, rpcIP);
                        }
                    }
                    await window.api?.saveSelected(updatingSelectedWallets)
                } else {
                    saveConfs(filtered, block.directory)
                }

                console.log('expert filtered wallets: ', filtered);
            }

            if (!addingWallets && !updatingWallets) {
                await window.api?.saveDXData(block.username, block.password, rpcPort, rpcIP);
                await window.api?.saveSelected(updatingSelectedWallets)
            }
        }
    }

    async function addConfs(wallets: Wallet[], blockDir: string) {
        const confs = new Map();
        for (const w of wallets) {
            const conf = w.saveWalletConf();
            confs.set(w.abbr, conf);
        }
        const data = await getXBridgeConfData(wallets);
    
        console.log('data: ', data);

        // await window.api?.addToXBridgeConf({blockDir, data});
    }

    async function updateConfs(wallets: Wallet[], blockDir: string) {
        const confs = new Map();
        for (const w of wallets) {
            const conf = w.saveWalletConf();
            confs.set(w.abbr, conf);
        }
        const data = await getXBridgeConfData(wallets);

        console.log('data: ', data);
        // await window.api?.updateToXBridgeConf({blockDir, data});
    }
    async function saveConfs(wallets: Wallet[], blockDir: string) {
        const confs = new Map();
        for (const w of wallets) {
            const conf = w.saveWalletConf();
            confs.set(w.abbr, conf);
        }
        const data = await getXBridgeConfData(wallets);

        console.log('data: ', data);
        await window.api?.saveToXBridgeConf({blockDir, data});
    }

    function splitConf(str: string) {
        return str
            .split('\n')
            .map(s => s.trim())
            .filter(l => l ? true : false)
            .map(l => l.split('=').map(s => s.trim()))
            .reduce((obj, [key, val = '']) => {
                if (key && val) return Object.assign({}, obj, { [key]: val });
                else return obj;
            }, {});
    }

    async function getXBridgeConfData(wallets: Wallet[]) {
        const data = new Map();
        for (const wallet of wallets) {
            const { abbr, xBridgeConf, username, password } = wallet;
            const confStr = await window.api?.getBridgeConf(xBridgeConf);
            if (!confStr) {
                throw new Error(`${xBridgeConf} not found.`);
            }
            const conf = splitConf(confStr);
            data.set(abbr, Object.assign({}, conf, {
                Username: username,
                Password: password,
                Address: ''
            }));
        }

        console.log('addToXBridgeConf data: ', data);

        return data;
    }

    const backRoute = configurationType === 'RPC_SETTINGS' ? CONFIG_ROUTE.UPDATE_RPC_SETTINGS : CONFIG_ROUTE.SELECT_WALLET_VERSIONS;

    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='d-flex flex-row flex-grow-1'>
                <SidePanel status={1} />
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
                                handleNavigation(
                                    setupType === 'QUICK_SETUP' ? CONFIG_ROUTE.SELECT_WALLET_VERSIONS 
                                    : !generateCredentials ? CONFIG_ROUTE.ENTER_BLOCKNET_CREDENTIALS 
                                    : CONFIG_ROUTE.EXPERT_SELECT_SETUP_TYPE

                                );
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