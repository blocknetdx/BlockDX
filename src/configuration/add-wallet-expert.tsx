import { useEffect, useState } from 'react';
import {
    ConfigurationMenuProps, CONFIG_ROUTE, ConfigurationMenuOptionsType
} from './configuration.type';
import { Text, Button, SvgIcon, Select } from '@components/index'

export default function AddWalletExpert({
    setTitle,
    handleNavigation
}: ConfigurationMenuProps): React.ReactElement {
    const [dataPath, setDataPath] = useState('');

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

    const handleOpenDialog = async () => {
        // ipcRenderer.sendSync('openDialog');
        if (!!window) {
            const directoryPath = await window.api.openDialog();
            setDataPath(directoryPath);
        }
    };
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
                    <div className='d-flex flex-column flex-grow-1'>
                        <div className='m-v-5'>
                            <Text>Configuration files will be installed to these default data directories. To accept the default locations, select CONTINUE. To change the location, select BROWSE.</Text>
                        </div>
                        <div>
                            <Text className='error-text'>Errors detected on all wallets, please resolve at least one to continue</Text>
                        </div>
                        <div className='m-v-5 flex-grow-1 wallets-list-container p-20'>
                            <div className='wallet-versions-container p-20'>
                                <div className='d-flex justify-content-between align-items-center m-v-10'>
                                    <Text>Xaya</Text>
                                    <Text className='error-text'>Error: data directory not found</Text>
                                </div>
                                <div className='data-directory-select-container'>
                                    <input
                                        className='flex-grow-1 data-directory-input'
                                        type="text"
                                        name="walletCheckbox"
                                        disabled={true}
                                        value={dataPath}
                                    />
                                    <Button className='configuration-browse-btn' onClick={handleOpenDialog}>BROWSE</Button>
                                </div>
                            </div>
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
                        <Button className='configuration-continue-btn'
                            onClick={() => {
                                handleNavigation(CONFIG_ROUTE.ADD_WALLET_EXPERT_FINISH)
                            }}
                        >CONTINUE</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}