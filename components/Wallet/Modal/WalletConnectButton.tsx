import { useCallback } from 'react'

import { Button, HStack, Text, useToast } from '@chakra-ui/react'
import { WalletType } from 'components/Wallet/Modal/WalletModal'
import KeplrWalletIcon from "components/icons/KeplrWalletIcon";
import {WalletConnectIcon} from "components/icons/WalletConnectIcon";
import {TerraStationWalletIcon} from "components/icons/TerraStationWalletIcon";
import CosmostationWalletIcon from "components/icons/CosmostationWalletIcon";
import {ShellWalletIcon} from "components/icons/ShellWalletIcon";
import LeapSnapIcon from "components/icons/LeapSnapIcon";
import {MIGALOO_CHAIN_ID} from "constants/common";

interface Props {
    onCloseModal: () => void
    walletType?: WalletType
    connect?: () => void
}

export const WalletConnectButton = ({ onCloseModal, connect, walletType }: Props) => {
    const toast = useToast()
    const getKeplrChains = async (chains: Array<string>) => {
        const response = await fetch('https://keplr-chain-registry.vercel.app/api/chains');
        const registry = await response.json();
        return Object.values(registry.chains).filter((elem : {chainId: string}) => chains.includes(elem.chainId));
    }
    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1)
    const handleChainActivationError = (chainName: string, toast) => {
        const capitalizedChainName = capitalizeFirstLetter(chainName);
        console.error(`${capitalizedChainName} not activated`);
        toast({
            title: `${capitalizedChainName} not activated`,
            description: `Please add ${capitalizedChainName} to your wallet.`,
            status: 'error',
            duration: 9000,
            position: 'top-right',
            isClosable: true,
        });
    }
    const setWallet = useCallback(async () => {
        let err = false
        if (walletType === WalletType.keplrExtension && window.keplr) {
            const connected = (await window.keplr?.getChainInfosWithoutEndpoints()).map((elem) => elem.chainId)
            const keplrChains: any[] = await getKeplrChains(['migaloo-1'])
            for (const chain of keplrChains) {
                if (!connected?.includes(chain.chainId)) {
                    // eslint-disable-next-line no-await-in-loop
                    await window.keplr.experimentalSuggestChain(chain)
                }
            }
        }
        if ((walletType === WalletType.terraExtension || walletType === WalletType.keplrExtension)) {
            const windowConnection = walletType === WalletType.terraExtension ? (window.station?.keplr) : (window?.keplr)
            try {
                await (windowConnection.getKey(MIGALOO_CHAIN_ID))
            } catch (e) {
                err = true
                console.error(`${MIGALOO_CHAIN_ID} not activated`)
                handleChainActivationError('migaloo', toast);
            }
        }
        if (!err) {
            connect()
        }
        onCloseModal()
    }, [onCloseModal, connect, walletType])

    const renderContent = () => {
        switch (walletType) {
            case WalletType.keplrExtension:
                return 'Keplr Wallet'
            case WalletType.keplrMobile:
                return 'Keplr Wallet'
            case WalletType.terraExtension:
                return 'Terra Station'
            case WalletType.cosmoStationExtension:
                return 'Cosmostation'
            case WalletType.cosmoStationMobile:
                return 'Cosmostation'
            case WalletType.shellExtension:
                return 'Shell Wallet'
            case WalletType.leapExtension:
                return 'Leap Wallet'
            case WalletType.leapMobile:
                return 'Leap Wallet'
            case WalletType.leapSnap:
                return 'Leap Metamask Snap'
            default:
                return null
        }
    }

    const renderIcon = () => {
        switch (walletType) {
            case WalletType.keplrExtension:
                return <KeplrWalletIcon />
            case WalletType.keplrMobile:
                return <WalletConnectIcon />
            case WalletType.terraExtension:
                return <TerraStationWalletIcon/>
            case WalletType.cosmoStationExtension:
                return <CosmostationWalletIcon />
            case WalletType.cosmoStationMobile:
                return <WalletConnectIcon />
            case WalletType.shellExtension:
                return <ShellWalletIcon/>
            case WalletType.leapExtension:
                return <LeapSnapIcon />
            case WalletType.leapMobile:
                return <WalletConnectIcon />
            case WalletType.leapSnap:
                return <LeapSnapIcon />
            default:
                return null
        }
    }

    return (
        <Button variant="wallet" onClick={() => setWallet()} colorScheme="black">
            <HStack justify="space-between" width="full">
                <Text>{renderContent()}</Text>
                {renderIcon()}
            </HStack>
        </Button>
    )
}

export default WalletConnectButton
