import { StateType } from '@/context';
import React from 'react';

export enum CONFIG_ROUTE {
    SET_UP = 'setUp',
    XLITE_SET_UP = 'xLiteSetup',
    ADD_WALLET = 'addWallet',
    ADD_WALLET_QUICK = 'addWalletQuick',
    ADD_WALLET_QUICK_FINISH = 'addWalletQuickFinish',
    ADD_WALLET_EXPERT = 'addWalletExpert',
    ADD_WALLET_EXPERT_FINISH = 'addWalletExpertFinish',
    UPDATE_WALLET = 'updateWallet',
    FRESH_SET_UP = 'freshSetup',
    UPDATE_RPC_SETTINGS = 'updateRpcSettings',
    CONFIGURATION_COMPLETE = 'configurationComplete',
    SELECT_SETUP_TYPE = 'selectSetupType',
    CONFIGURATION_MENU = 'configurationMenu'
}

export interface ConfigurationMenuProps {
    setTitle: React.Dispatch<React.SetStateAction<string>>
    handleNavigation: (route: CONFIG_ROUTE) => void
    state?: StateType
    configMode?: 'Add' | 'Update'
}

export type ConfigurationMenuOptionsType = {
    content: string
    option: string
    route: CONFIG_ROUTE
    type?: 'quickSetup' | 'expertSetup'
}

export type CredentialsType = {
    username: string
    password: string
}