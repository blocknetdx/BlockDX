import React, { useState } from 'react';
import './OrderForm.css';

import { Text } from '../text/Text';
import { Button } from '../button/Button';
import { InputWithText } from '../input/InputWithText';
import { ToggleSwitch } from '../toggle-switch/ToggleSwitch';
import RangeSlider from '../range-slider/RangeSlider';
import { SvgIcon } from '../svg-icon';

interface OrderFormProps extends React.HTMLProps<HTMLDivElement> {
    classProp?: string
}

export const OrderForm = (props : OrderFormProps) => {
    const [status, setStatus] = useState('buy');
    const [step, setStep] = useState('main');
    const [error, setError] = useState(false);

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

                        } else if (step === 'preview') {
                            setStatus('buy')
                            setStep('main');
                        }
                    }}
                />
            </div>
            {
                step === 'main' ?
                <div className='order-form-content-container flex-grow-1 d-flex flex-column justify-content-between'>
                    <div>
                        <div className='d-flex flex-row justify-content-between m-b-21'>
                            <Button className={`buy-block-btn ${status === 'buy' ? 'buy-block-btn__active': ''}`} onClick={() => {setStatus('buy')}}>BUY BLOCK</Button>
                            <Button className={`sell-block-btn ${status === 'sell' ? 'sell-block-btn__active' : ''}`} onClick={() => { setStatus('sell')}}>SELL BLOCK</Button>
                        </div>

                        <InputWithText 
                            leftContent={ status === 'buy' ? 'Quantity to buy' : 'Quantity to sell'}
                            leftContentClass='input-text-left flex-grow-1'
                            rightContent='BLOCK'
                            rightContentClass='input-text-right'
                            className='common-input-text-container m-b-8-5'
                            inputClass='no-border'
                        />

                        <div className='d-flex flex-row align-items-center justify-content-between'>
                            <ToggleSwitch
                                leftContent='Advanced mode'
                                leftContentClass='advanced-mode'
                                switchClass='small-switch'
                            />

                            {
                                status !== 'buy' ? 
                                <Text className='max'>Max</Text>
                                : null
                            }
                        </div>

                        <InputWithText 
                            leftContent={ status === 'buy' ? 'Min buy qty' : 'Min sell qty'}
                            leftContentClass='input-text-left'
                            rightContent='BLOCK'
                            rightContentClass='input-text-right'
                            className='common-input-text-container m-b-10 m-t-21'
                            inputClass='no-border'
                            leftIcon='help-circle'
                            leftIconCategory='orderForm'
                        />

                        <RangeSlider max={500} initialValue={250} className={ status === 'sell' ? 'sell-background' : ''} />

                        <InputWithText 
                            leftContent='LTC Price'
                            leftContentClass='input-text-left flex-grow-1'
                            rightContent='LTC'
                            rightContentClass='input-text-right'
                            className='common-input-text-container m-b-10 m-t-30'
                            inputClass='no-border'
                        />
                        <InputWithText 
                            leftContent='BTC Price'
                            leftContentClass='input-text-left flex-grow-1'
                            rightContent='BTC'
                            rightContentClass='input-text-right'
                            className='common-input-text-container'
                            inputClass='no-border'
                        />

                        <div className='m-t-17' />

                        {
                            status === 'sell' ?
                            <div className='m-t-17'>
                                <SvgIcon 
                                    leftIcon='icon-wallet'
                                    leftIconCategory='orderForm'
                                    content='=55.2366 LTC'
                                    contentClass='asset-balance-content'
                                    containerClass='justify-content-end m-b-5'
                                />
                                <InputWithText 
                                    leftContent='Total'
                                    leftContentClass='input-text-left flex-grow-1'
                                    rightContent='LTC'
                                    rightContentClass='input-text-right'
                                    className='common-input-text-container'
                                    inputClass='no-border'
                                />
                                <div className='d-flex justify-content-end m-t-5'>
                                    <Text className='usd-amount'>approx $113.23 USD</Text>
                                </div>
                            </div>
                            : null
                        }
                    </div>

                    <Button 
                        className='primary-btn w-340 m-b-38' 
                        content={ status === 'buy' ? 'PREVIEW BUY ORDER' : 'PREVIEW SELL ORDER'} 
                        onClick={() => {setStep('preview')}}
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