import { app, BrowserWindow, Config } from 'electron';
import { dialog, ipcMain, shell } from 'electron';
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
import { ManifestType, dialogOptionsType } from './main.type';
import { compareByVersion } from '@/src-back/util';
const path = require('path');
const fs = require('fs-extra-promise');

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const CONFIGURATION_WINDOW_WEBPACK_ENTRY: string;
declare const CONFIGURATION_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const { platform, env } = process;

const { name, version } = fs.readJSONSync(path.join(app.getAppPath(), 'package.json'));

let metaPath, user, password, port, pricingSource, apiKeys, pricingUnit, pricingFrequency, enablePricing, showWallet, isFirstRun = false;

let dataPath = '';
const homePath = app.getPath('home');
const appDataPath = app.getPath('appData');

if (platform === 'win32') {
  dataPath = path.join(env.LOCALAPPDATA, name);
} else {
  dataPath = app.getPath('userData');
}
logger.initialize(dataPath);

metaPath = path.join(dataPath, 'app-meta.json');
let storage = new SimpleStorage(metaPath);
const defaultLocale = 'en';

if (require('electron-squirrel-startup')) {
  app.quit();
}

let appWindow: BrowserWindow;

const openAppWindow = (): void => {
  appWindow = new BrowserWindow({
    height: 1000,
    width: 1400,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  appWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  appWindow.webContents.openDevTools();
};

type ConfigWindowOptionsType = {
  isFirstRun: boolean;
}

let configurationWindow:BrowserWindow;

const openConfigurationWindow = (options?: ConfigWindowOptionsType): void => {
  const { isFirstRun = false } = options;
  configurationWindow = new BrowserWindow({
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
};

const handleError = (err: any) => {
  logger.error(err.message + '\n' + err.stack);
};

ipcMain.handle('getManifest', async function (e) {
  try {
    // console.log('getManifest main: ');

    return getManifest();
  } catch (err) {
    handleError(err);
  }
});

const configurationFilesDirectory = path.join(app.getAppPath(), 'blockchain-configuration-files');

const getManifest = () => {

  let manifest: ManifestType[] = storage.getItem('manifest');
  if (!manifest) {
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
  // console.log('manifest: ', manifest);

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
  return tokenPaths[token] || '';
});

ipcMain.handle('getDefaultDirectory', (e, args) => {
  const { dirNameWin, dirNameMac, dirNameLinux } = args;
  const basePath = (platform === 'win32' || platform === 'darwin') ? appDataPath : homePath;
  const folder = platform === 'win32' ? dirNameWin : platform === 'darwin' ? dirNameMac : '.' + dirNameLinux;
  return path.join(basePath, folder)
});

ipcMain.handle('getSelected', e => {
  const selectedWallets = storage.getItem('selectedWallets') || [];
  return selectedWallets;
});

ipcMain.handle('getCredentials', e => {
  const username = storage.getItem('user') || '';
  const password = storage.getItem('password') || '';

  return {username, password}
});

ipcMain.handle('isFirstRun', e => {
  return isFirstRun;
});

const domainWhitelist = [
  'blocknet.co',
  'xlitewallet.com',
  'github.com',
  'reddit.com',
  'twitter.com',
  'discord.gg',
  'blocknet.us16.list-manage.com',
];

const validateUrl = (url:string) => {
  const domainPatts = domainWhitelist
    .map(d => new RegExp(`https://(.+\\.)*?${d}(?=/|$)`, 'i'));
  return domainPatts.some(p => p.test(url));
};

ipcMain.handle('openExternal', (e, url) => {
  if (validateUrl(url)) {
    shell.openExternal(url);
  }
});

const getCustomXbridgeConfPath = () => {
  return storage.getItem('xbridgeConfPath') || '';
};

ipcMain.handle('getXbridgeConfPath', (e) => {
  return getCustomXbridgeConfPath();
});

ipcMain.handle('getXbridgeConf', (e, xbridgeConfPath) => {
  return fs.readFileSync(xbridgeConfPath, 'utf8');
});

ipcMain.handle('getFilteredWallets', (e, wallets) => {
  console.log('getFilteredWallets: ');

  let filteredWallets = [...wallets]
    .filter(w => {
      const dir = w.directory;
      try {
        fs.statSync(dir);
        return true;
      } catch (err) {
        return false;
      }
    })
    .reduce((arr:any, w) => {
      const idx = arr.findIndex((ww:any )=> ww.abbr === w.abbr);
      console.log('idx: ', idx, arr);
      
      if (idx > -1) { // coin is already in array
        arr[idx].versions = [...arr[idx].versions, ...w.versions];
        return arr;
      } else {
        return [...arr, w];
      }
    }, [])
    .map((w:any) => {
      w.versions.sort(compareByVersion);
      w.version = w.versions[0];
      return w;
    });

  console.log('filteredWallets main index: ', filteredWallets);
  
  return filteredWallets;
});

ipcMain.handle('saveSelected', (e, selectedWallets = []) => {
  try {
    storage.setItem('selectedWallets', selectedWallets, true);
    return true;
  } catch (error) {
    return false;
  }
});

ipcMain.handle('configurationWindowCancel', e => {
  if (appWindow) {
    configurationWindow.close();
  } else {
    app.quit();
  }
});

ipcMain.handle('checkDirectory', (e, dir) => {
  try {
    fs.statSync(dir);
    return true;
  } catch (err) {
    return false;
  }
});

ipcMain.handle('showWarning', (e, message) => {
  const options = {
    defaultId: 2,
    title: 'Warning',
    message: message || 'Something went wrong!',
  };

  dialog.showMessageBox(null, options);
});

ipcMain.handle('getUser', e => {
  return storage.getItem('user') || '';
});
ipcMain.handle('getPassword', e => {
  return storage.getItem('password') || '';
});

ipcMain.handle('setTokenPaths', (e, wallets) => {
  let tokenPaths;

  if (!!wallets) {
    const origTokenPaths = storage.getItem('tokenPaths') || {};
    tokenPaths = wallets.reduce((obj: any, { directory, abbr }: any) => {
      return Object.assign({}, obj, {[abbr]: directory});
    }, origTokenPaths);
  } else {
    tokenPaths = {};
  }

  storage.setItem('tokenPaths', tokenPaths, true);
});

(async function () {
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
    if (!pricingSource) {
      pricingSource = pricingSources.CRYPTO_COMPARE;
      storage.setItem('pricingSource', pricingSource);
    }
    apiKeys = storage.getItem('apiKeys');
    if (!apiKeys) {
      apiKeys = {};
      storage.setItem('apiKeys', apiKeys);
    }
    pricingUnit = storage.getItem('pricingUnit');
    if (!pricingUnit) {
      pricingUnit = 'BTC';
      storage.setItem('pricingUnit', pricingUnit);
    }
    pricingFrequency = storage.getItem('pricingFrequency');
    if (!pricingFrequency) {
      pricingFrequency = 15000;
      storage.setItem('pricingFrequency', pricingFrequency);
    }
    enablePricing = storage.getItem('pricingEnabled');
    if (!enablePricing && enablePricing !== false) {
      enablePricing = true;
      storage.setItem('pricingEnabled', enablePricing);
    }
    showWallet = storage.getItem('showWallet');
    if (!showWallet && showWallet !== false) {
      showWallet = false;
      storage.setItem('showWallet', showWallet);
    }
    if (!storage.getItem('addresses')) {
      storage.setItem('addresses', {});
    }    

    if (!port) {
      port = '41414';
      storage.setItem('port', port);
    }

    if (!ip) {
      ip = '127.0.0.1';
      storage.setItem('blocknetIP', ip);
    }

    if (!user || !password) {
      await onReady;
      isFirstRun = true;
      openConfigurationWindow({ isFirstRun: true });
      return;
    }

    // openConfigurationWindow();

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


