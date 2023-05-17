import { ConfigDataContext } from "./data-context";
import React, { useState } from "react";
import {ConfigDataProviderProps, StateType} from './config-data-provider.type';

export default function ConfigDataProvider({ children }: ConfigDataProviderProps):React.ReactElement {
  const [state, setState] = useState<StateType>();

  function updateState(key: any, value: any) {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  function initState(initialState: StateType) {
    setState(initialState)
  }
 
  return (
    <ConfigDataContext.Provider
      value={{
        state,
        updateState,
        initState,
      }}
    >
      {children}
    </ConfigDataContext.Provider>
  );
};