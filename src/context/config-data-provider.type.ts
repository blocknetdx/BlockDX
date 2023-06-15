import { ManifestType } from "@/main.type";
import Wallet from "@/configuration/modules/wallet";

export interface ConfigDataProviderProps {
    children?: any
}

export type SidebarItemType = {
    text: string
}

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
    configurationType?: string;
    selectedWallets?: any;
    selectedAbbrs?: any;
    lookForWallets?: boolean
    wallets?: Wallet[]
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
