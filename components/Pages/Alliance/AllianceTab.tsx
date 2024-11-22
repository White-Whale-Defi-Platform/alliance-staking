import React from 'react';

import { HStack, Text, VStack } from '@chakra-ui/react';
import Validators from 'components/Pages/Alliance/Validators';
import AssetOverview, { TokenType } from 'components/Pages/AssetOverview';
import CardComponent, { AssetType } from 'components/Pages/CardComponent';
import RewardsComponent from 'components/Pages/RewardsComponent';

export const AllianceTab = ({
  isWalletConnected,
  isLoading,
  address,
  updatedData,
  allianceAPRs,
}) => <VStack
  pt={12}
  maxW={1270}
  alignItems={'flex-start'}
  spacing={6}>
  <Text as="h1" fontSize="37" fontWeight="700" >
            Portfolio
  </Text>
  <HStack width="full" paddingY={5} spacing={10}>
    <CardComponent
      isWalletConnected={isWalletConnected}
      isLoading={isLoading}
      assetType={AssetType.total}
      title={'Total Assets'}
      tokenData={updatedData?.total}
    />
    <CardComponent
      isWalletConnected={isWalletConnected}
      isLoading={isLoading}
      title={'Liquid Assets'}
      tokenData={updatedData?.liquid}
    />
    <CardComponent
      isWalletConnected={isWalletConnected}
      isLoading={isLoading}
      title={'Staked Assets'}
      tokenData={updatedData?.delegated}
    />
    <CardComponent
      isWalletConnected={isWalletConnected}
      assetType={AssetType.undelegations}
      isLoading={isLoading}
      title={'Undelegations'}
      tokenData={updatedData?.undelegated}
    />
  </HStack>
  <HStack width="full" spacing={10}>
    <AssetOverview
      isLoading={isLoading}
      data={updatedData && updatedData?.delegated}
      isWalletConnected={isWalletConnected}
      aprs={allianceAPRs}
    />
    <RewardsComponent
      isWalletConnected={isWalletConnected}
      isLoading={isLoading}
      data={updatedData && updatedData[TokenType[TokenType.rewards]]}
      address={address}
    />
  </HStack>
  <Validators />
</VStack>
