import { ConfigDataContextType } from '@/context/config-data-provider.type';
import React from 'react';

const DataContext = React.createContext({});
const ConfigDataContext = React.createContext<ConfigDataContextType>({});

export {
    ConfigDataContext,
    DataContext
}
