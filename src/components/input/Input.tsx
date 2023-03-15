import React from 'react';
import './Input.css';

interface InputProps {
    classProp?: string
    placeholder?: string
}

export const Input = ({classProp, placeholder}: InputProps) => {
    return (
        <input className={`common-input ${classProp}`} type='text' placeholder={placeholder} />
    );
}