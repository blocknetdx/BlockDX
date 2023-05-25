import { useContext, useState } from 'react';
import {
    ConfigurationMenuProps, CONFIG_ROUTE, ConfigurationMenuOptionsType
} from './configuration.type';
import { Text, Button } from '@components/index';
import { ConfigDataContext } from '@/context';

export default function AddWallet({
    setTitle,
    handleNavigation,
    configMode = 'Add'
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
    const { updateConfigMode } = useContext(ConfigDataContext);

    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='p-h-20'>
                <div className='m-v-5'>
                    <Text>Block DX is the fastees, most secure, most reliable, and most decentralized exchange, allowing for peer-to-eer trading directly from your wallet.{'\n'}</Text>
                </div>
                <div className='m-v-5'>
                    <Text className='text-bold'>Prerequisites: </Text><Text>Block DX requires the latest Blocnet wallet and the wallets of any assets you want to trade with. These must be downloaded and installed before continuing. See the full list of compatible assets and wallet versions.</Text>
                </div>
            </div>
            <div className='p-h-20 flex-grow-1 m-t-10'>
                {
                    options.map(({ option, content, route }, index) => (
                        <div className="m-v-10" key={`configuration-menu-${index}`}>
                            <Button className='configuration-menu-option-btn' onClick={() => {setSelectedOption(options[index])}}>
                                <div className='d-flex align-items-center'>
                                    <Text className={` ${selectedOption.route === route ? 'blue-circle-fill' : 'blue-circle-empty'}`} />
                                    <Text className="configuration-setup-label m-l-10 text-left">{option}</Text>
                                </div>
                                    <Text className='m-l-33 text-left'>{content}</Text>
                            </Button>
                        </div>
                    ))
                }
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
                        updateConfigMode(configMode);
                        handleNavigation(selectedOption.route);
                    }}
                >
                    CONTINUE
                </Button>
            </div>
        </div>
    );
}
