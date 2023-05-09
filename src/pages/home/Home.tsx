import React from 'react';
import './home.css';
import {
    OrderTabs,
    Chart,
    OrderForm,
    Header,
    SideBar
} from '@components/index'

export default function Home() {
    return (
        <React.Fragment>
            <Header />
            <div className='main-content d-flex flex-row'>
                <SideBar />
                <div className='flex-grow-1'>
                    <Chart />
                    <OrderTabs />
                </div>
                <OrderForm />
            </div>
        </React.Fragment>
    );

}