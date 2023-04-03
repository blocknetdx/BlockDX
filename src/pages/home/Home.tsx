import React, { useState } from 'react';
import SideBar from '../../components/side-bar/SideBar';
import Header from '../../components/header/Header';
import './home.css';
import { OrderForm } from '../../components/order-form/OrderForm';

export default function Home() {
    return (
        <React.Fragment>
            <Header />
            <div className='main-content d-flex flex-row'>
                <SideBar />
                <div className='flex-grow-1'></div>
                <OrderForm />
            </div>
        </React.Fragment>
    );

}