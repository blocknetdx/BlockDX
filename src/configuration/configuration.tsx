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
            return await window.api.getTokenPath(token)
        }

        return '';
    }

    async function getManifest() {
        let wallets:ManifestType[] = await window.api.getManifest();

        let filterdWallets = wallets.map(w => {
            const {versions= []} = w;
            return {name : w.blockchain || '',
            abbr : w.ticker || '',
            versionId : w.ver_id || '',
            versionName : w.ver_name || '',
            dirNameLinux : w.dir_name_linux || '',
            dirNameMac : w.dir_name_mac || '',
            dirNameWin : w.dir_name_win || '',
            repoURL : w.repo_url || '',
            versions : versions,
            xBridgeConf : w.xbridge_conf || '',
            walletConf : w.wallet_conf || '',
            confName : w.conf_name || '',
            error : false,
            username : '',
            password : '',
            port : '',
            version : versions.length > 0 ? versions[versions.length - 1] : '',
            directory : getCustomDirectory(w.ticker || ''),}
        })
        const blockIdx = filterdWallets.findIndex(w => w.abbr === 'BLOCK');
        const others = [
          ...filterdWallets.slice(0, blockIdx),
          ...filterdWallets.slice(blockIdx + 1)
    
        ].sort((a, b) => a.name.localeCompare(b.name));
        filterdWallets = [
          filterdWallets[blockIdx],
          ...others
        ];

        const selectedWallets = await window?.api.getSelectedWallets();
    
        let selectedWalletIds = Set([
          filterdWallets[0].versionId,
          ...selectedWallets
        ]);

        console.log('filterdWallets: ', filterdWallets);
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