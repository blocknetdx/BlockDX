import React from 'react';
import {
    Text,
    Button,
} from '@component';

interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string
    label?: string
    onPress?: () => void
    containerClass?: string
    labelClass?: string
}

export function CheckBox({
    error,
    label,
    className,
    containerClass = '',
    labelClass = '',
    onPress,
    ...rest
}: CheckBoxProps): React.ReactElement {
    return (
        <Button className={`d-flex align-items-center no-background ${containerClass}`} onClick={onPress} >
            <input
                type="checkbox"
                className={`${className} m-t-4`}
                {...rest}
            />
            <Text className={`configuration-setup-label ${labelClass}`} >{label}</Text>
        </Button>
    );
}