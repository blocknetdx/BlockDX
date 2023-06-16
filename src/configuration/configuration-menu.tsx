import { useEffect, useState } from 'react';
import {
    ConfigurationMenuProps, CONFIG_ROUTE, ConfigurationMenuOptionsType
} from './configuration.type';
import { Text, Button, TextLink } from '@components/index'

const ConfigurationMenu = ({
    setTitle,
    handleNavigation
}: ConfigurationMenuProps) => {
    const options: ConfigurationMenuOptionsType[] = [
        {
            option: 'XLite Setup',
            content: 'Use this to configure {{XLite-{https://xlitewallet.com}}} with BlockDX',
            route: CONFIG_ROUTE.XLITE_SET_UP
        },
        // {
        //     option: 'XLite Setup',
        //     content: 'Use this to configure XLite with BlockDX',
        //     route: CONFIG_ROUTE.XLITE_SET_UP
        // },
        {
            option: 'Add New Local Wallet(s)',
            content: 'Use this to configure new local wallets for trading. Newly added wallets will need to be restarted before trading',
            route: CONFIG_ROUTE.ADD_WALLET
        },
        {
            option: 'Update Locall Wallet(s)',
            content: 'Use this to reconfigure existing local wallet(s). Updated wallets will need to be restarted before trading.',
            route: CONFIG_ROUTE.UPDATE_WALLET
        },
        {
            option: 'Fresh Setup',
            content: 'Use this to reconfigure all you local wallets. This will require all local wallets to be restarted before trading and will cancel any open and in-progress orders from these wallets',
            route: CONFIG_ROUTE.FRESH_SET_UP
        },
        {
            option: 'Update Blocknet RPC Settings',
            content: 'Use this to update the RPC credentials, port, and IP for the Blocknet Core wallet. This will require the Blocknet Core wallet to be restarted, which will cancel any open and in-progress orders from these wallets.',
            route: CONFIG_ROUTE.UPDATE_RPC_SETTINGS
        },
    ]

    const [selectedOption, setSelectedOption] = useState(options[0]);

    useEffect(() => {
        setTitle('configuration menu');
    }, [])

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
                    options.map(({ option, content, route }, index) => (
                        <div key={`configuration-menu-${index}`}>
                            <Button className='configuration-menu-option-btn' onClick={() => { setSelectedOption(options[index]) }}>
                                <div className='d-flex align-items-center'>
                                    <Text className={` ${selectedOption.route === route ? 'blue-circle-fill' : 'blue-circle-empty'}`} />
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
                >
                    CANCEL
                </Button>
                <Button
                    className='configuration-continue-btn'
                    onClick={() => {
                        setTitle(selectedOption.route)
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