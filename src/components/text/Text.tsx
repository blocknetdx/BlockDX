import React from 'react';
import './Text.css'

interface TextProps extends React.HTMLProps<HTMLSpanElement> {
    content?: string
    children?: any
    innerRef?: React.MutableRefObject<HTMLSpanElement>
}

export const Text = (props : TextProps):React.ReactElement => {
    const { content, children, innerRef} = props;
    return (
        <span {...props} ref={innerRef} className={`common ${props.className}`}>{children ? children : content}</span>
    );
}

interface TextLinkProps extends TextProps {
    parentClass?: string
}

export const TextLink = ({
    className,
    children,
    content,
    parentClass,
}: TextLinkProps):React.ReactElement => {
    function openExternal(link: string) {
        if (!!window) {
            window.api.openExternal(link);
        }
    }

    function filterContent(content: string, className = ''): string | (string | React.ReactElement)[] {
        const array = content.split(/{{(.*?)}}(?!\})/);

        if (array.length === 1) {
            return content;
        }

        const renderContent = array.map((item, index) => {
            const linkArray = item.split(/-\{(.*?)\}/);
            return linkArray.length === 1 ? item : <Text key={`text-link-${linkArray[0]}-${index}`} className={`external-link ${className}`} onClick={() => openExternal(linkArray[1])}>{linkArray[0]}</Text>
        })

        return renderContent;
    }

    return (
        <Text className={parentClass}>{ ((children && typeof children === 'string') || content) ? filterContent(children || content, className) : children}</Text>
    )
}