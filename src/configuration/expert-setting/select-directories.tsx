import React from 'react';
import { Text, Button } from '@/components';
import Wallet from '@/configuration/modules/wallet';
import { DataPathsType } from '@/configuration/add-wallet-expert';

interface SelectDirectoriesProps {
    dataPaths: DataPathsType
    filteredWallets: Wallet[]
    handleOpenDialog?: (abbr: string) => void
}

export default function SelectDirectories({
    filteredWallets = [],
    dataPaths,
    handleOpenDialog
}:SelectDirectoriesProps): React.ReactElement {

    return (
        <div className='m-h-20 d-flex flex-column'>
            <div className='d-flex flex-column flex-grow-1'>
                <div className='m-v-5'>
                    <Text>Configuration files will be installed to these default data directories. To accept the default locations, select CONTINUE. To change the location, select BROWSE.</Text>
                </div>
                {
                    Object.keys(dataPaths).length !== 0 ? null :
                    <div>
                        <Text className='error-text'>Errors detected on all wallets, please resolve at least one to continue</Text>
                    </div>
                }
                <div className='m-v-5 flex-grow-1 wallets-list-container p-20'>
                    {
                        filteredWallets.map(wallet => (
                            <div className='wallet-versions-container p-20'>
                                <div className='d-flex justify-content-between align-items-center m-v-10'>
                                    <Text>{wallet.name}</Text>
                                    {
                                        !!dataPaths[wallet.abbr] ? null :
                                        <Text className='error-text'>Error: data directory not found</Text>
                                    }
                                </div>
                                <div className='data-directory-select-container'>
                                    <input
                                        className='flex-grow-1 data-directory-input'
                                        type="text"
                                        name="walletCheckbox"
                                        disabled={true}
                                        value={dataPaths[wallet.abbr]}
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
                    }}
                >
                    CANCEL
                </Button>
                <Button className='configuration-continue-btn'
                    onClick={() => {
                    }}
                >CONTINUE</Button>
            </div>
        </div>
    );
}