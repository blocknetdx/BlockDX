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
import Wallet from '@wallet';
import _ from 'lodash';
import { LiteWalletDataType, SaveLiteWalletsDataType } from '@/configuration/preload';
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
  // appWindow.webContents.openDevTools();
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

ipcMain.handle('getFilteredWallets', (e, wallets: Wallet[]) => {
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
    .reduce((arr:Wallet[], w) => {
      const idx = arr.findIndex((ww:Wallet )=> ww.abbr === w.abbr);
      // console.log('idx: ', idx, arr);
      
      if (idx > -1) { // coin is already in array
        arr[idx].versions = _.uniq([...arr[idx].versions, ...w.versions]);
        return arr;
      } else {
        return [...arr, w];
      }
    }, [])
    .map((w:Wallet) => {
      w.versions.sort(compareByVersion);
      w.version = w.versions[0];
      return w;
    });

  console.log('filteredWallets main index is called: ');
  
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

ipcMain.handle('addToXBridgeConf', (e, {blockDir, data}) => {
  const confPath = path.join(blockDir, 'xbridge.conf');
  const bridgeConf = fs.readFileSync(confPath, 'utf8');
  let split = bridgeConf
    .replace(/\r/g, '')
    .split(/\n/);
  const exchangeWalletsPatt = /^ExchangeWallets\s*=(.*)/;
  const walletsIdx = split.findIndex((s: any) => exchangeWalletsPatt.test(s));
  const existingWalletList = split[walletsIdx].match(exchangeWalletsPatt)[1].trim().split(',').map((s: any) => s.trim()).filter((s: any) => s);
  const newWalletList = [...data.keys(), ...existingWalletList].filter(item => item !== '');
  split[walletsIdx] = `ExchangeWallets=${[...newWalletList.values()].join(',')}`;
  for(const [ abbr, walletData ] of [...data.entries()]) {
    split = [
      ...split,
      `\n[${abbr}]`,
      joinConf(walletData)
    ];
  }
  const joined = split.join('\n');
  fs.writeFileSync(confPath, joined, 'utf8');
});

ipcMain.handle('updateToXBridgeConf', (e, {blockDir, data}) => {
  const confPath = path.join(blockDir, 'xbridge.conf');
  const bridgeConf = fs.readFileSync(confPath, 'utf8');
  let split = bridgeConf
    .replace(/\r/g, '')
    .split(/\n/);
  for(const [ abbr, walletData ] of [...data.entries()]) {
    const startIndex = split.findIndex((s: string) => s.trim() === `[${abbr}]`);
    let endIndex;
    for(let i = startIndex + 1; i < split.length; i++) {
      const s = split[i].trim();
      if(!s) {
        endIndex = i - 1;
        break;
      } else if(/^\[.+]$/.test(s)) {
        endIndex = i - 1;
        break;
      } else if(i === split.length - 1) {
        endIndex = i;
      }
    }

    split = [
      ...split.slice(0, startIndex + 1),
      joinConf(walletData),
      ...split.slice(endIndex + 1)
    ];
  }
  const joined = split.join('\n');
  // fs.writeFileSync(confPath, joined, 'utf8');
});
ipcMain.handle('saveToXBridgeConf', (e, {blockDir, data}) => {
  const joined = [
    [
      '[Main]',
      `ExchangeWallets=${[...data.keys()].join(',')}`,
      'FullLog=true',
      'ShowAllOrders=true'
    ].join('\n'),
    '\n',
    ...[...data.entries()]
      .map(([ abbr, conf ]) => {
        return [
          `\n[${abbr}]`,
          joinConf(conf)
        ].join('\n');
      })
  ].join('');

  console.log('saveToXbridgeConf: ', joined);
  
  const confPath = path.join(blockDir, 'xbridge.conf');
  storage.setItem('xbridgeConfPath', confPath || '')
  fs.writeFileSync(confPath, joined, 'utf8');
});




ipcMain.handle('saveWalletConf', (e, {directory, conf, walletConf, credentials}) => {
  const filePath = path.join(directory, conf);
  fs.ensureFileSync(filePath);
  const defaultFile = filePath + '-defualt';
  if (!fileExists(defaultFile)) {
    fs.copySync(filePath, defaultFile)
  }
  const baseConfStr = getBaseConf(walletConf);
  if(!baseConfStr) throw new Error(`${walletConf} not found.`);
  const baseConf = splitConf(baseConfStr);
  const newContents = Object.assign({}, baseConf, credentials);
  // mergeWrite(filePath, newContents);

  return newContents;
});

ipcMain.handle('getBridgeConf', (e, bridgeConf) => {
  try {
    const xbridgeConfs = storage.getItem('xbridgeConfs') || {};
    let contents = xbridgeConfs[bridgeConf];
    if(!contents) {
      const filePath = path.join(configurationFilesDirectory, 'xbridge-confs', bridgeConf);
      contents = fs.readFileSync(filePath, 'utf8');
    }
    return contents;
  } catch(error) {
    dialog.showErrorBox('Oops! There was an error.', error?.message + '\n' + `There was a problem opening ${bridgeConf}`);
    return '';
  }
});

ipcMain.handle('checkWalletDirectories', (e, wallets: Wallet[]) => {
  wallets.forEach(wallet => {
    console.log('checkWalletDirectories wallets: ', wallets);
    
    try {
      fs.statSync(wallet.directory);
      wallet.error = false;
    } catch (error) {
      wallet.directory = '';
      wallet.error = true;
    }
  })

  return wallets;
});

const getDefaultCCDirectory = () => {
  if (platform !== 'linux') {
    return path.join(appDataPath, 'CloudChains');
  } else {
    return path.join(homePath, 'CloudChains');
  }
};

ipcMain.handle('checkAndGetLiteWalletDirectory', (e, directory) => {
  let tempDirectory = directory;
  if (!directory) {
    tempDirectory = getDefaultCCDirectory();
  }

  if (fs.existsSync(tempDirectory) && fs.existsSync(path.join(tempDirectory, 'settings'))) {
    return tempDirectory;
  } else {
    return '';
  }
});

ipcMain.handle('getLiteWallets', (e, data) => {
  const { directory, wallets = [] } = data;
  const settingsDir = path.join(directory, 'settings');
  const configFilePatt = /^config-(.+)\.json$/i;
  const litewallets = fs.readdirSync(settingsDir)
    .filter((f: string) => configFilePatt.test(f))
    .map((f: string) => {
      const filePath = path.join(settingsDir, f);
      try {
        const data = fs.readJsonSync(filePath);
        const matches = f.match(configFilePatt);
        const abbr = matches[1];
        const wallet: Wallet = wallets.find((w: Wallet) => w.abbr === abbr);
        if (!wallet) return null;
        return Object.assign({}, data, {
          abbr,
          name: wallet.name,
          wallet,
          filePath
        })
      } catch (error) {
        console.log('error: ', error);
        
        return null;
      }
    })
    .filter((data: any) => data)
  return litewallets;
})

ipcMain.handle('saveLiteWallets', (e, data: SaveLiteWalletsDataType) => {
  const { litewallets, wallets, litewalletConfigDirectory } = data || {};
  for (const litewallet of litewallets) {
    const { filePath, wallet } = litewallet;
    const config = fs.readJsonSync(filePath);
    const rpcPort = config.rpcPort || litewallet.rpcPort;
    let rpcUsername = config.rpcUsername || litewallet.rpcUsername;
    let rpcPassword = config.rpcPassword || litewallet.rpcPassword;
    if (!rpcUsername || !rpcPassword) {
      const { username, password } = wallet.generateCredentials();
      rpcUsername = username;
      rpcPassword = password;
    }
    litewallet.rpcPassword = rpcPassword;
    litewallet.rpcUsername = rpcUsername;
    litewallet.rpcPort = rpcPort;

    const newConfig = Object.assign({}, config, {
      rpcUsername,
      rpcPassword,
      rpcEnabled: true,
      rpcPort
    });
    fs.writeJsonSync(filePath, newConfig)
  }
  const preppedWallets = litewallets.map(w => w.wallet.set({
    username: w.rpcUsername,
    password: w.rpcPassword,
    port: w.rpcPort
  }));
  const block = wallets.find(w => w.abbr === 'BLOCK');
  putConfs(preppedWallets, block.directory);
  storage.setItem('litewalletConfigDirectory', litewalletConfigDirectory);
  let ccUpdated;
  try {
    const ccConfig = fs.readJsonSync(path.join(litewalletConfigDirectory, 'settings', 'config-master.json'));
    if (ccConfig.rpcPort && ccConfig.rpcUsername && ccConfig.rpcPassword) {
      const walletErrors = [];
      const allReqs = [];
      let walletCount = 0;
      for (const { abbr } of litewallets) {
        walletCount++;
        // allReqs.push({token: abbr, req: request
        //   .post(`http://127.0.0.1:${ccConfig.rpcPort}`)
        //   .timeout(5000)
        //   .auth(ccConfig.rpcUsername, ccConfig.rpcPassword)
        //   .send(JSON.stringify({
        //     method: 'reloadconfig',
        //     params: [
        //       abbr
        //     ]
        //   }))});
      }
    }
  } catch (error) {
    ccUpdated = false;
  }
});

function getBridgeConf(bridgeConf: string) {
  try {
    const xbridgeConfs = storage.getItem('xbridgeConfs') || {};
    let contents = xbridgeConfs[bridgeConf]
    if (!contents) {
      const filePath = path.join(configurationFilesDirectory, 'xbridge-confs', bridgeConf);
      contents = fs.readFileSync(filePath, 'utf8');
    }

    return contents;
  } catch (error) {
    console.log('getBridgeConf error: ', error);
    return '';
  }
}

function putConfs(wallets: Wallet[], blockDir: string) {
  const data = new Map();
  for (const wallet of wallets) {
    const { abbr, xBridgeConf, username, password } = wallet;
    const confStr = getBridgeConf(xBridgeConf);
    if (!confStr) throw new Error(`${xBridgeConf} not found`);
    const conf: any = splitConf(confStr);
    data.set(abbr, Object.assign({}, conf, {
      Username: username,
      Password: password,
      Port: wallet.port || conf?.port,
      Address: ''
    }))
  }
  const confPath = path.join(blockDir, 'xbridge.conf');
  const bridgeConf = fs.readFileSync(confPath, 'utf8');
  let split = bridgeConf.replace(/\r/g, '').split(/\n/) || [];
  const walletsIdx = split.findIndex((s: any) => /^ExchangeWallets\s*=/.test(s));
  const walletsRaw = split[walletsIdx].match(/=(.*)$/);
  const walletList = !walletsRaw || walletsRaw.length <= 1 ? [] : walletsRaw[1].split(',').map((str: any) => str.trim());

  const newWalletList = _.compact([...walletList, ...(wallets.map(w => w.abbr))]);
  split[walletsIdx] = `ExchangeWallets=${[...newWalletList.values()].join(',')}`;
  for (const [abbr, walletData] of [...data.entries()]) {
    const startIndex = split.findIndex((s: any) => s.trim() === `[${abbr}]`);
    const alreadyInConf = startIndex > -1;
    let endIndex;
    if (alreadyInConf) {
      for (let i = startIndex + 1; i< split.length; i++) {
        const s = split[i].trim();
        if (!s) {
          endIndex = i-1;
          break;
        } else if (/^\[.+]$/.test(s)) {
          endIndex = i - 1;
          break;
        } else if (i === split.length - 1) {
          endIndex = i;
        }
      }
      split = [
        ...split.slice(0, startIndex + 1),
        joinConf(walletData),
        ...split.slice(endIndex + 1)
      ];
    } else {
      split = [
        ...split,
        `[${abbr}]`,
        joinConf(walletData)
      ];
    }
  }
  const joined = split.join('\n');
  fs.writeFileSync(confPath, joined, 'utf8');
  putBlockConf(blockDir);
}

const putBlockConf = (blockDir: string, rpcWorkQueueMinimum=128, rpcXBridgeTimeout=15) => {
  const blockConf = path.join(blockDir, 'blocknet.conf');
  let data = fs.readFileSync(blockConf, 'utf8');
  let split = data
    .replace(/\r/g, '')
    .split(/\n/);
  const rpcQueueIdx = split.findIndex((s: any) => /^rpcworkqueue\s*=/.test(s));
  if (rpcQueueIdx >= 0) {
    const rpcWQ = split[rpcQueueIdx].match(/=\s*(.*)$/);
    if (!rpcWQ || rpcWQ.length <= 1)
      split[rpcQueueIdx] = `rpcworkqueue=${rpcWorkQueueMinimum}`;
    else { // if entry already has value
      const n = parseInt(rpcWQ[1].trim(), 10);
      if (isNaN(n) || n < rpcWorkQueueMinimum)
        split[rpcQueueIdx] = `rpcworkqueue=${rpcWorkQueueMinimum}`;
      else
        split[rpcQueueIdx] = 'rpcworkqueue=' + n;
    }
  } else {
    // add to front to avoid [test] sections
    split.splice(0, 0, `rpcworkqueue=${rpcWorkQueueMinimum}`);
  }
  const xbridgeTimeoutIdx = split.findIndex((s: any) => /^rpcxbridgetimeout\s*=/.test(s));
  if (xbridgeTimeoutIdx >= 0) {
    const rpcWQ = split[xbridgeTimeoutIdx].match(/=\s*(.*)$/);
    if (!rpcWQ || rpcWQ.length <= 1)
      split[xbridgeTimeoutIdx] = `rpcxbridgetimeout=${rpcXBridgeTimeout}`;
  } else {
    // add to front to avoid [test] sections
    split.splice(0, 0, `rpcxbridgetimeout=${rpcXBridgeTimeout}`);
  }

  // Serialize
  data = split.join('\n');
  fs.writeFileSync(blockConf, data, 'utf8');
};



ipcMain.handle('getDefaultLiteWalletConfigDirectory', () => {
  return getDefaultCCDirectory();
});

ipcMain.handle('saveDXData', (e, dxUser, dxPassword, dxPort, dxIP) => {
  storage.setItems({
    user: dxUser,
    password: dxPassword,
    port: dxPort,
    blocknetIP: dxIP
  }, true);
});

ipcMain.handle('restart', () => {
  // app.relaunch();
  app.exit();
});

ipcMain.handle('getLitewalletConfigDirectory', () => {
  let litewalletConfigDirectory = storage.getItem('litewalletConfigDirectory') || getDefaultCCDirectory();
  if (!fs.existsSync(litewalletConfigDirectory)) {
    litewalletConfigDirectory = '';
  }
  return litewalletConfigDirectory;
});

ipcMain.handle('saveLitewalletConfigDirectory', (litewalletConfigDirectory) => {
  storage.setItem('litewalletConfigDirectory', litewalletConfigDirectory);
});

function splitConf(str: string) {
  return str
  .split('\n')
  .map(s => s.trim())
  .filter(l => l ? true : false)
  .map(l => l.split('=').map(s => s.trim()))
  .reduce((obj, [key, val = '']) => {
    if(key && val) return Object.assign({}, obj, {[key]: val});
    else return obj;
  }, {});
}

type CommonObjType = {
  [key: string]: string
}

const joinConf = (obj: CommonObjType) => {
  return Object
    .keys(obj)
    .map(key => key + '=' + (obj[key] || ''))
    .join('\n')
    .concat('\n');
};

function mergeWrite(filePath: string, obj: CommonObjType) {
  let fileExists;
  try {
    fs.statSync(filePath);
    fileExists = true;
  } catch(err) {
    fileExists = false;
  }
  if(!fileExists) {
    fs.writeFileSync(filePath, joinConf(obj), 'utf8');
    return;
  }
  const newKeys = Object.keys(obj);
  let usedKeys = new Set();
  const contents:any = fs.readFileSync(filePath, 'utf8').trim();
  const linePatt = /^(.+)=(.+)$/;
  const splitContents = contents
    .split('\n')
    .map((l: any) => l.trim())
    .map((l: any) => {
      if(!l) { // if it is an empty line
        return l;
      } else if(/^#/.test(l)) { // if it is a comment
        return l;
      } else if(linePatt.test(l)) { // if it is a [key]=[value] line
        const matches = l.match(linePatt);
        const key = matches[1].trim();
        const value = matches[2].trim();
        if(newKeys.includes(key) && usedKeys.has(key)) {
          return '';
        } else if(newKeys.includes(key) && !usedKeys.has(key)) {
          usedKeys = usedKeys.add(key);
          return `${key}=${obj[key]}`;
        } else {
          return `${key}=${value}`;
        }
      } else { // if it is a bad line
        return '';
      }
    });
  for(const key of newKeys) {
    if(usedKeys.has(key)) continue;
    splitContents.push(`${key}=${obj[key]}`);
  }
  const newContents = splitContents
    .join('\n')
    .replace(/[\n\r]{3,}/g, '\n\n')
    .trim();
  fs.writeFileSync(filePath, newContents, 'utf8');
}

function getBaseConf(walletConf: string) {
  try {
    const walletConfs = storage.getItem('walletConfs') || {};
    let contents = walletConfs[walletConf];
    if (!contents) {
      const filePath = path.join(configurationFilesDirectory, 'wallet-confs', walletConf);
      contents = fs.readFileSync(filePath, 'utf8');
    }
    return contents;
  } catch (error) {
    dialog.showErrorBox('Oops! There was an error.', error?.message + '\n' + `There was a problem opening ${walletConf}`);
    return '';
  }
}

function fileExists(path: string):boolean {
  try {
    fs.statSync(path);
    return true;
  } catch (error) {
    return false;
  }
}

(async function () {
  try {
    console.log('main entry');
    

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

    await onReady;

    openConfigurationWindow({ isFirstRun: true});

    // openAppWindow();
  } catch (error) {
    console.log('error: ', error);
    
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


