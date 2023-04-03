export const categories = {
    common: 'common',
    sideBar: 'sideBar',
    sideBarContent: 'sideBarContent',
    orderTabs: 'orderTabs',
    orderForm: 'orderForm',
}

export type CategoryTypes = keyof typeof categories

export interface SvgIconProps {
    classProp?: string
    category?: CategoryTypes
    icon?: string
    type?: string
    onClick?: (type: string) => void
    leftIcon?: string
    leftIconCategory?: CategoryTypes
    rightIcon?: string
    rightIconCategory?: CategoryTypes
    content?: string
    contentClass?: string
    containerClass?: string
    leftContainerClass?: string
}