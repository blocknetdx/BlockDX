import React, { useContext, useState } from 'react';
import { InputWithText, Text, Button, TextLink } from '@/components';
import { ConfigDataContext } from '@/context';
import { ConfigurationMenuProps } from '@/configuration/configuration.type';
import { CONFIG_ROUTE } from '@/configuration/configuration.type';
import { SidePanel } from '@/configuration/side-panel';

type OptionsType = {
    [key: string]: string | number;
}

interface IRPCSettingsProps {
    handleNavigation?: (route: CONFIG_ROUTE) => void
}

export default function RpcSettings({
    handleNavigation
}:IRPCSettingsProps): React.ReactElement {
    const { state } = useContext(ConfigDataContext);
    const { configurationType, username = '', password = '', rpcPort = 41414, rpcIP = '127.0.0.1' } = state;

    const [rpcSettings, setRpcSettings] = useState<OptionsType>({
        username: username,
        password: password,
        rpcPort: rpcPort,
        rpcIP: rpcIP
    })

    const options:OptionsType = {
        rpcPort: 'Blocknet RPC Port',
        username: 'Blocknet RPC User',
        password: 'Blocknet RPC Password',
        rpcIP: 'Blocknet IP'
    }

    async function handleContinue() {
        const { username, password, rpcPort, rpcIP }:OptionsType = rpcSettings;
        if (!username || !password) {
            return;
        }

        if (configurationType !== 'RPC_SETTINGS') {
            await window.api?.saveDXData(username, password, rpcPort, rpcIP);
        }

        handleNavigation(CONFIG_ROUTE.FINISH)
    }

    return (
        <div className='d-flex flex-row flex-grow-1'>
            {
                configurationType === 'RPC_SETTINGS' ? null :
                <SidePanel status={1} />
            }
            <div className='d-flex flex-column flex-grow-1'>
                <div className='p-h-20'>
                    <Text>In order to conduct peer-to-peer trades, Block DX requires the <TextLink externalLink='https://github.com/blocknetdx/blocknet/releases/latest'>Blocknet wallet</TextLink> and the wallets of any assets you want to trade with. Select the wallets that are installed to begin setup.</Text>
                </div>
                <div className='m-20 flex-grow-1'>
                    {
                        Object.keys(options).map(option => (
                            <InputWithText
                                key={`rpc-settings-${option}`}
                                className='rpc-setting-text-container'
                                leftContentContainerClass='rpc-setting-text-left-container'
                                leftContent={String(options[option])}
                                inputClass='rpc-setting-text-input'
                                value={rpcSettings[option]}
                                onChange={(e) => {
                                    setRpcSettings({
                                        ...rpcSettings,
                                        [option]: e.target.value
                                    })
                                }}
                            />
                        ))
                    }
                </div>

                <div className='d-flex flex-row justify-content-between m-v-20'>
                    <Button
                        className='configuration-cancel-btn'
                        onClick={() => {
                            handleNavigation(CONFIG_ROUTE.SELECT_WALLETS)
                        }}
                    >
                        BACK
                    </Button>
                    <Button 
                        className='configuration-continue-btn'
                        onClick={() => 
                            handleContinue()
                        }
                    >CONTINUE</Button>
                </div>
            </div>
        </div>
    );
}