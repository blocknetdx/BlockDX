import React from 'react';
import { Text } from '@components/text/Text';
import { SvgIcon } from '@components/svg-icon';
import { Separator } from '@components/separator/Separator';

const orderTabs = ['OPEN ORDERS', 'ORDER BOOK', 'ORDER HISTORY', 'TRADE HISTORY']

export const OrderTabs = () => {
    return (
        <div>
            <div className='d-flex flex-row justify-content-between'>
                <div>
                    {
                        orderTabs.map((tab, index) => {
                            return (
                                <React.Fragment key={tab}>
                                    <Text>{tab}</Text>
                                    {
                                        index  < orderTabs.length - 1 ?
                                        <Separator className='horizontal-separator' />
                                        : null
                                    }
                                </React.Fragment>
                            )
                        })
                    }
                </div>
                <SvgIcon 
                    rightIcon='arrow-expand-all'
                    rightIconCategory='orderTabs'
                />
            </div>
        </div>
    );
}