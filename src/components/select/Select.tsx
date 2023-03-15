import React from 'react';
import './Select.css';

interface SelectProps {
    list?: string[]
    classProp?: string
}

export const Select = ({ list, classProp }: SelectProps) => {
    return (
        <select className={`common-select ${classProp}`}>
            {
                list.map(item => (
                    <option selected key={`select-${item}`}>{item}</option>
                ))
            }
        </select>
    );
}