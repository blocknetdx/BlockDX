import { ManifestType } from "@/main.type";

const uuid = require('uuid');

export type SaveConfParamsType = {
  directory: string;
  conf: string;
  walletConf: string;
  credentials: {
    username: string;
    password: string;
  }
}

class Wallet {
    name: string;
    abbr: string;
    versionId: string;
    versionName: string;
    dirNameLinux: string;
    dirNameMac: string;
    dirNameWin: string;
    repoURL: string;
    versions: string[];
    xBridgeConf: string;
    walletConf: string;
    confName: string;
    error: boolean;
    username: string;
    password: string;
    port: string;
    version: string;
    directory: string;
    customDirectory?: string;
    defaultDirectory?: string;

  constructor(w?: ManifestType) {
    const { versions = [] } = w || {};
    this.name = w?.blockchain || '';
    this.abbr = w?.ticker || '';
    this.versionId = w?.ver_id || '';
    this.versionName = w?.ver_name || '';
    this.dirNameLinux = w?.dir_name_linux || '';
    this.dirNameMac = w?.dir_name_mac || '';
    this.dirNameWin = w?.dir_name_win || '';
    this.repoURL = w?.repo_url || '';
    this.versions = versions;
    this.xBridgeConf = w?.xbridge_conf || '';
    this.walletConf = w?.wallet_conf || '';
    this.confName = w?.conf_name || '';
    this.error = false;
    this.username = '';
    this.password = '';
    this.port = '';
    this.version = versions.length > 0 ? versions[versions.length - 1] : '';
    if (!!w) {
      this.setCustomDirectory();
    }
    this.setDefaultDirectory();
  }

  set(arg1: any, arg2?: any) {
    const wallet:any = Object.assign({}, this);
    if(typeof arg1 === 'string') {
      wallet[arg1] = arg2;
    } else if(typeof arg1 === 'object') {
      const keys = Object.keys(arg1);
      for(const key of keys) {
        wallet[key] = arg1[key];
      }
    } else {
      throw new Error('You must pass in either a string or an object as the first argument to the set() method.');
    }
    
    return Object.assign(new Wallet(), wallet);
  }

  generateCredentials() {
    const { name } = this;
    const username = 'BlockDX' + name.replace(/\s/g, '');
    const password = uuid.v4();
    return { username, password };
  }

  async setCustomDirectory() {
    this.directory = await this.getCustomDirectory();
    this.customDirectory = this.directory;
  }

  async setDefaultDirectory() {
    this.defaultDirectory = await this.getDefaultDirectory();
  }

  async getCustomDirectory() {
    const customDir = await window.api.getTokenPath(this.abbr);
    return await customDir ? customDir : await this.getDefaultDirectory();
  }

  async getDefaultDirectory() {
    const defaultDirectory: string = await window?.api.getDefaultDirectory({
        dirNameWin: this.dirNameWin,
        dirNameLinux: this.dirNameLinux,
        dirNameMc: this.dirNameMac
    });

    return defaultDirectory;
  }

  async saveWalletConf() {
    const conf = this.confName ? this.confName : this.walletConf.replace(/--.*$/, '') + '.conf';

    const newContents = await window.api?.saveWalletConf({
      directory: this.directory,
      conf,
      walletConf: this.walletConf,
      credentials: {
        username: this.username,
        password: this.password
      }
    })

    console.log('saveWalletConf newContents: ', newContents);
    

    return newContents;
  }
}

export default Wallet;

