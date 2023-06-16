import { useContext, useEffect, useState } from 'react';
import {
    ConfigurationMenuProps, CONFIG_ROUTE, ConfigurationMenuOptionsType
} from './configuration.type';
import { Text, Button, SvgIcon, Select } from '@components/index'
import SelectWallets from '@/configuration/select-wallets';
import SelectVersions from '@/configuration/select-versions';
import { ConfigDataContext } from '@/context';
import Wallet from '@/configuration/modules/wallet';
// import SelectDirectories from '@/configuration/expert-setting/select-directories';

type StatusType = 'configSetUp' | 'rpcSettings';
export type DataPathsType = {
    [key: string]: string
}

export type SubRouteType = 'selectWallet' | 'selectVersion' | 'selectDirectories' | 'rpcSettingsQuick' | 'rpcSettingsExpert'

export default function AddWalletExpert({
    setTitle,
    handleNavigation
}: ConfigurationMenuProps): React.ReactElement {
    const [dataPaths, setDataPaths] = useState<DataPathsType>({});
    const [status, setStatus] = useState<StatusType>('configSetUp');
    const [subRoute, setSubRoute] = useState<SubRouteType>('selectWallet');
    const { state } = useContext(ConfigDataContext);
    const { wallets } = state;
    const [selectedWallets, setSelectedWallets] = useState<Wallet[]>([]);
    const [selectedWalletIds, setSelectedWalletIds] = useState<string[]>([]);

    const options: ConfigurationMenuOptionsType[] = [
        {
            option: 'Configuration Setup',
            content: 'This option automatically detects the wallets installed and simplifies the process to configure them for trading. If using a custom data directory location, you must use Expert Setup.',
            route: CONFIG_ROUTE.ADD_WALLET_QUICK,
        },
        {
            option: 'RPC Settings',
            content: 'This option allows you to specify the data directory locations and RPC credentials',
            route: CONFIG_ROUTE.ADD_WALLET_EXPERT
        }
    ]

    const steps = [
        { status: 'configSetUp', title: 'Configuration Setup' },
        { status: 'rpcSettings', title: 'RPC Settings' },
    ]

    const handleOpenDialog = async (abbr: string) => {
        // ipcRenderer.sendSync('openDialog');
        if (!!window) {
            const directoryPath = await window.api.openDialog();
            setDataPaths(pre => ({
                ...pre,
                [abbr]: directoryPath
            }));
        }
    };

    function handleSelectWallets(versionId: string) {
        setSelectedWalletIds(selectedWalletIds.includes(versionId) ? selectedWalletIds.filter(item => item !== versionId) : [...selectedWalletIds, versionId])
    }

    function handleSelectAllWallets(wallets: string[]) {
        setSelectedWalletIds(wallets);
    }

    function handleSubNavigation(subRoute: SubRouteType) {
        setSubRoute(subRoute);
    }

    const filteredWallets = wallets.filter(w => selectedWalletIds.includes(w.versionId))

    function renderContent() {
        switch (subRoute) {
            case 'selectWallet':
                return (
                    <SelectWallets
                        selectWallet={handleSelectWallets}
                        selectAll={handleSelectAllWallets}
                        selectedWallets={selectedWalletIds} 
                        handleSubNavigation={handleSubNavigation}
                        handleNavigation={handleNavigation}
                    />
                )
            case 'selectVersion':
                return <SelectVersions filteredWallets={filteredWallets} handleSubNavigation={handleSubNavigation}  />
            case 'selectDirectories':
                return (
                    null
                    // <SelectDirectories
                    //     handleOpenDialog={handleOpenDialog}
                    //     filteredWallets={filteredWallets}
                    //     dataPaths={dataPaths}
                    // />
                )
            default:
                return null;
        }
    }

    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='d-flex flex-row flex-grow-1'>
                <div className='p-h-20 w-p-55 bg-182a3e'>
                    {
                        steps.map(({status: stepStatus, title}) => (
                            <div className='d-flex flex-row align-items-center m-v-10'>
                                <Text className={` ${(stepStatus === 'configSetUp' || status === 'rpcSettings') ? 'blue-circle-fill' : 'blue-circle-empty'}`} />
                                <Text className="configuration-setup-label">{title}</Text>
                            </div>
                        ))
                    }
                </div>
                { renderContent() }
            </div>
        </div>
    );
}