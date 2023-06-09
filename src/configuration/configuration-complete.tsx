import { useState } from 'react';
import {
    ConfigurationMenuProps, CONFIG_ROUTE, ConfigurationMenuOptionsType
} from './configuration.type';
import { Text, Button } from '@components/index';

export default function ConfigurationComplete({
    setTitle,
    handleNavigation,
}: ConfigurationMenuProps) {
    const options: ConfigurationMenuOptionsType[] = [
        {
            option: 'Quick Setup (recommended)',
            content: 'This option automatically detects the wallets installed and simplifies the process to configure them for trading. If using a custom data directory location, you must use Expert Setup.',
            route: CONFIG_ROUTE.ADD_WALLET_QUICK,
        },
        {
            option: 'Expert Setup (advanced users only)',
            content: 'This option allows you to specify the data directory locations and RPC credentials',
            route: CONFIG_ROUTE.ADD_WALLET_EXPERT
        }
    ]

    const [selectedOption, setSelectedOption] = useState(options[0]);

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
                        setTitle(CONFIG_ROUTE.SET_UP);
                        handleNavigation(CONFIG_ROUTE.SET_UP)
                    }}
                >
                    CANCEL
                </Button>
                <Button 
                    className='configuration-continue-btn'
                    onClick={() => {
                        setTitle(selectedOption.route);
                        handleNavigation(selectedOption.route);
                    }}
                >
                    RESTART
                </Button>
            </div>
        </div>
    );
}
