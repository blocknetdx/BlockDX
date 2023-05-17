export interface ConfigDataProviderProps {
    children?: any
}

export type SidebarItemType = {
    text: string
}

export type StateType = {
    sidebarSelected: boolean;
    sidebarItems: SidebarItemType[];
    skipSetup: boolean;
    generateCredentials: boolean;
    rpcPort: string;
    rpcIP: string;
    username: string;
    password: string;
    litewalletConfigDirectory: string;
    isFirstRun: boolean;
    configurationType: string;
    selectedWallets: any;
    selectedAbbrs: any;
    lookForWallets: boolean
}

