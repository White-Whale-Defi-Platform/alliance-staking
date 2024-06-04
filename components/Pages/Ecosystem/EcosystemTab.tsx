import { HStack, Text, VStack } from '@chakra-ui/react'
import CustomButton from 'components/CustomButton'
import AssetOverview, { TokenType } from 'components/Pages/AssetOverview'
import CardComponent, { AssetType } from 'components/Pages/CardComponent'
import { useCalculateAprs } from 'components/Pages/Ecosystem/hooks/useCalculateAprs';
import RewardsComponent from 'components/Pages/RewardsComponent'
import { useRouter } from 'next/router'

export const EcosystemTab = ({
  isWalletConnected,
  isLoading,
  address,
  updatedData,
}) => {
  const router = useRouter()
  const openDelegate = async () => await router.push('/restaking/delegate?tokenSymbol=mUSDC')
  const openUndelegate = async () => await router.push('/restaking/undelegate?tokenSymbol=mUSDC')
  const aprs = useCalculateAprs()
  return <VStack
    pt={12}
    maxW={1270}
    alignItems={'flex-start'}
    spacing={6}>
    <HStack width={'full'} justifyContent={'space-between'}>
      <Text as="h1"
        fontSize="37"
        fontWeight="700">
                ReStaking
      </Text>
      <HStack pr={2}>
        <CustomButton isTransparent={true}
          onClick={() => openDelegate()}
          buttonLabel={'Delegate'}
          disabled={!isWalletConnected}
          height={'42px'}
          width={'198px'}/>
        <CustomButton isTransparent={true}
          onClick={() => openUndelegate()}
          disabled={!isWalletConnected}
          buttonLabel={'Undelegate'}
          height={'42px'}
          width={'198px'}/>
      </HStack>
    </HStack>
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
    </HStack>
    <HStack width="full" spacing={10}>
      <AssetOverview
        isLoading={isLoading}
        data={updatedData && updatedData?.delegated}
        isWalletConnected={isWalletConnected}
        aprs={aprs}
      />
      <RewardsComponent
        isWalletConnected={isWalletConnected}
        isLoading={isLoading}
        data={updatedData && updatedData[TokenType[TokenType.rewards]]}
        address={address}
      />
    </HStack>
  </VStack>
}
