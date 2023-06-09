import { app, BrowserWindow, ipcMain, dialog } from 'electron';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const CONFIGURATION_WINDOW_WEBPACK_ENTRY: string;
declare const CONFIGURATION_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const { platform } = process;

const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const openAppWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 1000,
    width: 1400,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();
};

const openConfigurationWindow = (): void => {
  const configurationWindow = new BrowserWindow({
    height: platform === 'win32' ? 708 : platform === 'darwin' ? 695 : 670,
    width: 1050,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // configurationWindow.loadURL(`file:/${path.join(__dirname, 'src', 'configuration-old', 'configuration.html')}`);
  configurationWindow.loadURL(CONFIGURATION_WINDOW_WEBPACK_ENTRY);
  configurationWindow.webContents.openDevTools();
};


const onReady = new Promise(resolve => app.on('ready', resolve));

// app.on('ready', openAppWindow);

(async function() {
  await onReady;

  openConfigurationWindow();

  // openAppWindow();
})();

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    openAppWindow();
  }
});

type dialogOptionsType = {
  title: string
  properties: ("openDirectory" | "openFile" | "multiSelections" | "showHiddenFiles" | "createDirectory" | "promptToCreate" | "noResolveAliases" | "treatPackageAsDirectory" | "dontAddToRecent")[]
}

ipcMain.handle('open-dialog', async (event, arg) => {
  const options: dialogOptionsType = {
    title: 'Open File',
    properties: ['openDirectory']
  };
  const result = await dialog.showOpenDialog(options);
  return result.filePaths[0];
});

