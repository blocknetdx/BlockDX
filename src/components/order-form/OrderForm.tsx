import React from 'react';

interface OrderFormProps {
    classProp?: string
}

export const OrderForm = ({classProp} : OrderFormProps) => {
    return (
        <div className={`common-order-form-container col-3 ${classProp}`}>
            <div className='d-flex flex-row justify-content-between px-2'>
                <span>Order Form</span>
                <button>Reset form</button>
            </div>
        </div>
    );
}