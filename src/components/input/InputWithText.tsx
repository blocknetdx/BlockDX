import React from 'react';
import {
    Text,
    Input,
    SvgIcon,
    CategoryTypes
} from '@components/index'

interface InputWithTextProps extends React.HTMLProps<HTMLDivElement> {
    leftContent?: string
    leftContentClass?: string
    rightContent?: string
    rightContentClass?: string
    inputClass?: string
    leftIcon?: string
    leftIconCategory?: CategoryTypes
    content?: string
    contentClass?: string
    value?: string | number | readonly string[]
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export const InputWithText = (props: InputWithTextProps) => {
    const { 
        leftContent, 
        rightContent, 
        inputClass, 
        leftContentClass, 
        rightContentClass,
        leftIcon,
        leftIconCategory,
        content = '',
        contentClass = '',
        value,
        onChange
    } = props;
    return (
        <div className={`common-input-text-container ${props.className}`}>
            {
                leftContent ? 
                <div className='d-flex flex-row flex-grow-1 align-items-center'>
                    <Text className={leftContentClass}>{leftContent}</Text>
                    {
                        leftIcon ?
                        <SvgIcon
                            rightIconCategory={leftIconCategory}
                            rightIcon={leftIcon}
                        /> : null
                    }
                </div>
                : null
            }
            {
                !content ?
                <Input className={inputClass} placeholder='0' value={value} onChange={onChange} />
                : <Text content={content} className={contentClass} />
            }
            {
                rightContent ? 
                <Text className={rightContentClass}>{rightContent}</Text>
                : null
            }
        </div>
    );
}