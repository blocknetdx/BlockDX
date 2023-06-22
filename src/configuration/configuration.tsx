import React, { useState, useEffect, useContext } from 'react';
import { SvgIcon, Text } from '@components/index';
import './configuration.css';
import { CONFIG_ROUTE } from './configuration.type';
import ConfigurationMenu from './configuration-menu';
import SelectWallets from '@/configuration/select-wallets';
import SelectSetUpType from '@/configuration/select-setup-type';
import AddWalletQuick from '@/configuration/add-wallet-quick';
import AddWalletQuickFinish from '@/configuration/add-wallet-quick-finish';
import ConfigurationComplete from '@/configuration/configuration-complete';
import AddWalletExpert from '@/configuration/add-wallet-expert';
import AddWalletExpertFinish from '@/configuration/add-wallet-expert-finish';
import { ManifestType } from '@/main.type';
import { Set } from 'immutable';
import Wallet from './modules/wallet';
import path from 'path';
import { ConfigDataContext } from '@/context';
import RpcSettings from '@/configuration/rpc-settings';
import _ from 'lodash';
import SelectWalletVersions from '@/configuration/select-wallet-versions';
import { Finish } from '@/configuration/finish';

const configurationTitles = {
    setUp: 'configuration setup',
    addWallet: 'add wallet',
    updateWallet: 'update wallet',
    xLiteSetup: 'litewallet setup - select wallet',
    freshSetup: 'fresh setup',
    updateRpcSettings: 'update rpc settings',
    addWalletQuick: 'add wallet - quick configuration setup',
    addWalletQuickFinish: 'add wallet - quick configuration setup',
    addWalletExpert: 'add wallet - expert configuration setup',
    addWalletExpertFinish: 'add wallet - expert configuration setup',
    configurationComplete: 'configuration complete!',
}

