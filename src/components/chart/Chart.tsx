import React, { useState } from 'react';

import {
    Tab
} from '@component'

import { StockChart } from './StockChart'
import { DepthChart } from './DepthChart'

import './Chart.css';

const chartTabs = ['PRICE CHART', 'DEPTH CHART']

export const Chart = ():React.ReactElement => {
    const [activeTab, setActiveTab] = useState('PRICE CHART')
    function renderTabs() {
        if (activeTab === 'PRICE CHART') {
            return <StockChart />
        }
        return <DepthChart />;
    }
    return (
        <div className='m-r-2'>
            <Tab
                tabs={chartTabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            { renderTabs() }
        </div>
    );
}