import React, { useState } from 'react';
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
    configurationComplete: 'configuration complete!',
}

export const Configuration: React.FC = () => {
    const [title, setTitle] = useState(CONFIG_ROUTE.SET_UP);
    // const [title, setTitle] = useState(configurationTitles['setUp']);
    const [route, setRoute] = useState<CONFIG_ROUTE>(CONFIG_ROUTE.ADD_WALLET_QUICK);

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