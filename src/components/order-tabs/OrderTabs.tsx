import React, { useState } from 'react';
import {
    Separator,
    Text,
    SvgIcon,
    Button,
    Select,
} from '@components/index';

import './OrderTabs.css'

import { Table, MemoTable } from './Table'
import { OrdersDataTable } from '@components/order-tabs/OrdersDataTable';
import { OrdersBookTable } from '@components/order-tabs/OrdersBook';

const orderTabs = ['OPEN ORDERS', 'ORDER BOOK', 'ORDER HISTORY', 'TRADE HISTORY']

export const OrderTabs = () => {
    const [activeTab, setActiveTab] = useState('OPEN ORDERS');

    const handleChangeTab = (tab: string = 'OPEN ORDERS') => {
        setActiveTab(tab)
    }

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
            <div className='d-flex flex-row justify-content-between p-10 common-border-bottom'>
                <div className='d-flex flex-row align-items-center'>
                    {
                        orderTabs.map((tab, index) => {
                            return (
                                <React.Fragment key={tab}>
                                    <Button
                                        onClick={() => {
                                            handleChangeTab(tab);
                                        }}
                                        className={`order-tab-header-title ${activeTab === tab ? 'active-tab' : ''}`}
                                    >
                                        {tab}
                                    </Button>
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
                <div className='d-flex flex-row'>
                    {
                        activeTab === 'ORDER BOOK' ?
                        <Select
                            className='order-tab-select'
                            optionClass='order-tab-option-text'
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