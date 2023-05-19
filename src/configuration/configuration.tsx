import React, { useState, useEffect } from 'react';
import { SvgIcon } from '@components/index';
import './configuration.css';
import { CONFIG_ROUTE } from './configuration.type';
import ConfigurationMenu from './configuration-menu';
import SelectWallets from '@/configuration/select-wallets';
import AddWallet from '@/configuration/add-wallet';
import AddWalletQuick from '@/configuration/add-wallet-quick';
import AddWalletQuickFinish from '@/configuration/add-wallet-quick-finish';
import ConfigurationComplete from '@/configuration/configuration-complete';
import AddWalletExpert from '@/configuration/add-wallet-expert';
import AddWalletExpertFinish from '@/configuration/add-wallet-expert-finish';
import { ManifestType } from '@/main.type';
import { Set } from 'immutable';
import Wallet from './modules/wallet';
import path from 'path';


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
    const [title, setTitle] = useState(CONFIG_ROUTE.SET_UP);
    // const [title, setTitle] = useState(configurationTitles['setUp']);
    const [route, setRoute] = useState<CONFIG_ROUTE>(CONFIG_ROUTE.ADD_WALLET_EXPERT);

    useEffect(() => {
        if (!!window) {
            getManifest();
            // console.log('manifest list: ', window.api.getManifest());
        }
    }, []);

    async function getCustomDirectory(token: string) {
        if (!!window) {
            const customDir = await window.api.getTokenPath(token)
            return customDir ? customDir : await window.api.getDefaultDirectory
        }

        return '';
    }

    async function getManifest() {
        let walletsOrigin: ManifestType[] = await window.api.getManifest();

        let wallets = walletsOrigin.map(w => new Wallet(w));

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

        let selectedWalletIds = Set([
            wallets[0].versionId,
            ...selectedWallets
        ]);

        let xbridgeConfPath = await window?.api.getXbridgeConfPath();
        let xbridgeConf;

        try {            
            if (!xbridgeConfPath) {
                xbridgeConfPath = path.join(await wallets.find(w => w.abbr === 'BLOCK').directory, 'xbridge.conf')
            }
            console.log('xbridgeConfPath: ', xbridgeConfPath);
            xbridgeConf = await window?.api.getXbridgeConf(xbridgeConfPath);

            console.log('xbridgeConf: ', xbridgeConf);
            
        } catch (error) {
            console.log('xbridgeconfpath error: ', error);
            
        }

    }

    function handleNavigation(route: CONFIG_ROUTE) {
        setRoute(route);
    }

    const renderContent = () => {
        switch (route) {
            case CONFIG_ROUTE.SET_UP:
                return <ConfigurationMenu setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.XLITE_SET_UP:
                return <SelectWallets setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.ADD_WALLET:
                return <AddWallet setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.ADD_WALLET_QUICK:
                return <AddWalletQuick setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.ADD_WALLET_QUICK_FINISH:
                return <AddWalletQuickFinish setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.CONFIGURATION_COMPLETE:
                return <ConfigurationComplete setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.ADD_WALLET_EXPERT:
                return <AddWalletExpert setTitle={setTitle} handleNavigation={handleNavigation} />
            case CONFIG_ROUTE.ADD_WALLET_EXPERT_FINISH:
                return <AddWalletExpertFinish setTitle={setTitle} handleNavigation={handleNavigation} />
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

            {/* <h3>{title.toUpperCase()}</h3> */}
            <h3>{configurationTitles[route]?.toUpperCase()}</h3>
            {renderContent()}
        </div>
    );
}