import React, { useContext, useState } from 'react';
import { InputWithText, Text, Button } from '@/components';
import { ConfigDataContext } from '@/context';
import { ConfigurationMenuProps } from '@/configuration/configuration.type';
import { CONFIG_ROUTE } from '@/configuration/configuration.type';

type OptionsType = {
    [key: string]: string | number;
}

export default function RpcSettings({
    handleNavigation,
}:ConfigurationMenuProps): React.ReactElement {
    const { state } = useContext(ConfigDataContext);
    const { username, password, rpcPort = 41414, rpcIP = '127.0.0.1' } = state;

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


    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='p-h-20'>
                <Text>In order to conduct peer-to-peer trades, Block DX requires the  Blocknet wallet and the wallets of any assets you want to trade with. Select the wallets that are installed to begin setup.</Text>
            </div>
            <div className='m-20 flex-grow-1'>
                {/* {
                    Object.keys(rpcSettings).map(setting => (
                        <InputWithText className='rpc-setting-text-container' leftContentContainerClass='rpc-setting-text-left-container' leftContent='Blocknet RPC Port' inputClass='rpc-setting-text-input' />
                        
                        ))
                    } */}
                {
                    Object.keys(options).map(option => (
                        <InputWithText className='rpc-setting-text-container' leftContentContainerClass='rpc-setting-text-left-container' leftContent={String(options[option])} inputClass='rpc-setting-text-input' value={rpcSettings[option]} />
                    ))
                }
            </div>

            <div className='d-flex flex-row justify-content-between m-v-20'>
                <Button
                    className='configuration-cancel-btn'
                    onClick={() => {
                        handleNavigation(CONFIG_ROUTE.ADD_WALLET)
                    }}
                >
                    BACK
                </Button>
                <Button 
                    className='configuration-continue-btn'
                    onClick={() => handleNavigation(CONFIG_ROUTE.ADD_WALLET)}
                >FINISH</Button>
            </div>
        </div>
    );
}