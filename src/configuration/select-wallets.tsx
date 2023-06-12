import { useContext, useEffect, useState } from 'react';
import {
    ConfigurationMenuProps, CONFIG_ROUTE
} from './configuration.type';
import { Text, Button, CheckBox } from '@component'
import { ConfigDataContext } from '@/context';
import { SubRouteType } from '@/configuration/add-wallet-expert';
import { SidePanel } from '@/configuration/side-panel';
import Wallet from '@/configuration/modules/wallet';

interface SelectWalletsProps {
    selectWallet?: (versionId: string) => void
    selectedWallets?: string[]
    selectAll?: (wallets: string[]) => void
    handleSubNavigation?: (route: SubRouteType) => void
}

type Props = SelectWalletsProps & ConfigurationMenuProps;

export default function SelectWallets({
    setTitle,
    handleNavigation,
    selectWallet,
    selectAll,
    handleSubNavigation,
}: Props) {
    const { state, updateSingleState } = useContext(ConfigDataContext);
    const { wallets, skipSetup, configurationType, selectedAbbrs: selectedWalletAbbrs } = state;
    const addingWallets = configurationType === 'ADD_WALLET';
    const updatingWallets = configurationType === 'UPDATE_WALLET';

    const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
    const [selectedAbbrs, setSelectedAbbrs] = useState<string[]>([]);
    const [filteredWallets, setFilteredWallets] = useState<Wallet[]>([]);

    // console.log('selectedAbbrs: ', selectedAbbrs);

    useEffect(() => {
        setTitle(configurationType === 'FRESH_SETUP' ? 'fresh setup - expert configuration setup' : configurationType === 'ADD_WALLET' ? 'add wallet - expert configuration setup' : 'update wallet - expert configuration setup')
        initialFunction();
    }, []);
    
    async function initialFunction() {
        const installedWallets: Wallet[] = await window?.api?.getFilteredWallets(wallets);
        console.log('installedWallets: ', installedWallets);

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
        // setSelectedWalletAbbrs(isAllWalletSelected ? [] : filteredWallets.map(wallet => wallet.abbr));
    }
    

    const items = wallets.filter(w => addingWallets ? !selectedAbbrs.includes(w.abbr) : updatingWallets ? selectedAbbrs.includes(w.abbr) : true)
    .reduce((arr: Wallet[], w) => {
        return arr.some(ww => ww.abbr === w.abbr) ? arr : [...arr, w];
    }, []);

    console.log('selected items: ', items);

    const showSkip = configurationType === 'FRESH_SETUP';

    return (
        <div className='d-flex flex-row flex-grow-1'>
            <SidePanel status={0} />
            <div className='d-flex flex-column flex-grow-1'>
                <div className='p-h-20'>
                    <Text>In order to conduct peer-to-peer trades, Block DX requires the  Blocknet wallet and the wallets of any assets you want to trade with. Select the wallets that are installed to begin setup.</Text>
                </div>
                <div className='d-flex justify-content-end align-items-center p-h-20 m-v-10'>
                    <CheckBox
                        className="form-check-input"
                        name="walletCheckbox"
                        // checked={selectedWallets.includes(wallet.versionId) || false}
                        onPress={() => {
                            selectAll(selectedWallets.length !== wallets.length ? wallets.reduce((selectedWallets, wallet) => {
                                return [...selectedWallets, wallet.versionId];
                            }, []) : [])
                        }}
                        label="Select All"
                        labelClass='configuration-setup-label'
                    />
                </div>
                <div className={`m-h-20 flex-grow-1 wallets-list-container ${showSkip ? 'max-h-210' : ''}`}>
                    {
                        wallets.map((wallet, index) => (
                            <CheckBox
                                className="form-check-input"
                                containerClass='form-check m-v-20 d-flex align-items-center'
                                name="walletCheckbox"
                                value={wallet.versionId}
                                checked={selectedAbbrs.includes(wallet.abbr) || false}
                                onPress={() => {
                                    if (wallet.abbr === 'BLOCK') return;
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
                            handleNavigation(CONFIG_ROUTE.ADD_WALLET)
                        }}
                    >
                        BACK
                    </Button>
                    <Button 
                        className='configuration-continue-btn'
                        disabled={selectedWallets.length === 0}
                        onClick={() => handleSubNavigation('selectVersion')}
                    >FINISH</Button>
                </div>
            </div>
        </div>
    );
}