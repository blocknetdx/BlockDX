import { useState } from 'react';
import {
    SvgIcon,
    Select,
    Tab
} from '@component';

import './OrderTabs.css'

import { OrdersDataTable } from '@components/order-tabs/OrdersDataTable';
import { OrdersBookTable } from '@components/order-tabs/OrdersBook';

const orderTabs = ['OPEN ORDERS', 'ORDER BOOK', 'ORDER HISTORY', 'TRADE HISTORY']

export const OrderTabs = () => {
    const [activeTab, setActiveTab] = useState('OPEN ORDERS');

    const renderTable = () => {
        if (activeTab === 'OPEN ORDERS') {
            return (
                <OrdersDataTable />
            );
        } else if (activeTab === 'ORDER HISTORY') {
            return (
                <OrdersDataTable type='orderHistory' />
            );
        } else if (activeTab === 'ORDER BOOK') {
            return (
                <OrdersBookTable />
            );
        }

        return null;
    }
    return (
        <div className='common-container'>
            <div className='d-flex flex-row justify-content-between p-h-10 common-border-bottom p-l-0'>
                <Tab
                    tabs={orderTabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <div className='d-flex flex-row'>
                    {
                        activeTab === 'ORDER BOOK' ?
                        <Select
                            className='order-tab-select'
                            optionClassName='order-tab-option-text'
                            lists={['8 decimals', '10 decimals']}
                        />
                        : null
                    }
                    <SvgIcon 
                        rightIcon='arrow-expand-all'
                        rightIconCategory='orderTabs'
                    />
                </div>
            </div>

            {renderTable()}
        </div>
    );
}