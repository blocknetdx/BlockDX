// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// const { ipcRenderer, contextBridge } = require('electron');

import { ipcRenderer, contextBridge } from "electron";

export type ContextBridgeApi = {
  // Declare a `readFile` function that will return a promise. This promise
  // will contain the data of the file read from the main process.
  openDialog: () => Promise<string>
}


contextBridge.exposeInMainWorld('api', {
    openDialog: () => ipcRenderer.invoke('open-dialog')
});