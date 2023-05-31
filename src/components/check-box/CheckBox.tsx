import React from 'react';
import { Text } from '@/components/text/Text';

interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string
    label?: string
}

export function CheckBox({
    error,
    label,
    ...rest
}: CheckBoxProps): React.ReactElement {
    return (
        <div className='d-flex align-items-center'>
            <input
                type="checkbox"
                {...rest}
            />
            <Text className="configuration-setup-label" >{label}</Text>
        </div>
    );
}