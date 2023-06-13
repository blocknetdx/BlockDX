import { app, BrowserWindow } from 'electron';
import { dialog, ipcMain } from 'electron';
import { 
  BLOCKNET_CONF_NAME3, 
  BLOCKNET_CONF_NAME4, 
  blocknetDir3, 
  blocknetDir4,
  logger,
  SimpleStorage,
} from '@src-back';
// import { BLOCKNET_CONF_NAME3, BLOCKNET_CONF_NAME4, blocknetDir3, blocknetDir4 } from './src-back/constants';
import {ManifestType, dialogOptionsType} from './main.type';
const path = require('path');
const fs = require('fs-extra-promise');

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const CONFIGURATION_WINDOW_WEBPACK_ENTRY: string;
declare const CONFIGURATION_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const { platform, env } = process;

const { name, version } = fs.readJSONSync(path.join(app.getAppPath(), 'package.json'));

let metaPath, storage;

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
      contextIsolation: true,
      preload: CONFIGURATION_WINDOW_PRELOAD_WEBPACK_ENTRY
    },
  });
  // configurationWindow.loadURL(`file:/${path.join(__dirname, 'src', 'configuration-old', 'configuration.html')}`);
  configurationWindow.loadURL(CONFIGURATION_WINDOW_WEBPACK_ENTRY);
  // configurationWindow.webContents.openDevTools();
};

const onReady = new Promise(resolve => app.on('ready', resolve));

// app.on('ready', openAppWindow);

const configurationFilesDirectory = path.join(__dirname, 'blockchain-configuration-files');

const versionDirectories = [
  blocknetDir4,
  blocknetDir3
];

const blocknetConfNames = [
  BLOCKNET_CONF_NAME4,
  BLOCKNET_CONF_NAME3
];

const getManifest = () => {

  let manifest:ManifestType[] = []
  // let manifest = storage.getItem('manifest');
  if(!manifest) {
    const filePath = path.join(configurationFilesDirectory, 'manifest-latest.json');
    manifest = fs.readJsonSync(filePath);
  }

  const blockIdx = manifest.findIndex(t => t.ticker === 'BLOCK');
  const blockDirectories = versionDirectories[0];
  manifest[blockIdx] = Object.assign({}, manifest[blockIdx], {
    conf_name: blocknetConfNames[0],
    dir_name_linux: blockDirectories.linux,
    dir_name_mac: blockDirectories.darwin,
    dir_name_win: blockDirectories.win32
  });
  return manifest;

};

ipcMain.handle('open-dialog', async (event, args) => {
  const options: dialogOptionsType = {
    title: 'Open File',
    properties: ['openDirectory']
  };
  const result = await dialog.showOpenDialog(options);
  return result.filePaths[0];
});

(async function() {
  try {    
    await onReady;
    let dataPath = '';

    if (platform === 'win32') {
      dataPath = path.join(env.LOCALAPPDATA, name);
    } else {
      dataPath = app.getPath('userData');
    }

    console.log('dataPath: ', dataPath);

    logger.initialize(dataPath);

    metaPath = path.join(dataPath, 'app-meta.json');
    storage = new SimpleStorage(metaPath);

    openConfigurationWindow();

    // openAppWindow();
  } catch (error) {
    dialog.showErrorBox('Oops! There was an error.', error?.message + '\n' + error?.stack);
    app.quit();
  }
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


