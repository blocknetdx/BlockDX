import React from 'react';

export enum CONFIG_ROUTE {
    SET_UP = 'setUp',
    XLITE_SET_UP = 'xLiteSetup',
    ADD_WALLET = 'addWallet',
    ADD_WALLET_QUICK = 'addWalletQuick',
    ADD_WALLET_QUICK_FINISH = 'addWalletQuickFinish',
    ADD_WALLET_EXPERT = 'addWalletExpert',
    UPDATE_WALLET = 'updateWallet',
    FRESH_SET_UP = 'freshSetup',
    UPDATE_RPC_SETTINGS = 'updateRpcSettings',
    CONFIGURATION_COMPLETE = 'configurationComplete',
}

export interface ConfigurationMenuProps {
    setTitle: React.Dispatch<React.SetStateAction<string>>
    handleNavigation: (route: CONFIG_ROUTE) => void
}

export type ConfigurationMenuOptionsType = {
    content: string
    option: string
    route: CONFIG_ROUTE
}
