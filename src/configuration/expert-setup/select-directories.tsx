import React, { useEffect, useState } from 'react';
import { Text, Button } from '@/components';
import Wallet from '@/configuration/modules/wallet';
import { DataPathsType } from '@/configuration/add-wallet-expert';
import { EXPERT_ROUTE } from '@/configuration/expert-setup/expert-setup';

interface SelectDirectoriesProps {
    filteredWallets: Wallet[]
    handleOpenDialog?: (abbr: string) => void
    abbrs?: string[]
    handleSetDataPaths?: () => void
    handleSubNavigation?: (route: EXPERT_ROUTE) => void
}

export default function SelectDirectories({
    filteredWallets = [],
    handleSubNavigation,
}:SelectDirectoriesProps): React.ReactElement {
    const [selectedWallets, setSelectedWallets] = useState<Wallet[]>([]);
    // const [errorCount, setErrorCount] = useState(0);

    useEffect(() => {
        console.log('select directories filteredWallets: ', filteredWallets);
        initiateWalletPaths();
    }, []);

    async function initiateWalletPaths() {
        const wallets = await window.api?.checkWalletDirectories(filteredWallets);
        setSelectedWallets(wallets);
    }

    const handleOpenDialog = async (abbr: string) => {
        // ipcRenderer.sendSync('openDialog');
        if (!!window) {
            const directoryPath = await window.api.openDialog();
            if (!directoryPath) return;

            setSelectedWallets(selectedWallets.map(wallet => {
                if (abbr !== wallet.abbr) {
                    return wallet;
                }

                return {
                    ...wallet,
                    directory: directoryPath,
                    error: false
                } as Wallet
            }))
        }
    };

    const errorCount = selectedWallets.reduce((count, wallet) => (!wallet.error && !!wallet.directory) ? count : count + 1, 0);

    
    const errorText = errorCount !== selectedWallets.length - 1 ? `${errorCount} error(s) detected: continue to skip wallets with errors.` : 'Errors detected on all wallets, please resolve at least one to continue';

    return (
        <div className='m-h-20 d-flex flex-column'>
            <div className='d-flex flex-column flex-grow-1'>
                <div className='m-v-5'>
                    <Text>Configuration files will be installed to these default data directories. To accept the default locations, select CONTINUE. To change the location, select BROWSE.</Text>
                </div>
                {
                    errorCount === 0 ? null :
                    <div>
                        <Text className='error-text'>{errorText}</Text>
                    </div>
                }
                <div className='m-v-5 flex-grow-1 wallets-list-container p-20 p-t-10'>
                    {
                        selectedWallets.map(wallet => (
                            <div key={`select-directories-${wallet.abbr}`} className='wallet-versions-container p-20 m-v-10'>
                                <div className='d-flex justify-content-between align-items-center m-v-10'>
                                    <Text>{wallet.name}</Text>
                                    {
                                        !!wallet.directory ? null :
                                        <Text className='error-text'>Error: data directory not found</Text>
                                    }
                                </div>
                                <div className='data-directory-select-container'>
                                    <input
                                        className='flex-grow-1 data-directory-input'
                                        type="text"
                                        name="walletCheckbox"
                                        disabled={true}
                                        value={wallet.directory}
                                    />
                                    <Button className='configuration-browse-btn' onClick={() => handleOpenDialog(wallet.abbr)}>BROWSE</Button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className='d-flex flex-row justify-content-between m-v-20'>
                <Button
                    className='configuration-cancel-btn'
                    onClick={() => {
                        handleSubNavigation(EXPERT_ROUTE.SELECT_VERSION)
                    }}
                >
                    CANCEL
                </Button>
                <Button className='configuration-continue-btn'
                    onClick={() => {
                        handleSubNavigation(EXPERT_ROUTE.SELECT_SETUP_TYPE)
                    }}
                >CONTINUE</Button>
            </div>
        </div>
    );
}