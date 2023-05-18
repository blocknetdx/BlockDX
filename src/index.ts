import { app, BrowserWindow, Config } from 'electron';
import { dialog, ipcMain } from 'electron';
import { 
  BLOCKNET_CONF_NAME3, 
  BLOCKNET_CONF_NAME4, 
  blocknetDir3, 
  blocknetDir4,
  logger,
  pricingSources,
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

let metaPath, user, password, port, pricingSource, apiKeys, pricingUnit, pricingFrequency, enablePricing, showWallet;

let dataPath = '';

if (platform === 'win32') {
  dataPath = path.join(env.LOCALAPPDATA, name);
} else {
  dataPath = app.getPath('userData');
}

console.log('dataPath: ', dataPath);

logger.initialize(dataPath);

metaPath = path.join(dataPath, 'app-meta.json');
let storage = new SimpleStorage(metaPath);
const defaultLocale = 'en';

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

type ConfigWindowOptionsType = {
  isFirstRun: boolean;
}

const openConfigurationWindow = (options?: ConfigWindowOptionsType): void => {
  const { isFirstRun = false } = options;
  const configurationWindow = new BrowserWindow({
    height: platform === 'win32' ? 708 : platform === 'darwin' ? 695 : 670,
    width: 1050,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: CONFIGURATION_WINDOW_PRELOAD_WEBPACK_ENTRY
    },
  });
  configurationWindow.loadURL(CONFIGURATION_WINDOW_WEBPACK_ENTRY);
  configurationWindow.webContents.openDevTools();

  ipcMain.on('isFirstRun', e => {
    e.returnValue = isFirstRun;
  });
};

const handleError = (err: any) => {
  logger.error(err.message + '\n' + err.stack);
};

ipcMain.handle('getManifest', async function(e) {
  try {
    console.log('getManifest main: ');
    
    return getManifest();
  } catch(err) {
    handleError(err);
  }
});

const configurationFilesDirectory = path.join(app.getAppPath(), 'blockchain-configuration-files');

const getManifest = () => {
  
  let manifest:ManifestType[] = storage.getItem('manifest');
  if(!manifest) {
    const filePath = path.join(configurationFilesDirectory, 'manifest-latest.json');
    manifest = fs.readJsonSync(filePath);
    console.log('inside getManifest function ddd: ', manifest);
  }

  const blockIdx = manifest.findIndex(t => t.ticker === 'BLOCK');
  const blockDirectories = versionDirectories[0];
  manifest[blockIdx] = Object.assign({}, manifest[blockIdx], {
    conf_name: blocknetConfNames[0],
    dir_name_linux: blockDirectories.linux,
    dir_name_mac: blockDirectories.darwin,
    dir_name_win: blockDirectories.win32
  });
  console.log('manifest: ', manifest);
  
  return manifest;
};


const onReady = new Promise(resolve => app.on('ready', resolve));

const versionDirectories = [
  blocknetDir4,
  blocknetDir3
];

const blocknetConfNames = [
  BLOCKNET_CONF_NAME4,
  BLOCKNET_CONF_NAME3
];


ipcMain.handle('open-dialog', async (event, args) => {
  const options: dialogOptionsType = {
    title: 'Open File',
    properties: ['openDirectory']
  };
  const result = await dialog.showOpenDialog(options);
  return result.filePaths[0];
});

ipcMain.handle('getTokenPath', (e, token) => {
  const tokenPaths = storage.getItem('tokenPaths') || {};
  console.log('tokenPaths[token]: ', tokenPaths[token]);
  
  return tokenPaths[token] || '';
});

(async function() {
  try {

    
    user = storage.getItem('user');
    password = storage.getItem('password');
    port = storage.getItem('port');

    let ip = storage.getItem('blocknetIP');
    let locale = storage.getItem('locale');

    if (!locale) {
      locale = 'en';
      storage.setItem('locale', defaultLocale)
    }

    pricingSource = storage.getItem('pricingSource');
    if(!pricingSource) {
      pricingSource = pricingSources.CRYPTO_COMPARE;
      storage.setItem('pricingSource', pricingSource);
    }
    apiKeys = storage.getItem('apiKeys');
    if(!apiKeys) {
      apiKeys = {};
      storage.setItem('apiKeys', apiKeys);
    }
    pricingUnit = storage.getItem('pricingUnit');
    if(!pricingUnit) {
      pricingUnit = 'BTC';
      storage.setItem('pricingUnit', pricingUnit);
    }
    pricingFrequency = storage.getItem('pricingFrequency');
    if(!pricingFrequency) {
      pricingFrequency = 15000;
      storage.setItem('pricingFrequency', pricingFrequency);
    }
    enablePricing = storage.getItem('pricingEnabled');
    if(!enablePricing && enablePricing !== false) {
      enablePricing = true;
      storage.setItem('pricingEnabled', enablePricing);
    }
    showWallet = storage.getItem('showWallet');
    if(!showWallet && showWallet !== false) {
      showWallet = false;
      storage.setItem('showWallet', showWallet);
    }
    if(!storage.getItem('addresses')) {
      storage.setItem('addresses', {});
    }

    if (!port) {
      port = '41414';
      storage.setItem('port', port);
    }

    if(!ip) {
      ip = '127.0.0.1';
      storage.setItem('blocknetIP', ip);
    }

    if(!user || !password) {
      await onReady;
      openConfigurationWindow({isFirstRun: true});
      return;
    }

    ipcMain.handle('getSelected', e => {
      const selectedWallets = storage.getItem('selectedWallets') || [];
      return selectedWallets;
    });
  

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


