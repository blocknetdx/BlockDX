import React, { useState } from 'react';
import SideBar from './components/side-bar/SideBar';
import Header from './components/header/Header';
import './home.css';

export default function Home() {
    return (
        <React.Fragment>
            <Header />
            <div className='main-content'>
                <SideBar />
            </div>
        </React.Fragment>
    );

}