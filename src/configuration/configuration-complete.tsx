import { ConfigDataContext } from '@/context';
import { Text, Button, TextLink } from '@component';
import { useCloseWindows } from '@hooks';
import React, { useContext } from 'react';

export default function ConfigurationComplete() {
    const { handleCloseConfigWindow } = useCloseWindows();
    const { state } = useContext(ConfigDataContext);

    function renderContent(): React.ReactElement {
        const { configurationType } = state;
        switch (configurationType) {
            case 'ADD_WALLET':
                return (
                    <React.Fragment>
                        <div className='m-v-5'>
                            <Text>Before Block DX can be used, these last few steps must be completed</Text>
                        </div>
                        <div className='m-v-5'>
                            <Text>{`1) The wallets for each of the newly added assets must be restarted to load the new configurations. Make sure that the wallets have been encrypted (Settings > Encrypt), synced and are fully unlocked (Settings > Unlock Wallet).`}</Text>
                        </div>
                        <div className='m-v-5'>
                            <Text>{`2) Open, sync, and fully unlock the Blocknet wallet`}</Text>
                        </div>
                        <div className='m-v-5'>
                            <Text>{`3) select RESTART to restart Block DX and begin trading.`}</Text>
                        </div>
                    </React.Fragment>
                )
            case 'UPDATE_WALLET':
                return (
                    <div className='m-v-5'>
                        <Text>Before the updated assets can be traded on Block DX, <strong>the wallets for each of the updated assets must be restarted</strong> to load the new configurations. This includes the Blocknet wallet if it was updated.</Text>
                    </div>
                )
            case 'FRESH_SETUP':
                return (
                    <React.Fragment>
                        <div className='m-v-5'>
                            <Text>Before Block DX can be used, these last few steps must be completed</Text>
                        </div>
                        <div className='m-v-5'>
                            <Text>{`1) Open the wallets of any assets you'll be trading. If any are already open, you will need to restart them in order to activate the new configurations. Make sure that the wallets have been encrypted (Settings > Encrypt) and are fully unlocked (Settings > Unlock Wallet).`}</Text>
                        </div>
                        <div className='m-v-5'>
                            <TextLink>{`2) Open the {{Blocknet wallet-{https://github.com/blocknetdx/blocknet/releases/latest}}}. If it is already open, you will need to restart it in order to activate the new configurations. Make sure that the wallet has been encrypted (Settings > Encrypt) and is fully unlocked (Settings > Unlock Wallet).`}</TextLink>
                        </div>
                        <div className='m-v-5'>
                            <Text>{`3) select RESTART to restart Block DX and begin trading.`}</Text>
                        </div>
                    </React.Fragment>
                )
            default:
                return null;
        }
    }

    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='p-h-20 flex-grow-1'>
                <div className='m-v-5'>
                    <Text>Before Block DX can be used, these last few steps must be completed</Text>
                </div>
                <div className='m-v-5'>
                    <Text>{`1) The wallets for each of the newly added assets must be restarted to load the new configurations. Make sure that the wallets have been encrypted (Settings > Encrypt), synced and are fully unlocked (Settings > Unlock Wallet).`}</Text>
                </div>
                <div className='m-v-5'>
                    <Text>{`2) Open, sync, and fully unlock the Blocknet wallet`}</Text>
                </div>
                <div className='m-v-5'>
                    <Text>{`3) select RESTART to restart Block DX and begin trading.`}</Text>
                </div>
            </div>

            <div className='d-flex flex-row justify-content-between m-v-20'>
                <Button
                    className='configuration-cancel-btn'
                    onClick={() => {
                        handleCloseConfigWindow();
                    }}
                >
                    CANCEL
                </Button>
                <Button
                    className='configuration-continue-btn'
                    onClick={() => {
                    }}
                >
                    RESTART
                </Button>
            </div>
        </div>
    );
}
