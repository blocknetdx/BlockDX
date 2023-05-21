import { useContext, useEffect, useState, version } from 'react';
import {
    ConfigurationMenuProps, CONFIG_ROUTE, ConfigurationMenuOptionsType
} from './configuration.type';
import { Text, Button, SvgIcon, Select } from '@components/index';
import Wallet from '@/configuration/modules/wallet';
import { ConfigDataContext } from '@/context';

export default function AddWalletQuick({
    setTitle,
    handleNavigation,
    state,
}: ConfigurationMenuProps) {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [selectedWalletIds, setSelectedWalletIds] = useState<string[]>([]);
    const { configMode } = useContext(ConfigDataContext);

    const isWalletSelected = selectedWalletIds.length > 0;
    const isAllWalletSelected = isWalletSelected && (selectedWalletIds.length === wallets.length);

    useEffect(() => {
        if (!!window) {
            getFilteredWallets();
        }
    }, []);

    async function getFilteredWallets() {
        const { wallets = [] } = state;

        const filteredWallets = await window?.api?.getFilteredWallets(wallets);

        console.log('filteredWallets: ', filteredWallets);
        setWallets(filteredWallets);
    }

    function selectAll() {
        setSelectedWalletIds(isAllWalletSelected ? [] : wallets.reduce((selectedWallets, wallet) => {
            return [...selectedWallets, wallet.versionId];
        }, []))
    }

    function selectOneWallet(versionId: string) {
        setSelectedWalletIds(selectedWalletIds.includes(versionId) ? selectedWalletIds.filter(item => item !== versionId) : [...selectedWalletIds, versionId])
    }


    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='p-h-20'>
                <Text>Please select the wallet version installed for each of the following assets. DO NOT use any wallet versions not listed here. They have either not been tested yet or are not compatible.</Text>
            </div>
            {
                wallets.length > 0 ?
                <div className={`d-flex align-items-center p-h-20 m-v-10 ${isWalletSelected ? 'justify-content-end': 'justify-content-between'}`}>
                    {
                        isWalletSelected ? <></> :
                        <Text className='text-error'>Please select at least one wallet to continue.</Text>
                    }
                    <div className='d-flex align-items-center'>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            name="walletCheckbox"
                            value='selectAll'
                            checked={isAllWalletSelected}
                            onChange={() => {
                                selectAll();
                            }}
                        />
                        <Text className="configuration-setup-label" >{configMode}</Text>
                    </div>
                </div> : null
            }
            <div className='m-h-20 flex-grow-1 wallets-list-container p-20'>
                {
                    wallets.length === 0 ? 
                    <Text>Unable to automatically detect installed wallets that haven\'t been configured already. If you haven\'t already installed the wallet you would like to connect, please do that first. If you are using a custom data directory you will need to go BACK and select Expert Setup. If you would like to configure a wallet you already have configured you will need to go BACK and select Update Wallet.','configurationWindowWalletVersions</Text>
                    :
                    wallets.map(({name, versions, versionId}) => (
                        <div key={`add-wallet-${name}`} className='wallet-versions-container p-20'>
                            <div className='d-flex justify-content-between align-items-center m-v-10'>
                                <Text>{name}</Text>
                                <div className='d-flex align-items-center'>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="walletCheckbox"
                                        value='selectAll'
                                        checked={selectedWalletIds.includes(versionId)}
                                        onChange={() => {
                                            selectOneWallet(versionId)
                                        }}
                                    />
                                    <Text className="configuration-setup-label" >Add Wallet</Text>
                                </div>
                            </div>
                            <div className='wallet-version-select-container'>
                                <Text className='flex-grow-1 m-l-10'>Wallet Version</Text>
                                <Select
                                    className='wallet-version'
                                    optionClassName='order-tab-option-text'
                                    lists={versions}
                                />
                            </div>
                        </div>
                    ))
                }
            </div>
            <SvgIcon
                containerClass='m-h-20 m-v-10'
                classProp='m-l-10'
                content="Don't see a wallet in the list?"
                rightIcon='help'
                rightIconCategory='sideBar'
                contentClass='m-r-10'
            />
            <div className='d-flex flex-row justify-content-between m-v-20'>
                <Button
                    className='configuration-cancel-btn'
                    onClick={() => {
                        setTitle(CONFIG_ROUTE.SET_UP);
                        handleNavigation(CONFIG_ROUTE.SET_UP)
                    }}
                >
                    CANCEL
                </Button>
                <Button
                    className='configuration-continue-btn'
                    onClick={() => handleNavigation(CONFIG_ROUTE.ADD_WALLET_QUICK_FINISH)}
                >CONTINUE</Button>
            </div>
        </div>
    );
}