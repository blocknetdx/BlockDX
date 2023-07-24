import React, { useContext, useState } from 'react';
import { Button, Text } from '@component';
import { CONFIG_ROUTE, ConfigurationMenuProps } from '@/configuration/configuration.type';
import { ConfigDataContext } from '@/context';

export default function SelectLitewalletConfigDirectory({
    handleNavigation
}: ConfigurationMenuProps):React.ReactElement {
    const [litewalletDirectory, setLitewalletDirectory] =  useState('');
    const [continueDisabled, setContinueDisabled] = useState(true);
    const { updateSingleState } = useContext(ConfigDataContext);
    const handleOpenDialog = async () => {
        if (!!window) {
            const directoryPath = await window.api.openDialog();
            if (!directoryPath) return;

            setLitewalletDirectory(directoryPath);
            setContinueDisabled(true);

            const directory = await window.api?.checkAndGetLiteWalletDirectory(directoryPath);

            console.log('directory: ', directory);

            if (!!directory) {
                setContinueDisabled(false);
                updateSingleState('litewalletConfigDirectory', directory);
            }
            
        }
    };
    return (
        <div className='d-flex flex-row flex-grow-1'>
            <div className='m-h-20 d-flex flex-column'>
                <div className='d-flex flex-column flex-grow-1'>
                    <div className='m-v-5'>
                        <Text>Cannot connect to the CloudChains Litewallet. Please install the litewallet and try again. If using a custom directory, please select it below.</Text>
                    </div>
                    <Text className='m-t-10'>CloudChains Directory</Text>
                    <div className='m-v-5 flex-grow-1 d-flex flex-row p-t-10'>
                        <input
                            className='flex-grow-1 data-directory-input'
                            type="text"
                            name="walletCheckbox"
                            // disabled={true}
                            onChange={(e) => {
                                // handleInputDirectory(wallet.abbr, e.target.value)
                            }}
                            value={litewalletDirectory}
                        />
                        <Button
                            className='configuration-browse-btn flex-basis-40'
                            onClick={() => handleOpenDialog()}
                        >
                            BROWSE
                        </Button>
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
                    <Button
                        className='configuration-continue-btn'
                        disabled={continueDisabled}
                        onClick={() => {
                            // handleContinue();
                            handleNavigation(CONFIG_ROUTE.SELECT_WALLETS)
                        }}
                    >
                        CONTINUE
                    </Button>
                </div>
            </div>
        </div>
    );
}