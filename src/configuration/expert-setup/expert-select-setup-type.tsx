import { useContext, useState } from 'react';
import {
    CONFIG_ROUTE, ConfigurationMenuOptionsType
} from '../configuration.type';
import { Text, Button } from '@component';
import { ConfigDataContext } from '@context';
import { SidePanel } from '@/configuration/side-panel';

interface IExpertSelectSetUpTypeProps {
    handleNavigation?: (route: CONFIG_ROUTE) => void
}

export default function ExpertSelectSetUpType({
    handleNavigation
}: IExpertSelectSetUpTypeProps) {
    const { updateSingleState } = useContext(ConfigDataContext);

    const options: ConfigurationMenuOptionsType[] = [
        {
            option: 'Quick Setup',
            content: ' - Automatically generate credentials (recommended)',
            route: CONFIG_ROUTE.FINISH,
            type: 'quickSetup'
        },
        {
            option: 'Expert Setup',
            content: ' - Manually create RPC credentials (advanced users only)',
            route: CONFIG_ROUTE.ENTER_WALLET_CREDENTIALS,
            type: 'expertSetup'
        }
    ]

    const [selectedOption, setSelectedOption] = useState(options[0]);
    async function handleContinue() {
        updateSingleState('generateCredentials', selectedOption.type !== 'expertSetup' ? true : false)
        if (selectedOption.type === 'expertSetup') {
            handleNavigation(CONFIG_ROUTE.ENTER_WALLET_CREDENTIALS)
        } else {
            handleNavigation(CONFIG_ROUTE.FINISH)
        }
    }

    return (
        <div className='d-flex flex-row flex-grow-1'>
            <SidePanel status={1} />
            <div className='flex-grow-1 d-flex flex-column basis-p-150'>
                <div className='p-h-20'>
                    <div className='m-v-5'>
                        <Text>Usernames and passwords must be generated for the wallet of each asset that will be traded.</Text>
                    </div>
                </div>
                <div className='p-h-20 flex-grow-1 m-t-10'>
                    {
                        options.map(({ option, content, type }, index) => (
                            <div className="m-v-10" key={`configuration-menu-${index}`}>
                                <Button className='configuration-menu-option-btn' onClick={() => {setSelectedOption(options[index])}}>
                                    <div className='d-flex align-items-center'>
                                        <Text className={` ${selectedOption.type === type ? 'blue-circle-fill' : 'blue-circle-empty'}`} />
                                        <Text className="configuration-setup-label m-l-10 text-left">{option}</Text><Text className='text-left'>{content}</Text>
                                    </div>
                                </Button>
                            </div>
                        ))
                    }
                </div>
                <div className='d-flex flex-row justify-content-between m-v-20'>
                    <Button 
                        className='configuration-cancel-btn' 
                        onClick={() => {
                            handleNavigation(CONFIG_ROUTE.SELECT_WALLET_DIRECTORIES)
                        }}
                    >
                        { 'BACK' }
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
        </div>
    );
}
