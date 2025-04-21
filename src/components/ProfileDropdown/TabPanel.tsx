import React, { ReactNode } from 'react';

// ==============================|| TAB PANEL WRAPPER ||============================== //

interface TabPanelProps {
    children: ReactNode;
    value: number;
    index: number;
    [key: string]: any;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
};

export function a11yProps(index: number) {
    return {
        id: `profile-tab-${index}`,
        'aria-controls': `profile-tabpanel-${index}`,
    };
}

export default TabPanel; 