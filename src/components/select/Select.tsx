import React from 'react';
import './Select.css';

interface SelectProps extends React.HTMLProps<HTMLSelectElement> {
    lists?: string[]
    optionClassName?: string
}

export const Select = (props: SelectProps) => {
    const { lists, className, optionClassName = '', ...rest } = props;
    return (
        <select {...rest} className={`common-select ${className}`}>
            {
                lists.map(item => (
                    <option className={optionClassName} key={`select-${item}`}>{item}</option>
                ))
            }
        </select>
    );
}