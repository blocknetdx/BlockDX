import React, { useEffect, useState } from 'react';
import {
    Button,
    InputWithText,
    ToggleSwitch,
    Text,
    RangeSlider,
    SvgIcon
} from '../index'

const initialValues = {
    quantity: 0,
    minQuantity: 0
}

interface MainFormProps {
    status?: string
    setStep?: (param: string) => void
    initialValues?: typeof initialValues
}

export const MainForm = (props: MainFormProps) => {    
    const { status = 'buy', setStep } = props;

    const [advancedMode, setAdvancedMode] = useState(true);

    const [state, setState] = useState(initialValues)

    useEffect(() => {
        setState(initialValues)
    }, [props])    

    function handleChange(type: string, value: any) {
        setState(pre => ({
            ...pre,
            [type]: value
        }))
    }
    return (
        <div className='d-flex flex-column h-100 justify-content-between'>
            <div>
                <InputWithText
                    leftContent={status === 'buy' ? 'Quantity to buy' : 'Quantity to sell'}
                    leftContentClass='input-text-left flex-grow-1'
                    rightContent='BLOCK'
                    rightContentClass='input-text-right'
                    className='common-input-text-container m-b-8-5'
                    inputClass='no-border'
                    value={state.quantity}
                    onChange={(e) => {
                        setState(pre => ({
                            ...pre,
                            quantity: Number(e.target.value),
                            minQuantity: Number(e.target.value) * 0.1
                        }))
                    }}
                />

                <div className='d-flex flex-row align-items-center justify-content-between'>
                    <ToggleSwitch
                        leftContent='Advanced mode'
                        leftContentClass='advanced-mode'
                        switchClass='small-switch'
                        active={advancedMode}
                        setActive={setAdvancedMode}
                    />

                    {
                        status !== 'buy' ?
                            <Text className='max'>Max</Text>
                            : null
                    }
                </div>

                {
                    advancedMode ?
                    <React.Fragment>
                        <InputWithText
                            leftContent={status === 'buy' ? 'Min buy qty' : 'Min sell qty'}
                            leftContentClass='input-text-left'
                            rightContent='BLOCK'
                            rightContentClass='input-text-right'
                            className='common-input-text-container m-b-10 m-t-21'
                            inputClass='no-border'
                            leftIcon='help-circle'
                            leftIconCategory='orderForm'
                            value={Math.round(state.minQuantity)}
                            onChange={(e) => {
                                handleChange('minQuantity', Number(e.target.value) > state.quantity ? state.quantity : e.target.value)
                            }}
                        />
        
                        <RangeSlider 
                            max={state.quantity} 
                            initialValue={state.minQuantity} 
                            className={status === 'sell' ? 'sell-background' : ''}
                            onChange={(value: string) => {
                                handleChange('minQuantity', Number(value))
                            }}
                        />
                    </React.Fragment>
                    : null
                }


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
                content={status === 'buy' ? 'PREVIEW BUY ORDER' : 'PREVIEW SELL ORDER'}
                onClick={() => { setStep('preview') }}
            />
        </div>
    );
}