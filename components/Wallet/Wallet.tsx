import React, { useState, useEffect } from 'react'
import { Box, Button, Divider } from '@chakra-ui/react'
import { useConnectedWallet, useWallet } from '@terra-money/wallet-provider'
import Card from 'components/Card'
import WalletIcon from 'components/icons/WalletIcon'
import ChainSelectWithBalance from 'components/Wallet/ChainSelectWithBalance/ChainSelectWithBalance'
import ConnectedWalletWithDisconnect from 'components/Wallet/ConnectedWalletWithDisconnect/ConnectedWalletWithDisconnect'
import useConnectCosmostation from 'hooks/useConnectCosmostation'
import useConnectKeplr from 'hooks/useConnectKeplr'
import useConnectLeap from 'hooks/useConnectLeap'
import { useTerraStation } from 'hooks/useTerraStation'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { walletState } from 'state/atoms/walletAtoms'
import WalletModal from "components/Wallet/Modal/Modal";

const Wallet: any = ({ connected, onDisconnect, onOpenModal, isOpenModal ,onCloseModal}) => {
  const [isInitialized, setInitialized] = useState(false)
  const [currentWalletState, setCurrentWalletState] =
    useRecoilState(walletState)

  const router = useRouter()

  const connectedWallet = useConnectedWallet()

  const { connectKeplr } = useConnectKeplr()
  const { connectLeap } = useConnectLeap()
  const { connectCosmostation } = useConnectCosmostation()
  const { connectTerraAndCloseModal, filterForStation } = useTerraStation(
    () => {}
  )
  const { availableConnections} = useWallet()

  useEffect(() => {
    if (router.pathname === '/') return

    const defaultChainId =
      currentWalletState.network === 'mainnet' ? 'migaloo-1' : 'narwhal-1'

      setCurrentWalletState({
        ...currentWalletState,
        chainId: defaultChainId,
      })
    setInitialized(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isInitialized) return
    if (!currentWalletState.chainId) return

    if (currentWalletState.activeWallet === 'leap') {
      connectLeap()
    } else if (currentWalletState.activeWallet === 'keplr') {
      connectKeplr()
    } else if (currentWalletState.activeWallet === 'cosmostation') {
      connectCosmostation()
    } else if (currentWalletState.activeWallet === 'station') {
      const [{ type = null, identifier = null } = {}] =
        availableConnections.filter(filterForStation)
      if (type && identifier) connectTerraAndCloseModal(type, identifier)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWalletState.chainId, isInitialized, availableConnections])

  if (!connected && !connectedWallet) {
    return (
      <>
        <Button
          variant="outline"
          display="flex"
          gap="3"
          color="white"
          borderColor="whiteAlpha.400"
          borderRadius="full"
          onClick={onOpenModal}>
          <WalletIcon />
          Connect wallet
        </Button>
        <WalletModal
            isOpenModal={isOpenModal}
            onCloseModal={onCloseModal}
            chainId={currentWalletState.chainId}
        />
      </>
    )
  }

  return (
    <>
      <Card paddingY={[0, 1]} paddingX={[2, 6]} gap={4}>
        <ChainSelectWithBalance/>
        <Box display={{ base: 'none', md: 'block' }}>
          <Divider
            orientation="vertical"
            borderColor="rgba(255, 255, 255, 0.1);"
          />
        </Box>
        <ConnectedWalletWithDisconnect
          connected={connected}
          onDisconnect={onDisconnect}
        />
      </Card>
    </>
  )
}

export default Wallet
