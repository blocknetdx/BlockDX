import React from 'react';
import './Select.css';

interface SelectProps extends React.HTMLProps<HTMLSelectElement> {
    lists?: string[]
    optionClass?: string
}

export const Select = (props: SelectProps) => {
    const { lists, optionClass = '' } = props;
    return (
        <select {...props} className={`common-select ${props.className}`}>
            {
                lists.map(item => (
                    <option className={optionClass} selected key={`select-${item}`}>{item}</option>
                ))
            }
        </select>
    );
}