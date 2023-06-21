import React, { useContext } from 'react';
import { Text } from '@/components';
import { ConfigDataContext } from '@/context';

export function SidePanel(): React.ReactElement {
    const { state } = useContext(ConfigDataContext);
    const { setupType, configurationType } = state;

    const isCheckedRpcSettings = setupType === 'QUICK_SETUP' || (setupType === 'EXPERT_SETUP' && configurationType === 'RPC_SETTINGS');
    
    return (
        <div className='p-h-20 w-p-55 bg-182a3e'>

            <div className='d-flex flex-row align-items-center m-v-10'>
                <Text className={'blue-circle-fill'} />
                <Text className="configuration-setup-label">Configuration Setup</Text>
            </div>
            <div className='d-flex flex-row align-items-center m-v-10'>
                <Text className={` ${isCheckedRpcSettings ? 'blue-circle-fill' : 'blue-circle-empty'}`} />
                <Text className="configuration-setup-label">RPC Settings</Text>
            </div>
        </div>
    );
}