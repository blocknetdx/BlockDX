import React, { useState } from 'react';
import './ToggleSwitch.css';

export const ToggleSwitch = () => {
    const [active, setActive] = useState(false);

    return (
        <div className="toggle-switch">
            <span className={`inner ${active ? 'inner-active' : null}`} />
            <button className={`switch ${active ? 'switch-active' : null}`} onClick={() => {
                setActive(!active)}} />
        </div>
    );
}