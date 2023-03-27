import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    content?: string
    children?: any
}

export const Button = (props: ButtonProps) => {
    const { content, children } = props;
    return (
        <button 
            {...props}
            className={`common-button ${props.className}`}
        >
            {children ? children : content}
        </button>
    );
}