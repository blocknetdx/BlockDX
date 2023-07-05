import React from 'react';

import {
    Text,
    SvgIcon
} from '@component'
import { createColumnHelper } from '@tanstack/react-table';

import { MemoTable } from './Table'

interface OrdersDataTableProps {
    type?: string
}

export const OrdersDataTable = (props: OrdersDataTableProps) => {
    const { type = 'openOrders' } = props;
    type OrdersDataType = {
        type: string
        market: string
        amount: number
        minAmount: number
        price: number
        priceBTC: number
        totalLTC: number
        created: string
        status: string
    }
    const data: OrdersDataType[] = [
        {
            type: 'Buy',
            market: 'PIVX/BTC',
            amount: 1.02,
            minAmount: 1.02,
            price: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
            created: '14:12:36',
            status: '5/5'
        },
        {
            type: 'Sell',
            market: 'PIVX/BTC',
            amount: 1.02,
            minAmount: 1.02,
            price: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
            created: '14:12:36',
            status: '4/5'
        },
        {
            type: 'Sell',
            market: 'PIVX/BTC',
            amount: 1.02,
            minAmount: 1.02,
            price: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
            created: '14:12:36',
            status: 'Open'
        },
        {
            type: 'Buy',
            market: 'PIVX/BTC',
            amount: 1.02,
            minAmount: 1.02,
            price: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
            created: '14:12:36',
            status: 'Open'
        },
        {
            type: 'Buy',
            market: 'PIVX/BTC',
            amount: 1.02,
            minAmount: 1.02,
            price: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
            created: '14:12:36',
            status: '4/5'
        },
        {
            type: 'Sell',
            market: 'PIVX/BTC',
            amount: 1.02,
            minAmount: 1.02,
            price: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
            created: '14:12:36',
            status: 'Open'
        },
    ]
    const historyData: OrdersDataType[] = [
        {
            type: 'Buy',
            market: 'PIVX/BTC',
            amount: 1.02,
            minAmount: 1.02,
            price: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
            created: '14:12:36',
            status: 'cancel'
        },
        {
            type: 'Sell',
            market: 'PIVX/BTC',
            amount: 1.02,
            minAmount: 1.02,
            price: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
            created: '14:12:36',
            status: 'check'
        },
        {
            type: 'Buy',
            market: 'PIVX/BTC',
            amount: 1.02,
            minAmount: 1.02,
            price: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
            created: '14:12:36',
            status: 'Open'
        },
        {
            type: 'Buy',
            market: 'PIVX/BTC',
            amount: 1.02,
            minAmount: 1.02,
            price: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
            created: '14:12:36',
            status: '4/5'
        },
    ]

    const columnHelper = createColumnHelper<OrdersDataType>();

    const renderSortHeader = (title: string) => {
        return (
            <SvgIcon 
                content={title}
                contentClass='order-tab-table-header-title'
                rightIcon='table-sort'
                rightIconCategory='orderTabs'
                type='link'
                classProp='table-sort-btn'
            />
        );
    }

    const renderStatus = (status: string = 'cancel') => {
        if (type === 'openOrders') {
            return (
                <div className='d-flex flex-row align-items-center'>
                    <Text className='order-table-content order-status'>{status}</Text>
                    <Text className='order-table-status-cancel'>x</Text>
                </div>
            )
        }

        return (
            <SvgIcon 
                rightIcon={(status !== 'cancel' && status !== 'check') ? 'cancel' : status}
                rightIconCategory='orderTabs'
            />
        );
    }

    const columns = [
        columnHelper.accessor('type', {
            header: () => renderSortHeader('Type'),
            cell: info => <Text className={`order-table-type-content-${info.getValue().toLowerCase()}`}>{info.getValue()}</Text>
        }),
        columnHelper.accessor('market', {
            header: () => renderSortHeader('Market'),
            cell: info => <Text className='order-table-content'>{info.getValue()}</Text>
        }),
        columnHelper.accessor('amount', {
            header: () => renderSortHeader('Amount'),
            cell: info => <Text className='order-table-content'>{info.getValue()}</Text>
        }),
        columnHelper.accessor('minAmount', {
            header: () => renderSortHeader('MinAmount'),
            cell: info => <Text className='order-table-content'>{info.getValue()}</Text>
        }),
        columnHelper.accessor('price', {
            header: () => renderSortHeader('Price'),
            cell: info => <Text className='order-table-content'>{info.getValue()}</Text>
        }),
        columnHelper.accessor('priceBTC', {
            header: () => renderSortHeader('Price (BTC)'),
            cell: info => <Text className='order-table-content'>{info.getValue()}</Text>
        }),
        columnHelper.accessor('totalLTC', {
            header: () => renderSortHeader('Total (LTC)'),
            cell: info => <Text className='order-table-content'>{info.getValue()}</Text>
        }),
        columnHelper.accessor('created', {
            header: () => renderSortHeader('Created'),
            cell: info => <Text className='order-table-content'>{info.getValue()}</Text>
        }),
        columnHelper.accessor('status', {
            header: () => renderSortHeader('Status'),
            cell: info => renderStatus(info.getValue())
        }),
    ]


    return (
        <MemoTable data={ type === 'openOrders' ? data : historyData } columns={columns} />
    );
}