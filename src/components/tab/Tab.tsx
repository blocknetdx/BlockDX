import React from 'react';
import { 
    Button,
    Separator 
} from '@components/index';

interface TabProps extends React.HTMLProps<HTMLDivElement> {
    tabs: string[],
    activeTab: string,
    setActiveTab: (tab: string) => void
}

export const Tab = ({
    tabs,
    activeTab,
    setActiveTab
} : TabProps) => {

    return (
        <div className='d-flex flex-row'>
            {
                tabs.map((tab, index) => {
                    return (
                        <React.Fragment key={tab}>
                            <Button
                                onClick={() => {
                                    setActiveTab(tab);
                                }}
                                className={`order-tab-header-title ${activeTab === tab ? 'active-tab' : ''}`}
                            >
                                {tab}
                            </Button>
                            {
                                index  < tabs.length - 1 ?
                                <Separator className='horizontal-separator' />
                                : null
                            }
                        </React.Fragment>
                    )
                })
            }
        </div>
    );
}