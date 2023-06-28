import { useContext, useEffect, useState } from 'react';
import {
    ConfigurationMenuProps, CONFIG_ROUTE
} from '../configuration.type';
import { Text, Button, CheckBox } from '@component'
import { ConfigDataContext } from '@/context';
import { DataPathsType, SubRouteType } from '@/configuration/add-wallet-expert';
import { SidePanel } from '@/configuration/side-panel';
import Wallet from '@/configuration/modules/wallet';
import SelectVersions from './select-versions';
import SelectDirectories from './select-directories';
import ExpertSelectSetUpType from '@/configuration/expert-setup/expert-select-setup-type';
import EnterWalletCredentials from '@/configuration/expert-setup/enter-wallet-credentials';

interface SelectWalletsProps {
    selectWallet?: (versionId: string) => void
    selectAll?: (wallets: string[]) => void
}

type Props = SelectWalletsProps & ConfigurationMenuProps;

export enum EXPERT_ROUTE {
    SELECT_WALLETS = 'selectWallets',
    SELECT_VERSION = 'selectVersion',
    SELECT_DIRECTORIES = 'selectDirectories',
    SELECT_SETUP_TYPE = 'selectSetupType',
    ENTER_CREDENTIALS = 'enterWalletCredentials'
}

export default function ExpertSetup({
    setTitle,
    handleNavigation,
}: Props) {
    const { state, updateSingleState } = useContext(ConfigDataContext);
    const { wallets, skipSetup, configurationType, selectedAbbrs: selectedWalletAbbrs } = state;

    const [subRoute, setSubRoute] = useState<EXPERT_ROUTE>(EXPERT_ROUTE.SELECT_WALLETS);
    const [dataPaths, setDataPaths] = useState<DataPathsType>({});

    const addingWallets = configurationType === 'ADD_WALLET';
    const updatingWallets = configurationType === 'UPDATE_WALLET';

    const [selectedWallets, setSelectedWallets] = useState<Wallet[]>([]);
    const [selectedAbbrs, setSelectedAbbrs] = useState<string[]>([]);
    const [filteredWallets, setFilteredWallets] = useState<Wallet[]>([]);
    const [displayWalletList, setDisplayWalletList] = useState<Wallet[]>([]);

    const isAllSelected = selectedAbbrs.length > 0 && displayWalletList.length === selectedAbbrs.length;

    useEffect(() => {
        setTitle(configurationType === 'FRESH_SETUP' ? 'fresh setup - expert configuration setup' : configurationType === 'ADD_WALLET' ? 'add wallet - expert configuration setup' : 'update wallet - expert configuration setup')
        initialFunction();
    }, []);

    const handleOpenDialog = async (abbr: string) => {
        // ipcRenderer.sendSync('openDialog');
        if (!!window) {
            const directoryPath = await window.api.openDialog();
            setDataPaths(pre => ({
                ...pre,
                [abbr]: directoryPath
            }));
        }
    };
    
    async function initialFunction() {
        const installedWallets: Wallet[] = await window?.api?.getFilteredWallets(wallets);
        const selectedWalletIds = await window?.api.getSelectedWallets();
        console.log('installedWallets: ', installedWallets);

        setDisplayWalletList(wallets.filter(w => addingWallets ? !selectedWalletAbbrs.includes(w.abbr) : updatingWallets ? selectedWalletAbbrs.includes(w.abbr) : true).reduce((arr, w) => {
            return arr.some(ww => ww.abbr === w.abbr) ? arr : [...arr, w]
        }, []))

        // setFilteredWallets([...wallets].filter(w => addingWallets ? ))
        setSelectedAbbrs(updatingWallets ? [] : installedWallets.reduce((arr: string[], w) => {
            return  w.abbr === 'LTC' ? arr : [...arr, w.abbr]
        }, []))
    }

    function handleSelectWallet(abbr: string) {
        if (abbr === 'BLOCK') return;
        setSelectedAbbrs(selectedAbbrs.includes(abbr) ? selectedAbbrs.filter(item => item !== abbr) : [...selectedAbbrs, abbr]);
    }

    function handleSelectAll() {
        setSelectedAbbrs(!isAllSelected ? displayWalletList.map(w => w.abbr) : configurationType === 'FRESH_SETUP' ? ['BLOCK'] : []);
    }

    const showSkip = configurationType === 'FRESH_SETUP';

    function handleSubNavigation(route: EXPERT_ROUTE) {
        setSubRoute(route);
    }

    function renderContent() {
        switch (subRoute) {
            case EXPERT_ROUTE.SELECT_WALLETS:
                return (
                    <div className='d-flex flex-column flex-grow-1'>
                        <div className='p-h-20'>
                            <Text>In order to conduct peer-to-peer trades, Block DX requires the  Blocknet wallet and the wallets of any assets you want to trade with. Select the wallets that are installed to begin setup.</Text>
                        </div>
                        <div className='d-flex justify-content-end align-items-center p-h-20 m-v-10'>
                            <CheckBox
                                className="form-check-input"
                                name="walletCheckbox"
                                checked={ isAllSelected }
                                onPress={() => {
                                    if (skipSetup) return;
                                    handleSelectAll();
                                }}
                                label="Select All"
                                labelClass='configuration-setup-label'
                            />
                        </div>
                        <div className={`m-h-20 flex-grow-1 wallets-list-container ${showSkip ? 'max-h-210' : ''} ${skipSetup ? 'opacity-25' : ''}`}>
                            {
                                displayWalletList.map((wallet, index) => (
                                    <CheckBox
                                        key={`exper-wallet-setup-${wallet.abbr}-${index}`}
                                        className="form-check-input"
                                        containerClass='form-check m-v-20 d-flex align-items-center'
                                        name="walletCheckbox"
                                        value={wallet.versionId}
                                        checked={selectedAbbrs.includes(wallet.abbr) || false}
                                        onPress={() => {
                                            if (wallet.abbr === 'BLOCK' || skipSetup) return;
                                            handleSelectWallet(wallet.abbr);
                                        }}
                                        label={`${wallet.name} (${wallet.abbr})`}
                                        labelClass='configuration-setup-label'
                                    />
                                ))
                            }
                        </div>
                        {
                            !showSkip ? null :
                            <CheckBox
                                className="form-check-input"
                                containerClass='form-check m-v-20 d-flex align-items-center'
                                name="walletCheckbox"
                                checked={skipSetup || false}
                                onPress={() => {updateSingleState('skipSetup', !skipSetup)}}
                                label="Skip and setup Block DX manually (not recommended)"
                                labelClass='configuration-setup-label'
                            />
                        }
                        <div className='d-flex flex-row justify-content-between m-v-20'>
                            <Button
                                className='configuration-cancel-btn'
                                onClick={() => {
                                    handleNavigation(CONFIG_ROUTE.SELECT_SETUP_TYPE)
                                }}
                            >
                                BACK
                            </Button>
                            <Button 
                                className='configuration-continue-btn'
                                // disabled={selectedAbbrs.length === 0}
                                onClick={() => {
                                    setSelectedWallets(displayWalletList.filter(w => selectedAbbrs.includes(w.abbr)));
                                    handleSubNavigation(EXPERT_ROUTE.SELECT_VERSION);
                                }}
                            >FINISH</Button>
                        </div>
                    </div>
                );
            case EXPERT_ROUTE.SELECT_VERSION:
                return <SelectVersions selectedAbbrs={selectedAbbrs} filteredWallets={selectedWallets} handleSubNavigation={handleSubNavigation}  />
            case EXPERT_ROUTE.SELECT_DIRECTORIES:
                return (
                    <SelectDirectories
                        handleOpenDialog={handleOpenDialog}
                        filteredWallets={selectedWallets}
                        handleSubNavigation={handleSubNavigation}
                    />
                )
            case EXPERT_ROUTE.SELECT_SETUP_TYPE:
                return (
                    <ExpertSelectSetUpType 
                        handleSubNavigation={handleSubNavigation}
                        handleNavigation={handleNavigation}
                    />
                );
            case EXPERT_ROUTE.ENTER_CREDENTIALS:
                return (
                    <EnterWalletCredentials 
                        handleSubNavigation={handleSubNavigation}
                        selectedAbbrs={selectedAbbrs}
                        handleNavigation={handleNavigation}
                    />
                );
            default:
                return null;
        }
    }

    const sidePanelStatus = subRoute !== EXPERT_ROUTE.SELECT_SETUP_TYPE ? 0 : 1;

    return (
        <div className='d-flex flex-row flex-grow-1'>
            <SidePanel status={sidePanelStatus} />
            { renderContent() }
        </div>
    );
}