export const Configuration: React.FC = () => {
    const [title, setTitle] = useState('');
    // const [title, setTitle] = useState(configurationTitles['setUp']);
     
    const [route, setRoute] = useState<CONFIG_ROUTE>(CONFIG_ROUTE.SET_UP);
    const { state, updateState, initState } = useContext(ConfigDataContext);

    useEffect(() => {
        if (!!window) {
            setInitialState();
            getManifest();
        }
    }, []);
    
    async function setInitialState() {
        const credentials = await window.api.getCredentials();
        const isFirstRun = await window.api.isFirstRun();
        console.log('credentials: ', credentials, isFirstRun);

        initState({
            sidebarSelected: false,
            rpcPort: '41414',
            rpcIP: '127.0.0.1',
            username: credentials.username || '',
            password: credentials.password || '',
            isFirstRun,
            configurationType: 'FRESH_SETUP',
            skipSetup: false,
        })
        setRoute(isFirstRun ? CONFIG_ROUTE.SELECT_SETUP_TYPE : CONFIG_ROUTE.CONFIGURATION_MENU);
    }

    async function getManifest() {
        let walletsOrigin: ManifestType[] = await window.api.getManifest();

        let wallets:Wallet[] = walletsOrigin.map(w => new Wallet(w));

        console.log('wallets: ', wallets);

        const blockIdx = wallets.findIndex(w => w.abbr === 'BLOCK');
        const others = [
            ...wallets.slice(0, blockIdx),
            ...wallets.slice(blockIdx + 1)

        ].sort((a, b) => a.name.localeCompare(b.name));
        wallets = [
            wallets[blockIdx],
            ...others
        ];

        const selectedWallets = await window?.api.getSelectedWallets();

        console.log('selectedWallets: ', selectedWallets);
        

        let selectedWalletIds = [
            wallets[0].versionId,
            ...selectedWallets
        ];

        let xbridgeConfPath = await window?.api.getXbridgeConfPath();
        let xbridgeConf: string;

        try {
            if (!xbridgeConfPath) {
                xbridgeConfPath = path.join(await wallets.find(w => w.abbr === 'BLOCK').directory, 'xbridge.conf')
            }
            // console.log('xbridgeConfPath: ', xbridgeConfPath);
            xbridgeConf = await window?.api.getXbridgeConf(xbridgeConfPath);

            console.log('xbridgeConf: ', xbridgeConf);

        } catch (error) {
            console.log('xbridgeconfpath error: ', error);

        }

        if (xbridgeConf) {
            try {
                const splitConf = xbridgeConf
                    .split('\n')
                    .map(s => s.trim())
                    .filter(s => s ? true : false);
                const exchangeWallets = splitConf
                    .find(s => /^ExchangeWallets\s*=/.test(s))
                    .split('=')[1]
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s ? true : false);
                const walletFromVersionId = wallets.reduce((map, w) => map.set(w.versionId, w), new Map());
                const abbrs: any[] = [];
                for (const versionId of [...selectedWalletIds]) {
                    const w = walletFromVersionId.get(versionId);
                    if (!w || !exchangeWallets.includes(w.abbr)) {
                        selectedWalletIds = _.pull(selectedWalletIds, versionId);
                    } else {
                        abbrs.push(w.abbr);
                    }
                }
                const toAdd = exchangeWallets
                    .filter(abbr => !abbrs.includes(abbr));
                for (const abbr of toAdd) {
                    const w = wallets.find(ww => ww.abbr === abbr);
                    if (!selectedWalletIds.includes(w.versionId)) {
                        selectedWalletIds.push(w.versionId);
                    }
                }
            } catch (err) {
                // handleError(err);
            }
        }

        console.log('selectedWalletIds: ', selectedWalletIds);
        const selectedAbbrs = [...wallets
            .filter(w => selectedWallets.includes(w.versionId))
            .map(w => w.abbr)
        ];

        console.log('selectedAbbrs: ', selectedAbbrs);
        updateState({
            'selectedWallets': selectedWalletIds,
            'selectedAbbrs': selectedAbbrs,
            'lookForWallets': true,
            'wallets': wallets
        })
        
    }

    function handleNavigation(route: CONFIG_ROUTE) {
        setRoute(route);
    }

    const renderContent = () => {
        switch (route) {
            case CONFIG_ROUTE.CONFIGURATION_MENU:
                return <ConfigurationMenu setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.SELECT_SETUP_TYPE:
                return <SelectSetUpType setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.SELECT_WALLET_VERSIONS:
                return <SelectWalletVersions setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.FINISH:
                return <Finish setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.SET_UP:
                return <ConfigurationMenu setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.SELECT_WALLETS: 
                return <SelectWallets setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.XLITE_SET_UP: 
                return <SelectWallets setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.ADD_WALLET:
                return <SelectSetUpType setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.FRESH_SET_UP:
                return <SelectSetUpType setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.UPDATE_WALLET:
                return <SelectSetUpType setTitle={setTitle} handleNavigation={handleNavigation} configMode="Update" />
            case CONFIG_ROUTE.ADD_WALLET_QUICK:
                return <AddWalletQuick setTitle={setTitle} handleNavigation={handleNavigation} state={state} />
            case CONFIG_ROUTE.ADD_WALLET_QUICK_FINISH:
                return <AddWalletQuickFinish setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.CONFIGURATION_COMPLETE:
                return <ConfigurationComplete setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.ADD_WALLET_EXPERT:
                return <AddWalletExpert setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.ADD_WALLET_EXPERT_FINISH:
                return <AddWalletExpertFinish setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.UPDATE_RPC_SETTINGS:
                return <RpcSettings setTitle={setTitle} handleNavigation={handleNavigation} />
            default:
                return <></>;
        }
    }

    return (
        <div className='configuration-container d-flex flex-column h-100'>
            <SvgIcon
                classProp='logo-full'
                rightIcon='logo-full'
                type='link'
                containerClass='justify-content-center p-v-20'
            />

            <Text className='config-setup-title'>{title.toUpperCase()}</Text>
            {renderContent()}
        </div>
    );
}