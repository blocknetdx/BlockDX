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
    const { setupType, configurationType, addAbbrToVersion, updateAbbrToVersion, skipList, wallets, selectedWallets, rpcIP, rpcPort } = state;

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
            const filtered: Wallet[] = wallets.filter(w => addingWallets ? addAbbrToVersion.has(w.abbr) : updatingWallets ? updateAbbrToVersion.has(w.abbr) : !skipList.includes(w.abbr)).filter(w => addingWallets ? w.versions.includes(addAbbrToVersion.get(w.abbr)) : updatingWallets ? w.versions.includes(updateAbbrToVersion.get(w.abbr)) : selectedWallets.includes(w.versionId)).map(w => {
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

            const block = wallets.find(w => w.abbr === 'BLOCK');
            if (addingWallets) {
                addConfs(filtered, block.directory);
            } else if (updatingWallets) {
                updateConfs(filtered, block.directory);
            } else {
                saveConfs(filtered);
                const { username, password } = block;
                await window.api?.saveDXData({
                    user: username,
                    password,
                    port: rpcPort,
                    blocknetIP: rpcIP
                })
            }

            await window.api?.saveSelected(selectedWallets);
        }
    }

    function addConfs(wallets: Wallet[], blockDir: string) {
        const confs = new Map();
        for (const w of wallets) {
            const conf = w.saveWalletConf();
            confs.set(w.abbr, conf);
        }
        addToXBridgeConf(wallets, blockDir);
    }

    function updateConfs(wallets: Wallet[], blockDir: string) {
        const confs = new Map();

        for (const w of wallets) {
            const conf = w.saveWalletConf();
            confs.set(w.abbr, conf);
        }
        updateXBridgeConf(wallets, blockDir);
        return confs;
    }

    function saveConfs(wallets: Wallet[]) {
        const confs = new Map();
        for (const w of wallets) {
            const conf = w.saveWalletConf();
            confs.set(w.abbr, w);
        }
        generateXBridgeConf(wallets);
        return confs;
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

    async function addToXBridgeConf(wallets: Wallet[], blockDir: string) {
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

        await window.api?.addToXBridgeConf({
            blockDir,
            data
        });
    }

    async function updateXBridgeConf(wallets: Wallet[], blockDir: string) {
        const data = new Map();
        for (const wallet of wallets) {
            const { abbr, xBridgeConf, username, password } = wallet;
            const confStr = await window.api?.getBridgeConf(xBridgeConf);
            if (!confStr) throw new Error(`${xBridgeConf} not found`);
            const conf = splitConf(confStr);
            data.set(abbr, Object.assign({}, conf, {
                Username: username,
                Password: password,
                Address: ''
            }));
        }

        await window.api?.updateXBridgeConf({
            blockDir,
            data
        });
    }

    async function generateXBridgeConf(wallets: Wallet[]) {
        const data = new Map();
        let blockDir = '';
        for (const wallet of wallets) {
            const { abbr, xBridgeConf, username, password, directory } = wallet;
            if (abbr === 'BLOCK') blockDir = directory;
            const confStr = await window.api?.getBridgeConf(xBridgeConf);
            if (!confStr) throw new Error(`${xBridgeConf} not found`);
            const conf = splitConf(confStr);
            data.set(abbr, Object.assign({}, conf, {
                Username: username,
                Password: password,
                Address: ''
            }));
        }

        const saveData = [
            [
                '[Main]',
                `ExchangeWallets=${[...data.keys()].join(',')}`,
                'FullLog=true',
                'ShowAllOrders=true'
            ].join('\n'),
            '\n',
            ...[...data.entries()]
                .map(([abbr, conf]) => {
                    return [
                        `\n[${abbr}]`,
                        joinConf(conf)
                    ].join('\n');
                })
        ].join('');

        await window.api?.generateXBridgeConf({blockDir, data: saveData});
    }

    function joinConf(obj: any) {
        return Object.keys(obj).map(key => key + '=' + (obj[key] || '')).join('\n').concat('\n');
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