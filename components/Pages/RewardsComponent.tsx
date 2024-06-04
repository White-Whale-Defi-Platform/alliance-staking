import { FC, useMemo } from 'react'

import { Box, Divider, Image, HStack, Text, VStack } from '@chakra-ui/react'
import { useChain } from '@cosmos-kit/react-lite'
import Loader from 'components/Loader'
import { Token } from 'components/Pages/AssetOverview'
import ClaimButton from 'components/Pages/ClaimButton'
import UpdateRewardsButton from 'components/Pages/UpdateRewardsButton';
import { MIGALOO_CHAIN_NAME } from 'constants/common'
import tokens from 'public/mainnet/tokens.json'
import { useRecoilValue } from 'recoil'
import { tabState, TabType } from 'state/tabState'

interface UndelegationsProps {
  isWalletConnected: boolean;
  isLoading: boolean;
  address: string;
  data: any;
}

const RewardsComponent: FC<UndelegationsProps> = ({
  isWalletConnected,
  isLoading,
  data,
}) => {
  const currentTabState = useRecoilValue(tabState)
  const { openView } = useChain(MIGALOO_CHAIN_NAME)

  const claimableRewards = useMemo(() => data?.reduce((acc, e) => acc + (Number(e?.dollarValue) ?? 0), 0),
    [data]) || 0

  const rewardDenoms = useMemo(() => data?.map((r: { stakedDenom: string }) => r.stakedDenom), [data])
  const showRewards = useMemo(() => (data?.length > 0 && isWalletConnected), [data, isWalletConnected])
  return (
    <VStack
      width="full"
      backgroundColor="rgba(0, 0, 0, 0.5)"
      alignItems="flex-start"
      justifyContent="center"
      px={7}
      pt={7}
      spacing={1}
      borderRadius={'20px'}
      minH={320}
      minW={500}
      as="form"
      overflow="hidden"
      position="relative"
      display="flex"
    >
      {isLoading ? (
        <HStack
          minW={100}
          minH={100}
          width="full"
          alignContent="center"
          justifyContent="center"
          alignItems="center"
        >
          <Loader />
        </HStack>
      ) : (
        <>
          <Text color={'grey'}>Rewards</Text>
          <HStack
            alignItems={'start'}
            justifyContent="space-between"
            width="100%"
            height="100%"
            paddingBottom={0}
          >
            <Text fontSize={27} fontWeight={'bold'} transform={'translateY(-3px)'}>
              {isWalletConnected
                ? `$${claimableRewards?.toFixed(2).toString()}`
                : '$0'}
            </Text>
            <HStack gap={1}>
              {(currentTabState !== TabType.alliance && isWalletConnected) &&
                <UpdateRewardsButton />}
              <ClaimButton
                isWalletConnected={isWalletConnected}
                onOpenModal={openView}
                totalRewards={claimableRewards}
                rewardDenoms={rewardDenoms}
              />
            </HStack>
          </HStack>
          <Box
            overflowY="scroll"
            minW={540}
            h={170}
            backgroundColor="#1C1C1C"
            alignSelf={'center'}
            px="4"
            borderRadius="10px"
            alignItems={'center'}
            display={showRewards ? null : 'flex'}
            justifyContent={showRewards ? null : 'center'}
            flexDirection={showRewards ? null : 'column'}>
            {showRewards ? data?.map((reward, index) => {
              const token = tokens.find((token) => token.symbol === reward.symbol)
              const source = tokens.find((token) => token.denom === reward?.stakedDenom)
              return (<Box key={index} marginY={3}>
                <HStack justifyContent="space-between" width="100%" pr={3}>
                  <HStack>
                    {source?.logoURI && <Image
                      src={source?.logoURI}
                      width={5}
                      height={5}
                      marginRight={0} />}
                    {token?.logoURI && <Image
                      src={token?.logoURI}
                      width={5}
                      height={5}
                      marginRight={2} />}
                    <Text>{reward.symbol}</Text>
                  </HStack>
                  <Text>
                    {`${reward.amount === 0 ? 0 : reward.amount?.toFixed(token.symbol === 'wBTC' ? 10 : token?.decimals || 6)}`}
                  </Text>
                </HStack>
                <HStack justifyContent="flex-end" pr={3}>
                  <Text
                    marginBottom={1}
                    fontSize={11}
                    color={'white'}
                  >{`≈$${reward.dollarValue?.toFixed(2).toString()}`}</Text>
                </HStack>
                {(index < (data?.length || 0) - 1) && <Divider />}
              </Box>
              )
            }) : <Text textAlign="center" marginTop="auto" marginBottom="auto"
              color={'rgba(255, 255, 255, 0.5)'}>No rewards yet...</Text>}
          </Box>
        </>
      )}
    </VStack>
  )
}

export default RewardsComponent
