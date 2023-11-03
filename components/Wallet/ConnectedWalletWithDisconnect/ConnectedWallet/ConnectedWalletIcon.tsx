import React from 'react'

import { useChain } from '@cosmos-kit/react-lite'
import { WalletType } from 'components/Wallet/Modal/WalletModal'
import {MIGALOO_CHAIN_ID, MIGALOO_CHAIN_NAME} from "constants/common";
import KeplrWalletIcon from "components/icons/KeplrWalletIcon";
import LeapWalletIcon from "components/icons/LeapWalletIcon";
import CosmostationWalletIcon from "components/icons/CosmostationWalletIcon";
import TerraExtensionIcon from "components/icons/TerraExtensionIcon";
import LeapSnapIcon from 'components/icons/LeapSnapIcon';

export const ConnectedWalletIcon = () => {
  const { wallet } = useChain(MIGALOO_CHAIN_NAME)
  switch (wallet?.name) {
    case WalletType.keplrExtension || WalletType.keplrMobile:
      return <KeplrWalletIcon />
    case WalletType.leapExtension || WalletType.leapMobile:
      return <LeapWalletIcon />
    case WalletType.cosmoStationExtension || WalletType.cosmoStationMobile:
      return <CosmostationWalletIcon />
    case WalletType.terraExtension:
      return <TerraExtensionIcon />
    case WalletType.leapSnap:
      return <LeapSnapIcon />
    default:
      return <></>
  }
}

