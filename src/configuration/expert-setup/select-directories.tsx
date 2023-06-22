import React, { useContext, useEffect } from 'react';
import { Text, Button } from '@/components';
import Wallet from '@/configuration/modules/wallet';
import { SidePanel } from '@/configuration/side-panel';
import { CONFIG_ROUTE } from '@/configuration/configuration.type';
import { ConfigDataContext } from '@/context';

interface SelectDirectoriesProps {
    handleNavigation?: (route: CONFIG_ROUTE) => void
}

export default function SelectDirectories({
    handleNavigation
}:SelectDirectoriesProps): React.ReactElement {
    const { state, updateSingleState } = useContext(ConfigDataContext);
    const { configuringWallets } = state;

    useEffect(() => {
        initiateWalletPaths();
    }, []);

    async function initiateWalletPaths() {
        const configWallets = await window.api?.checkWalletDirectories(configuringWallets);
        updateSingleState('configuringWallets', configWallets);
    }

    const handleOpenDialog = async (abbr: string) => {
        if (!!window) {
            const directoryPath = await window.api.openDialog();
            if (!directoryPath) return;

            updateSingleState('configuringWallets', configuringWallets.map(w => {
                if (w.abbr !== abbr) return w;
                return {
                    ...w,
                    directory: directoryPath,
                    error: false
                } as Wallet
            }))
        }
    };

    console.log('configuringWallets: ', configuringWallets);

    function handleInputDirectory(abbr: string, directory: string) {
        const idx = configuringWallets.findIndex(w => w.abbr === abbr);

        updateSingleState('configuringWallets', [
            ...configuringWallets.slice(0, idx),
            {
                ...configuringWallets[idx],
                directory: directory,
                error: false
            } as Wallet,
            ...configuringWallets.slice(idx + 1)
        ])
    }
    
    const errorCount = configuringWallets.reduce((count, wallet) => (!wallet.error && !!wallet.directory) ? count : count + 1, 0);

    const errorText = errorCount !== configuringWallets.length ? `${errorCount} error(s) detected: continue to skip wallets with errors.` : 'Errors detected on all wallets, please resolve at least one to continue';

    function handleContinue() {
        if (configuringWallets.findIndex(w => w.error === false && !!w.directory) === -1) return;

        updateSingleState('configuringWallet', configuringWallets.filter(w => w.error === false && !!w.directory));

        handleNavigation(CONFIG_ROUTE.EXPERT_SELECT_SETUP_TYPE);
    }

    return (
        <div className='d-flex flex-row flex-grow-1'>
            <SidePanel status={0} />
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
                            configuringWallets.map(wallet => (
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
                                            // disabled={true}
                                            onChange={(e) => {
                                                handleInputDirectory(wallet.abbr, e.target.value)
                                            }}
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
                            handleNavigation(CONFIG_ROUTE.EXPERT_SELECT_WALLET_VERSIONS)
                        }}
                    >
                        CANCEL
                    </Button>
                    <Button className='configuration-continue-btn'
                        onClick={() => {
                            handleContinue();
                        }}
                    >CONTINUE</Button>
                </div>
            </div>
        </div>
    );
}