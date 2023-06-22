import { ManifestType } from "@/main.type";
import Wallet from "@/configuration/modules/wallet";

export interface ConfigDataProviderProps {
    children?: any
}

export type SidebarItemType = {
    text: string
}

export type configType = 'FRESH_SETUP' | 'ADD_WALLET' | 'UPDATE_WALLET' | 'RPC_SETTINGS' | 'LITEWALLET_RPC_SETUP' | undefined;

export type StateType = {
    sidebarSelected?: boolean;
    sidebarItems?: SidebarItemType[];
    skipSetup?: boolean;
    generateCredentials?: boolean;
    rpcPort?: string;
    rpcIP?: string;
    username?: string;
    password?: string;
    litewalletConfigDirectory?: string;
    isFirstRun?: boolean;
    configurationType?: configType;
    selectedWallets?: string[];
    selectedAbbrs?: string[];
    lookForWallets?: boolean
    wallets?: Wallet[];
    setupType?: 'QUICK_SETUP' | 'EXPERT_SETUP';
    addAbbrToVersion?: Map<string, string>;
    updateAbbrToVersion?: Map<string, string>;
    skipList?: string[];
    abbrToVersion?: Map<string, string>;
    configuringWallets?: Wallet[];
    configuringAbbrs?: string[];
}

export type ConfigDataContextType = {
    state?: StateType
    configMode?: ConfigModeType
    updateConfigMode?: (mode: ConfigModeType) => void
    updateSingleState?: (key: any, value: any) => void
    initState?: (initialState: StateType) => void
    updateState?: (state: StateType) => void
}

export type ConfigModeType = 'Add' | 'Update';