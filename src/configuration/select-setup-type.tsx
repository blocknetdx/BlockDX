import { useContext, useEffect, useState } from 'react';
import {
    ConfigurationMenuProps, CONFIG_ROUTE, ConfigurationMenuOptionsType
} from './configuration.type';
import { Text, Button, TextLink } from '@components/index';
import { ConfigDataContext } from '@/context';
import Wallet from '@/configuration/modules/wallet';

export default function SelectSetUpType({
    setTitle,
    handleNavigation,
    configMode = 'Add'
}: ConfigurationMenuProps) {
    const options: ConfigurationMenuOptionsType[] = [
        {
            option: 'Quick Setup (recommended)',
            content: 'This option automatically detects the wallets installed and simplifies the process to configure them for trading. If using a custom data directory location, you must use Expert Setup.',
            route: CONFIG_ROUTE.ADD_WALLET_QUICK,
            type: 'quickSetup'
        },
        {
            option: 'Expert Setup (advanced users only)',
            content: 'This option allows you to specify the data directory locations and RPC credentials',
            route: CONFIG_ROUTE.ADD_WALLET_EXPERT,
            type: 'expertSetup'
        }
    ]

    const [selectedOption, setSelectedOption] = useState(options[0]);
    const { state, updateSingleState } = useContext(ConfigDataContext);

    const { isFirstRun, wallets, configurationType } = state;

    useEffect(() => {
        setTitle(configurationType === 'FRESH_SETUP' ? 'fresh setup' : configurationType === 'ADD_WALLET' ? 'add wallet' : 'update wallet')
    }, [configurationType]);

    function handleCloseConfigWindow() {
        if (!!window) {
            window.api.configurationWindowCancel();
        }
    }

    async function handleContinue() {
        if (!window) return;

        updateSingleState('setupType', selectedOption.type === 'quickSetup' ? 'QUICK_SETUP' : 'EXPERT_SETUP')

        if (selectedOption.type === 'quickSetup') {
            // console.log('select setup type wallets: ', wallets);
            
            const newWallets: Wallet[] = wallets.map(wallet => (wallet.set('directory', (configMode === 'Add' && wallet.abbr === 'BLOCK') ? wallet.customDirectory : wallet.defaultDirectory)
            ))
            updateSingleState('wallets', newWallets);
            const blocknetWallet = newWallets.find(wallet => wallet.abbr === 'BLOCK');
            const dir = blocknetWallet.directory;

            console.log('handleContinue dir: ', dir);
            const checkDirectory = await window.api.checkDirectory(dir);

            console.log('checkDirectory: ', checkDirectory);
            if (checkDirectory) {
                handleNavigation(CONFIG_ROUTE.SELECT_WALLET_VERSIONS)
            } else {
                window.api.showWarning('An installation of the Blocknet wallet was not found, but is required to use Block DX. Please install the Blocknet wallet before continuing.','configurationWindowSetupType');
            }
        } else {
            const newWallets: Wallet[] = wallets.map(wallet => wallet.set('directory', wallet.customDirectory));
            updateSingleState('wallets', newWallets);
            // handleNavigation(CONFIG_ROUTE.ADD_WALLET_EXPERT);
            handleNavigation(CONFIG_ROUTE.SELECT_WALLETS);
        }
    }

    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='p-h-20'>
                <div className='m-v-5'>
                    <Text>Block DX is the fastees, most secure, most reliable, and most decentralized exchange, allowing for peer-to-eer trading directly from your wallet.{'\n'}</Text>
                </div>
                <div className='m-v-5'>
                    <Text className='text-bold'>Prerequisites: </Text><Text>Block DX requires the <TextLink externalLink='https://github.com/blocknetdx/blocknet/releases/latest'>latest Blocknet wallet</TextLink> and the wallets of any assets you want to trade with. These must be downloaded and installed before continuing. See the full list of <TextLink externalLink='https://docs.blocknet.co/blockdx/listings/#listed-digital-assets'>compatible assets and wallet versions</TextLink>.</Text>
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
                        if (isFirstRun) {
                            handleCloseConfigWindow();
                        } else {
                            setTitle(CONFIG_ROUTE.SET_UP);
                            handleNavigation(CONFIG_ROUTE.SET_UP)
                        }
                    }}
                >
                    { isFirstRun ? 'CANCEL' : 'BACK'}
                </Button>
                <Button 
                    className='configuration-continue-btn'
                    onClick={() => {
                        handleContinue();
                    }}
                >
                    CONTINUE
                </Button>
            </div>
        </div>
    );
}
