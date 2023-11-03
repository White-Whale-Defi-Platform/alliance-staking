import React from 'react';

import { Box, Flex, HStack } from '@chakra-ui/react';

import Wallet from '../Wallet/Wallet';
import Logo from './Logo';
import {useChain} from "@cosmos-kit/react-lite";
import {MIGALOO_CHAIN_ID, MIGALOO_CHAIN_NAME} from "constants/common";

const Header = () => {
  const { disconnect, isWalletConnected } = useChain(MIGALOO_CHAIN_NAME)

  const resetWalletConnection = async() => {
    await disconnect()
  };

  return (
    <Box py={{ base: '4', md: '10' }} px={{ base: '4', md: '10' }}>
      <Flex
        justifyContent="space-between"
        mx="auto"
        maxWidth="container.xl"
        display={{ base: 'none', md: 'flex' }}
        alignItems="center"
      >
        <Box flex="1">
          <Logo />
        </Box>
        <HStack flex="1" spacing="6" justify="flex-end">
          <Wallet
            connected={isWalletConnected}
            onDisconnect={resetWalletConnection}
          />
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
