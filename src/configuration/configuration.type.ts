import { StateType, configType } from '@/context';
import React from 'react';

export enum CONFIG_ROUTE {
    SELECT_SETUP_TYPE = 'selectSetupType',
    CONFIGURATION_MENU = 'configurationMenu',
    SELECT_WALLET_VERSIONS = 'selectWalletVersions',
    CONFIGURATION_COMPLETE = 'configurationComplete',
    FINISH = 'finish',
    SELECT_WALLETS = 'selectWallets',
    EXPERT_SELECT_WALLET_VERSIONS = 'expertSelectWalletVersions',
    SELECT_WALLET_DIRECTORIES = 'selectWalletDirectories',
    EXPERT_SELECT_SETUP_TYPE = 'expertSelectSetupType',
    ENTER_BLOCKNET_CREDENTIALS = 'enterBlocknetCredentials',
    ENTER_WALLET_CREDENTIALS = 'enterWalletCredentials',
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
    configType?: configType
}

export type CredentialsType = {
    username: string
    password: string
}