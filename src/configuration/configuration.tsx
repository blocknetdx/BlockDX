import React, { useState, useEffect, useContext } from 'react';
import { SvgIcon, Text } from '@component';
import './configuration.css';
import { CONFIG_ROUTE } from './configuration.type';
import { ManifestType } from '@/main.type';
import Wallet from './modules/wallet';
import path from 'path';
import { ConfigDataContext } from '@context';
import _ from 'lodash';
import {
    Finish,
    SelectWalletVersions,
    RpcSettings,
    SelectSetUpType,
    ConfigurationComplete,
    ConfigurationMenu,
    SelectLitewalletConfigDirectory
} from '@configuration';
import { 
    EnterWalletCredentials,
    ExpertSelectDirectories,
    ExpertSelectWalletVersions,
    ExpertSelectWallets,
    ExpertSelectSetUpType
} from '@config-expert-setup';

export const Configuration: React.FC = () => {
    const [title, setTitle] = useState('');
     
    const [route, setRoute] = useState<CONFIG_ROUTE>(CONFIG_ROUTE.CONFIGURATION_MENU);
    const { state, updateState, initState } = useContext(ConfigDataContext);
    const { configurationType, setupType } = state || {};

    useEffect(() => {
        if (!!window) {
            setInitialState();
            getManifest();
        }
    }, []);

    useEffect(() => {
        handleUpdateTitle();
    }, [route]);

    function handleUpdateTitle() {
        switch (route) {
            case CONFIG_ROUTE.SELECT_SETUP_TYPE:
                setTitle(configurationType === 'FRESH_SETUP' ? 'fresh setup' : configurationType === 'ADD_WALLET' ? 'add wallet' : 'update wallet')
                break;
            case CONFIG_ROUTE.CONFIGURATION_MENU:
                setTitle('configuration menu');
                break;
            case CONFIG_ROUTE.SELECT_WALLET_VERSIONS:
                setTitle(configurationType === 'FRESH_SETUP' ? 'fresh setup - quick configuration setup' : configurationType === 'ADD_WALLET' ? 'add wallet - quick configuration setup' : 'update wallet - quick configuration setup')
                break;
            case CONFIG_ROUTE.CONFIGURATION_COMPLETE:
                setTitle('configuration complete!');
                break;
            case CONFIG_ROUTE.FINISH:
                setTitle(`${configurationType === 'FRESH_SETUP' ? 'fresh setup' : configurationType === 'UPDATE_WALLET' ? 'update wallet' : 'add wallet'} - ${setupType === 'QUICK_SETUP' ? 'quick' : 'expert'} configuration setup`);
                break;
            case CONFIG_ROUTE.XLITE_SET_UP:
                setTitle('Litewallet Setup - Select Config Directory');
                break;
            default:
                break;
        }
        
        if (setupType === 'EXPERT_SETUP' && [CONFIG_ROUTE.SELECT_WALLETS, CONFIG_ROUTE.SELECT_WALLET_DIRECTORIES, CONFIG_ROUTE.ENTER_WALLET_CREDENTIALS, CONFIG_ROUTE.EXPERT_SELECT_SETUP_TYPE, CONFIG_ROUTE.EXPERT_SELECT_WALLET_VERSIONS].includes(route)) {
            setTitle(`${configurationType === 'FRESH_SETUP' ? 'fresh setup' : configurationType === 'UPDATE_WALLET' ? 'update wallet' : 'add wallet'} - expert configuration setup`);
        }
    }
    
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
            configurationType: isFirstRun ? 'FRESH_SETUP' : undefined,
            skipSetup: false,
            abbrToVersion: new Map(),
        })
        // setRoute(isFirstRun ? CONFIG_ROUTE.CONFIGURATION_MENU : CONFIG_ROUTE.CONFIGURATION_MENU);
        setRoute(isFirstRun ? CONFIG_ROUTE.SELECT_SETUP_TYPE : CONFIG_ROUTE.CONFIGURATION_MENU);
    }

    async function getManifest() {
        let walletsOrigin: ManifestType[] = await window.api.getManifest();

        let wallets:Wallet[] = walletsOrigin.map(w => new Wallet(w));

        
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
        
        let selectedWalletIds = _.uniq([wallets[0].versionId, ...selectedWallets]);
        
        let xbridgeConfPath = await window?.api.getXbridgeConfPath();
        let xbridgeConf: string;
        
        console.log('xbridgeConfPath', xbridgeConfPath);
        
        try {
            if (!xbridgeConfPath) {
                xbridgeConfPath = path.join(wallets.find(w => w.abbr === 'BLOCK').directory, 'xbridge.conf')
                console.log('xbridgeConfPath', xbridgeConfPath);
            }
            // console.log('xbridgeConfPath: ', xbridgeConfPath);
            xbridgeConf = await window?.api.getXbridgeConf(xbridgeConfPath);
            
            console.log('xbridgeConf: ', xbridgeConf);
            
        } catch (error) {
            console.log('xbridgeconfpath error: ', error);
            xbridgeConf = '';
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

        const litewalletConfigdirectory = await window.api?.getLitewalletConfigDirectory();

        console.log('litewalletconfigdirectory: ', litewalletConfigdirectory);
        

        console.log('selectedAbbrs: ', selectedAbbrs);
        console.log('wallets: ', wallets);
        updateState({
            'selectedWallets': selectedWalletIds,
            'selectedAbbrs': selectedAbbrs,
            'lookForWallets': true,
            'wallets': wallets,
            'litewalletConfigDirectory': litewalletConfigdirectory
        })
        
    }

    function handleNavigation(route: CONFIG_ROUTE) {
        setRoute(route);
    }

    const renderContent = () => {
        switch (route) {
            case CONFIG_ROUTE.SELECT_SETUP_TYPE:
                return <SelectSetUpType handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.CONFIGURATION_MENU:
                return <ConfigurationMenu handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.SELECT_WALLET_VERSIONS:
                return <SelectWalletVersions handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.CONFIGURATION_COMPLETE:
                return <ConfigurationComplete />
            case CONFIG_ROUTE.FINISH:
                return <Finish handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.SELECT_WALLETS:
                return <ExpertSelectWallets handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.EXPERT_SELECT_WALLET_VERSIONS: 
                return <ExpertSelectWalletVersions handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.SELECT_WALLET_DIRECTORIES: 
                return <ExpertSelectDirectories handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.EXPERT_SELECT_SETUP_TYPE: 
                return <ExpertSelectSetUpType handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.ENTER_WALLET_CREDENTIALS: 
                return <EnterWalletCredentials handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.ENTER_BLOCKNET_CREDENTIALS:
                return <RpcSettings handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.XLITE_SET_UP:
                return <SelectLitewalletConfigDirectory handleNavigation={handleNavigation} />
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