import { StateType, configType } from '@context';
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
    XLITE_SET_UP = 'xLiteSetup',
    UPDATE_WALLET = 'updateWallet',
    FRESH_SET_UP = 'freshSetup',
    UPDATE_RPC_SETTINGS = 'updateRpcSettings',
}

export interface ConfigurationMenuProps {
    handleNavigation?: (route: CONFIG_ROUTE) => void
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