import React from 'react';
import './Select.css';

interface SelectProps extends React.HTMLProps<HTMLSelectElement> {
    lists?: string[]
    optionClassName?: string
    handleChange?: (value: string) => void
}

export const Select = (props: SelectProps) => {
    const { lists, className, optionClassName = '', handleChange, ...rest } = props;
    return (
        <select 
            {...rest} 
            className={`common-select ${className}`}
            onChange={(e) => {
                handleChange(e.target.value);
            }}
        >
            {
                lists.map(item => (
                    <option className={optionClassName} key={`select-${item}`} value={item}>{item}</option>
                ))
            }
        </select>
    );
}