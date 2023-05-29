// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// const { ipcRenderer, contextBridge } = require('electron');

import { ipcRenderer, contextBridge } from "electron";
import { ManifestType } from "@/main.type";
import Wallet from "@/configuration/modules/wallet";
import { CredentialsType } from "@/configuration/configuration.type";

export type ContextBridgeApi = {
  // Declare a `readFile` function that will return a promise. This promise
  // will contain the data of the file read from the main process.
  openDialog: () => Promise<string>
  getManifest: () => ManifestType[]
  getTokenPath: () => Promise<string>
  getXbridgeConfPath: () => Promise<string>
  getXbridgeConf: () => Promise<any>
  getSelectedWallets: () => any
  getDefaultDirectory: () => string
  getFilteredWallets: (wallets: any) => any
  saveSelected: () => any
  getCredentials: () => Promise<CredentialsType>
  isFirstRun: () => Promise<boolean>
  openExternal: (url: string) => void
  configurationWindowCancel: () => void
  checkDirectory: (dir: string) => Promise<boolean> 
  showWarning: (message: string) => void
}

type DefaultHomePaths = {
  dirNameWin: string;
  dirNameLinux: string;
  dirNameMac: string;
}


contextBridge.exposeInMainWorld('api', {
  openDialog: () => ipcRenderer.invoke('open-dialog'),
  getManifest: () => ipcRenderer.invoke('getManifest'),
  getTokenPath: (token: string) => ipcRenderer.invoke('getTokenPath', token) ,
  getSelectedWallets: () => ipcRenderer.invoke('getSelected'),
  getXbridgeConfPath: () => ipcRenderer.invoke('getXbridgeConfPath'),
  getXbridgeConf: (path: string) => ipcRenderer.invoke('getXbridgeConf', path),
  getDefaultDirectory: (defaultPaths: DefaultHomePaths) => ipcRenderer.invoke('getDefaultDirectory', defaultPaths),
  getFilteredWallets: (wallets: any) => ipcRenderer.invoke('getFilteredWallets', wallets),
  saveSelected: (selectedWallets: string[]) => ipcRenderer.invoke('saveSelected', selectedWallets),
  getCredentials: () => ipcRenderer.invoke('getCredentials'),
  isFirstRun: () => ipcRenderer.invoke('isFirstRun'),
  openExternal: (url:string) => ipcRenderer.invoke('openExternal', url),
  configurationWindowCancel: () => ipcRenderer.invoke('configurationWindowCancel'),
  checkDirectory: (dir: string) => ipcRenderer.invoke('checkDirectory', dir),
  showWarning: (message: string) => ipcRenderer.invoke('showWarning', message)
});