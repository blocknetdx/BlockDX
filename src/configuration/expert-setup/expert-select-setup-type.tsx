import { useContext, useEffect, useState } from 'react';
import {
    ConfigurationMenuProps, CONFIG_ROUTE, ConfigurationMenuOptionsType
} from '../configuration.type';
import { Text, Button, TextLink } from '@components/index';
import { ConfigDataContext } from '@/context';
import Wallet from '@/configuration/modules/wallet';
import { EXPERT_ROUTE } from '@/configuration/expert-setup/expert-setup';

interface IExpertSelectSetUpTypeProps {
    handleSubNavigation?: (route: EXPERT_ROUTE) => void
}

export default function ExpertSelectSetUpType({
    handleSubNavigation
}: IExpertSelectSetUpTypeProps) {
    const options: ConfigurationMenuOptionsType[] = [
        {
            option: 'Quick Setup',
            content: ' - Automatically generate credentials (recommended)',
            route: CONFIG_ROUTE.ADD_WALLET_QUICK,
            type: 'quickSetup'
        },
        {
            option: 'Expert Setup',
            content: ' - Manually create RPC credentials (advanced users only)',
            route: CONFIG_ROUTE.ADD_WALLET_EXPERT,
            type: 'expertSetup'
        }
    ]

    const [selectedOption, setSelectedOption] = useState(options[0]);
    const { state, updateSingleState } = useContext(ConfigDataContext);

    async function handleContinue() {
    }

    return (
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
                        handleSubNavigation(EXPERT_ROUTE.SELECT_DIRECTORIES)
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
    );
}
