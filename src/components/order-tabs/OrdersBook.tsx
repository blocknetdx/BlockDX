import React from 'react';

import {
    Text,
    SvgIcon
} from '@components/index'
import { createColumnHelper } from '@tanstack/react-table';

import { MemoTable } from './Table'

export const OrdersBookTable = () => {
    type OrdersBookType = {
        size: number
        minSize: number
        priceBTC: number
        priceLTC: number
        totalLTC: number
    }
    const data: OrdersBookType[] = [
        {
            size: 1.02,
            minSize: 1.02,
            priceLTC: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
        },
        {
            size: 1.09,
            minSize: 1.02,
            priceLTC: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
        },
        {
            size: 1.65,
            minSize: 1.02,
            priceLTC: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
        },
        {
            size: 1.21,
            minSize: 1.02,
            priceLTC: 143.0024354,
            priceBTC: 0.0024985,
            totalLTC: 0.00248410,
        },
        {
            size: 1.02,
            minSize: 1.02,
            priceLTC: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
        },
        {
            size: 1.02,
            minSize: 1.02,
            priceLTC: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
        },
    ]
    const historyData: OrdersBookType[] = [
        {
            size: 1.02,
            minSize: 1.02,
            priceLTC: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
        },
        {
            size: 0.965,
            minSize: 1.02,
            priceLTC: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
        },
        {
            size: 1.024,
            minSize: 1.02,
            priceLTC: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
        },
        {
            size: 1.96,
            minSize: 1.02,
            priceLTC: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
        },
        {
            size: 1.02,
            minSize: 1.02,
            priceLTC: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
        },
        {
            size: 1.02,
            minSize: 1.02,
            priceLTC: 143.0024354,
            priceBTC: 0.0024354,
            totalLTC: 0.00248410,
        },
    ]

    const columnHelper = createColumnHelper<OrdersBookType>();

    const renderContent = (value: number, contentClass = '') => {
        return (
            <Text className={'order-table-content ' + contentClass}>{value}</Text>
        );
    }

    const getColumns = (type = 'buy') => {
        return [
            columnHelper.accessor('size', {
                header: () => <Text className='order-tab-table-header-title'>Size (PIVX)</Text>,
                cell: info => renderContent(info.getValue())
            }),
            columnHelper.accessor('minSize', {
                header: () => <Text className='order-tab-table-header-title'>Min Size</Text>,
                cell: info => renderContent(info.getValue())
            }),
            columnHelper.accessor('priceBTC', {
                header: () => <Text className='order-tab-table-header-title'>Price (BTC)</Text>,
                cell: info => renderContent(info.getValue(), type === 'buy' ? 'text-success' : 'text-error')
            }),
            columnHelper.accessor('priceLTC', {
                header: () => <Text className='order-tab-table-header-title'>Price (LTC)</Text>,
                cell: info => renderContent(info.getValue(), type === 'buy' ? 'text-success' : 'text-error')
            }),
            columnHelper.accessor('totalLTC', {
                header: () => <Text className='order-tab-table-header-title'>Total (LTC)</Text>,
                cell: info => renderContent(info.getValue())
            }),
        ]
    }


    return (
        <div className='d-flex flex-row justify-content-between'>
            <MemoTable data={ data } columns={getColumns('buy')} className='text-end' containerClass='flex-grow-1 m-r-10' />
            <MemoTable data={ historyData } columns={getColumns('sell')} className='text-end' containerClass='flex-grow-1 m-l-10' />
        </div>
    );
}