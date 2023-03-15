import React from 'react';
import './Button.css';

interface ButtonProps {
    content?: string
    children?: any
    classProp?: string
    onClick?: () => void
}

export const Button = ({content = '', classProp = '', children, onClick}: ButtonProps) => {
    return (
        <button 
            className={`common-button ${classProp}`}
            onClick={onClick}
        >
            {children ? children : content}
        </button>
    );
}