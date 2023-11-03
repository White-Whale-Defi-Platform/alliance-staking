import { FC, useEffect } from 'react'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryClientProvider } from 'react-query'
import { wallets as cosmoStationWallets } from '@cosmos-kit/cosmostation'
import { wallets as keplrWallets } from '@cosmos-kit/keplr'
import { wallets as leapWallets } from '@cosmos-kit/leap'
import { ChainProvider } from '@cosmos-kit/react-lite'
import { wallets as shellWallets } from '@cosmos-kit/shell'
import { wallets as stationWallets } from '@cosmos-kit/station'
import { ChakraProvider, CSSReset } from '@chakra-ui/react'
import {
  getChainOptions,
  StaticWalletProvider,
  WalletControllerChainOptions,
  WalletProvider,
} from '@terra-money/wallet-provider'
import AppLoading from '../components/AppLoading'
import AppLayout from '../components/Layout/AppLayout'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { RecoilRoot } from 'recoil'
import { queryClient } from 'services/queryClient'
import theme from '../theme'
import { chains, assets } from 'chain-registry'
import {signerOptions} from "constants/signerOptions";
import {endpointOptions} from "constants/endpointOptions";
import {WalletModal} from "components/Wallet/Modal/WalletModal";

const MyApp: FC<AppProps> = ({
  Component,
  pageProps,
  defaultNetwork,
  walletConnectChainIds,
}: AppProps & WalletControllerChainOptions) => {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => setMounted(true), [])

  const wallets = [
    ...keplrWallets,
    ...cosmoStationWallets,
    ...shellWallets,
    ...stationWallets,
    ...leapWallets,
  ]

  return typeof window !== 'undefined' ? (
    <WalletProvider
      defaultNetwork={defaultNetwork}
      walletConnectChainIds={walletConnectChainIds}
    >
      <>
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <RecoilRoot>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
              <ChainProvider
                  chains={chains} // Supported chains
                  assetLists={assets} // Supported asset lists
                  wallets={wallets} // Supported wallets
                  walletModal={WalletModal}
                  signerOptions={signerOptions}
                  endpointOptions={endpointOptions}
                  walletConnectOptions={{
                    signClient: {
                      projectId: 'a8510432ebb71e6948cfd6cde54b70f7',
                      relayUrl: 'wss://relay.walletconnect.org',
                      metadata: {
                        name: 'Migaloo Zone',
                        description: 'test',
                        url: 'https://app.migaloo.zone/',
                        icons: [
                          'https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/packages/docs/public/favicon-96x96.png',
                        ],
                      },
                    },
                  }}
              >
                <CSSReset />
                {!mounted ? (
                    <AppLoading />
                ) : (
                    <AppLayout>
                      <Component {...pageProps} />
                    </AppLayout>
                )}
              </ChainProvider>
            </ChakraProvider>
            <Toaster position="top-right" toastOptions={{ duration: 10000 }} />
          </QueryClientProvider>
        </RecoilRoot>
      </>
    </WalletProvider>
  ) : (
    <StaticWalletProvider defaultNetwork={defaultNetwork}>
      <>
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <RecoilRoot>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
              <CSSReset />
              {!mounted ? (
                <AppLoading />
              ) : (
                <AppLayout>
                  <Component {...pageProps} />
                </AppLayout>
              )}
            </ChakraProvider>
            <Toaster position="top-right" toastOptions={{ duration: 10000 }} />
          </QueryClientProvider>
        </RecoilRoot>
      </>
    </StaticWalletProvider>
  )
}

MyApp.getInitialProps = async () => {
  const chainOptions = await getChainOptions()
  return {
    ...chainOptions,
  }
}

export default MyApp
