import { useContext, useState } from 'react';
import {
    ConfigurationMenuProps, CONFIG_ROUTE, ConfigurationMenuOptionsType
} from './configuration.type';
import { Text, Button, SvgIcon, Select } from '@components/index'
import { ConfigDataContext } from '@/context';

export default function AddWalletQuickFinish({
    setTitle,
    handleNavigation
}: ConfigurationMenuProps):React.ReactElement {
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
    ];

    const { configMode, state } = useContext(ConfigDataContext)

    async function handleFinish() {
        if (!window) return;
        const addingWallets = configMode === 'Add';
        const updatingWallets = configMode === 'Update';

        const { selectedWallets = [], wallets } = state;

        const block = wallets.find(w => w.abbr === 'BLOCK');


        if (addingWallets) {
            
        } else if (updatingWallets) {
            
        }
        const saveSelectedRes = await window.api.saveSelected(selectedWallets);
    }
    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='d-flex flex-row flex-grow-1'>
                <div className='p-h-20 w-p-55 bg-182a3e'>
                    {
                        options.map(({ option, content, route }, index) => (
                            <div className="form-check m-v-20" key={`configuration-menu-${index}`}>
                                <div>
                                    <input
                                        className="form-check-input"
                                        type="radio" name="exampleRadios"
                                        id={`menu-${index}`}
                                        value={route}
                                        checked={true}
                                        // onChange={(e) => {
                                        //     console.log('radio inside input: ', e.target.value)
                                        //     setSelectedOption(options[index]);
                                        // }}
                                    />
                                    <Text className="configuration-setup-label" >
                                        {option}
                                    </Text>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='m-h-20 d-flex flex-column'>
                    <div className='flex-grow-1'>
                        <div className='m-v-5'>
                            <Text>Upon selecting FINISH, the configurations set will be saved</Text>
                        </div>
                        <Text className='text-bold'>Note: </Text><Text>Straking will be disabled on all configured wallets. Staking is not recommended for any wallet connected to Block DX, as it can interfere with your ability to trade.</Text>
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
                        <Button className='configuration-continue-btn' 
                            onClick={() => {
                                handleFinish();
                                // handleNavigation(CONFIG_ROUTE.CONFIGURATION_COMPLETE)
                            }}
                        >FINISH</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}