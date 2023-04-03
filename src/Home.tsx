import React, { useState } from 'react';
import SideBar from './components/side-bar/SideBar';
import Header from './components/header/Header';
import './home.css';
import { OrderTabs } from '@components/order-tabs/OrderTabs';

export default function Home() {
    return (
        <React.Fragment>
            <Header />
            <div className='main-content d-flex flex-row'>
                <SideBar />
                <OrderTabs />
            </div>
        </React.Fragment>
    );

}