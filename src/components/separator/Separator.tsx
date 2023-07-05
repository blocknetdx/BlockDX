import React from 'react';
import './Separator.css'

export const Separator = (props: React.HTMLProps<HTMLDivElement>):React.ReactElement => {
    return (
        <div className={props.className} />
    );
}