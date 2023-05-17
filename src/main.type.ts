export type ManifestType = {
    blockchain: string;
    ticker: string;
    ver_id: string;
    ver_name: string;
    conf_name: string;
    dir_name_linux: string;
    dir_name_mac: string;
    dir_name_win: string;
    repo_url: string;
    versions: string[];
    xbridge_conf: string;
    wallet_conf: string;
}

export type dialogOptionsType = {
    title: string
    properties: ("openDirectory" | "openFile" | "multiSelections" | "showHiddenFiles" | "createDirectory" | "promptToCreate" | "noResolveAliases" | "treatPackageAsDirectory" | "dontAddToRecent")[]
}