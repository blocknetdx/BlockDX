import { useContext, useEffect, useState } from 'react';
import {
    ConfigurationMenuProps, CONFIG_ROUTE, ConfigurationMenuOptionsType
} from './configuration.type';
import { Text, Button, TextLink } from '@components/index'
import { ConfigDataContext } from '@/context';
import { useCloseWindows } from '@hooks';

const ConfigurationMenu = ({
    setTitle,
    handleNavigation
}: ConfigurationMenuProps) => {
    const { updateSingleState } = useContext(ConfigDataContext);
    const { handleCloseConfigWindow } = useCloseWindows();

    const options: ConfigurationMenuOptionsType[] = [
        {
            option: 'XLite Setup',
            content: 'Use this to configure {{XLite-{https://xlitewallet.com}}} with BlockDX',
            route: CONFIG_ROUTE.XLITE_SET_UP,
            configType: 'LITEWALLET_RPC_SETUP'
        },
        {
            option: 'Add New Local Wallet(s)',
            content: 'Use this to configure new local wallets for trading. Newly added wallets will need to be restarted before trading',
            route: CONFIG_ROUTE.SELECT_SETUP_TYPE,
            configType: 'ADD_WALLET'
        },
        {
            option: 'Update Local Wallet(s)',
            content: 'Use this to reconfigure existing local wallet(s). Updated wallets will need to be restarted before trading.',
            route: CONFIG_ROUTE.SELECT_SETUP_TYPE,
            configType: 'UPDATE_WALLET'
        },
        {
            option: 'Fresh Setup',
            content: 'Use this to reconfigure all you local wallets. This will require all local wallets to be restarted before trading and will cancel any open and in-progress orders from these wallets',
            route: CONFIG_ROUTE.SELECT_SETUP_TYPE,
            configType: 'FRESH_SETUP'
        },
        {
            option: 'Update Blocknet RPC Settings',
            content: 'Use this to update the RPC credentials, port, and IP for the Blocknet Core wallet. This will require the Blocknet Core wallet to be restarted, which will cancel any open and in-progress orders from these wallets.',
            route: CONFIG_ROUTE.ENTER_BLOCKNET_CREDENTIALS,
            configType: 'RPC_SETTINGS'
        },
    ]

    const [selectedOption, setSelectedOption] = useState(options[0]);

    function filterContent(content: string): string | (string | React.ReactElement)[] {
        const array = content.split(/{{(.*?)}}(?!\})/);

        // console.group('filterContent');
        // console.log('array: ', array);
        

        if (array.length === 1) {
            return content;
        }

        const renderContent = array.map(item => {
            const linkArray = item.split(/-\{(.*?)\}/);
            // console.log('linkArray: ', linkArray);  
            
            return linkArray.length === 1 ? item : <TextLink externalLink={linkArray[1]}>{linkArray[0]}</TextLink>
        })

        // console.groupEnd();
        return renderContent;
    }

    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='p-h-20'>
                <Text>Please select which of the following you would like to do:</Text>
            </div>
            <Text className='m-l-33 text-left'>{filterContent('')}</Text>
            
            <div className='p-h-20 flex-grow-1 m-t-10'>
                {
                    options.map(({ option, content, configType }, index) => (
                        <div key={`configuration-menu-${index}`}>
                            <Button className='configuration-menu-option-btn' onClick={() => { setSelectedOption(options[index]) }}>
                                <div className='d-flex align-items-center'>
                                    <Text className={` ${selectedOption.configType === configType ? 'blue-circle-fill' : 'blue-circle-empty'}`} />
                                    <Text className="configuration-setup-label m-l-10 text-left">{option}</Text>
                                </div>
                                <Text className='m-l-33 text-left'>{filterContent(content)}</Text>
                            </Button>
                        </div>
                    ))
                }
            </div>
            <div className='d-flex flex-row justify-content-between m-v-20'>
                <Button
                    className='configuration-cancel-btn'
                    onClick={() => handleCloseConfigWindow()}
                >
                    CANCEL
                </Button>
                <Button
                    className='configuration-continue-btn'
                    onClick={() => {
                        updateSingleState('configurationType', selectedOption.configType)
                        handleNavigation(selectedOption.route);
                    }}
                >
                    CONTINUE
                </Button>
            </div>
        </div>
    );
}

export default ConfigurationMenu;