import React, { useState } from 'react';
import Header from './components/Header';
import SideBar from './components/side-bar/SideBar';

export default function Home() {
    return (
        <div>
            <Header />
            <h1>Main Content</h1>
            <div className='main-content'>
                <SideBar />
            </div>
        </div>
    );

}