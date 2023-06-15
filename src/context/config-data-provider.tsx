import { ConfigDataContext } from "./data-context";
import React, { useState } from "react";
import {ConfigDataProviderProps, ConfigModeType, StateType} from './config-data-provider.type';

export default function ConfigDataProvider({ children }: ConfigDataProviderProps):React.ReactElement {
  const [state, setState] = useState<StateType>();
  const [configMode, setConfigMode] = useState<ConfigModeType>('Add')

  function updateSingleState(key: any, value: any) {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  function updateState(state: StateType) {
    setState(pre => ({
      ...pre,
      ...state
    }))
  }

  function initState(initialState: StateType) {
    setState(initialState)
  }

  function updateConfigMode(mode: ConfigModeType) {
    setConfigMode(mode);
  }
 
  return (
    <ConfigDataContext.Provider
      value={{
        state,
        updateSingleState,
        initState,
        updateState,
        configMode,
        updateConfigMode
      }}
    >
      {children}
    </ConfigDataContext.Provider>
  );
};