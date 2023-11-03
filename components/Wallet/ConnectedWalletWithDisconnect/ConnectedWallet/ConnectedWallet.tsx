import React from 'react';

import { Button, HStack, useToast } from '@chakra-ui/react';
import TruncatedAddress from 'components/Wallet/ConnectedWalletWithDisconnect/ConnectedWallet/TruncatedAddress';
import {useChain} from "@cosmos-kit/react-lite";
import {MIGALOO_CHAIN_ID, MIGALOO_CHAIN_NAME} from "constants/common";
import {ConnectedWalletIcon} from "components/Wallet/ConnectedWalletWithDisconnect/ConnectedWallet/ConnectedWalletIcon";

export const ConnectedWallet = () => {
  const toast = useToast();
  const { address } = useChain(MIGALOO_CHAIN_NAME)
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(address);
      toast({
        title: 'Address copied to clipboard',
        status: 'success',
        duration: 1000,
        position: 'top-right',
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <HStack
      padding="0"
      as={Button}
      variant="unstyled"
      onClick={copyToClipboard}
      width="full"
    >
      <ConnectedWalletIcon/>
      <TruncatedAddress/>
    </HStack>
  );
}
