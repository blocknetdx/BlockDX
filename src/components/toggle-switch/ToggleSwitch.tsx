import './ToggleSwitch.css';
import { Text } from '@component'

interface ToggleSwitchProps {
    leftContent?: string
    leftContentClass?: string
    initialActiveStatus?: boolean
    switchClass?: string
    active?: boolean
    setActive?: (active?: boolean) => void
}

export const ToggleSwitch = (props: ToggleSwitchProps) => {
    const { 
        leftContent, 
        leftContentClass,
        switchClass = 'normal-switch',
        active,
        setActive
    } = props;
    return (
        <div className='d-flex flex-row align-items-center'>
            {
                leftContent ? 
                <Text className={leftContentClass}>{leftContent}</Text>
                : null
            }
            <div className="toggle-switch">
                <span className={`inner ${active ? 'inner-active' : null}`} />
                <button className={`${switchClass} ${active ? switchClass + '-active' : switchClass+'-inactive'}`} onClick={() => {
                    setActive(!active)}} />
            </div>
        </div>
    );
}