import React from 'react';
import './Text.css'

interface TextProps {
    content?: string
    classProp?: string
    children?: any
}

export const Text = ({content, classProp, children} : TextProps) => {
    return (
        <span className={`${classProp}`}>{children ? children : content}</span>
    );
}