import React from 'react';
import { Text } from '@component';

interface ISidePanel {
    status?: number
}

export function SidePanel({
    status = 0
}:ISidePanel): React.ReactElement {
    if (!status || status === -1) {
        return <></>
    }
    return (
        <div className='p-h-20 w-p-55 bg-182a3e'>

            <div className='d-flex flex-row align-items-center m-v-10'>
                <Text className={'blue-circle-fill'} />
                <Text className="configuration-setup-label">Configuration Setup</Text>
            </div>
            <div className='d-flex flex-row align-items-center m-v-10'>
                <Text className={` ${status > 0 ? 'blue-circle-fill' : 'blue-circle-empty'}`} />
                <Text className="configuration-setup-label">RPC Settings</Text>
            </div>
        </div>
    );
}