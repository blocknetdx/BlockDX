import React from 'react';
import './Select.css';

interface SelectProps extends React.HTMLProps<HTMLSelectElement> {
    lists?: string[]
}

export const Select = (props: SelectProps) => {
    const { lists } = props;
    return (
        <select {...props} className={`common-select ${props.className}`}>
            {
                lists.map(item => (
                    <option selected key={`select-${item}`}>{item}</option>
                ))
            }
        </select>
    );
}