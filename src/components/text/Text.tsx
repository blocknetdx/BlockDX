import React from 'react';
import './Text.css'

interface TextProps extends React.HTMLProps<HTMLSpanElement> {
    content?: string
    children?: any
    innerRef?: React.MutableRefObject<HTMLSpanElement>
}

export const Text = (props : TextProps) => {
    const { content, children, innerRef} = props;
    return (
        <span {...props} ref={innerRef} className={`common ${props.className}`}>{children ? children : content}</span>
    );
}

interface TextLinkProps extends TextProps {
    externalLink: string
}

export const TextLink = ({
    externalLink, ...rest
}: TextLinkProps):React.ReactElement => {
    function openExternal() {
        if (!!window) {
            window.api.openExternal(externalLink);
        }
    }

    return <Text {...rest} className='external-link' onClick={openExternal} />
}