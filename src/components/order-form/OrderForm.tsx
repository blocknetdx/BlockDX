import React, { useState } from 'react';
import './OrderForm.css';

import {
    Button,
    Text,
    InputWithText,
    SvgIcon
} from '@component'
import { MainForm } from './MainForm';

interface OrderFormProps extends React.HTMLProps<HTMLDivElement> {
    classProp?: string
}

export const OrderForm = (props : OrderFormProps):React.ReactElement => {
    const [status, setStatus] = useState('buy');
    const [step, setStep] = useState('main');
    const [error, setError] = useState(false);
    const [mainFormInitialValues, setMainFormInitialValues] = useState({
        quantity: 0,
        minQuantity: 0
    })

    const reset = () => {
        setStatus('buy')
        setError(false);
        setStep('main')
    }
    
    return (
        <div className={`common-order-form-container position-relative d-flex flex-column ${props.className}`}>
            <div className='d-flex flex-row justify-content-between order-form-header align-items-center common-border-bottom'>
                <Text className='title'>ORDER FORM</Text>
                <Button 
                    className='reset-form' 
                    content={step === 'main' ? 'Reset form' : 'Back'}
                    onClick={() => {
                        if (step === 'main') {                            
                            setMainFormInitialValues({...mainFormInitialValues})
                        } else if (step === 'preview') {
                            setStatus('buy')
                            setStep('main');
                        }
                    }}
                />
            </div>
            {
                step === 'main' ?
                <div className='order-form-content-container flex-grow-1 d-flex flex-column'>
                    <div className='d-flex flex-row justify-content-between m-b-21'>
                        <Button className={`buy-block-btn ${status === 'buy' ? 'buy-block-btn__active': ''}`} onClick={() => {setStatus('buy')}}>BUY BLOCK</Button>
                        <Button className={`sell-block-btn ${status === 'sell' ? 'sell-block-btn__active' : ''}`} onClick={() => { setStatus('sell')}}>SELL BLOCK</Button>
                    </div>
                    <MainForm
                        status={status}
                        setStep={setStep}
                        initialValues={mainFormInitialValues}
                    />
                </div>
                :
                step === 'preview' ?
                <div className='order-form-content-container'>
                    <div className='d-flex flex-grow-1'>
                        <Text className={`preview-title ${status === 'buy' ? 'preview-title__buy' : 'preview-title__sell'}`}>
                            {status === 'buy' ? 'CONFORM BLOCK BUY ORDER' : 'CONFIRM BLOCK SELL ORDER'}
                        </Text>
                    </div>
                    <InputWithText 
                        leftContent={ status === 'buy' ? 'Quantity to buy' : 'Quantity to sell'}
                        leftContentClass='input-text-left flex-grow-1'
                        rightContent='BLOCK'
                        rightContentClass='input-text-right'
                        className='preview-input-text-container m-b-26 m-t-20'
                        content='500.00'
                        contentClass='preview-amount-text'
                    />
                    <InputWithText 
                        leftContent='LTC Price'
                        leftContentClass='input-text-left flex-grow-1'
                        rightContent='LTC'
                        rightContentClass='input-text-right'
                        className='preview-input-text-container m-b-26'
                        content='0.109255'
                        contentClass='preview-amount-text'
                    />
                    <InputWithText 
                        leftContent='BTC Price'
                        leftContentClass='input-text-left flex-grow-1'
                        rightContent='BTC'
                        rightContentClass='input-text-right'
                        className='preview-input-text-container m-b-26'
                        content='0.001000'
                        contentClass='preview-amount-text'
                    />
                    <InputWithText 
                        leftContent='Fees'
                        leftContentClass='input-text-left flex-grow-1'
                        rightContent='BTC'
                        rightContentClass='input-text-right'
                        className='preview-input-text-container m-b-26'
                        content='0.00001'
                        contentClass='preview-amount-text'
                    />
                    <InputWithText 
                        leftContent='Total'
                        leftContentClass='input-text-left flex-grow-1'
                        rightContent='LTC'
                        rightContentClass='input-text-right'
                        className='preview-input-text-container'
                        content='54.6275'
                        contentClass='preview-amount-text'
                    />
                    <div className='d-flex justify-content-end m-t-5'>
                        <Text className='usd-amount'>approx $113.23 USD</Text>
                    </div>
                    <Button 
                        className='primary-btn w-340 m-t-30' 
                        content={ status === 'buy' ? 'CONFIRM BUY ORDER' : 'CONFIRM SELL ORDER'} 
                        onClick={() => {setError(true)}}
                    />
                </div> : null
            }

            {
                error ?
                <div className='common-order-form-container blur-container d-flex flex-column p-h-10 p-t-198'>
                    <SvgIcon 
                        classProp='m-l-10'
                        content={'Only assets of connected wallets can be traded'}
                        rightIconCategory='orderForm'
                        rightIcon='help-circle'
                        contentClass='icon-button-content m-r-8'
                        containerClass='connect-wallet-guide-container m-b-10'
                        type='link'
                    />
                    <Button className='primary-btn w-350' content='CONNECT A WALLET' onClick={() => {
                        reset();
                    }} />
                    <SvgIcon 
                        classProp='m-l-10'
                        content={'Learn how to connect to a wallet'}
                        rightIconCategory='sideBarContent'
                        rightIcon='open-external'
                        contentClass='icon-button-content'
                        containerClass='connect-wallet-guide-container'
                        type='link'
                    />
                </div>
                : null
            }
        </div>
    );
}