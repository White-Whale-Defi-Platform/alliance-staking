import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  HStack, IconButton,
  Text, VStack,
} from '@chakra-ui/react';
import { useChain } from '@cosmos-kit/react-lite';
import AssetInput from 'components/AssetInput/index';
import CustomButton from 'components/CustomButton';
import { TokenBalance } from 'components/Pages/Alliance/Delegate';
import { ActionType } from 'components/Pages/Dashboard';
import { useGetLPTokenPrices } from 'hooks/useGetLPTokenPrices';
import usePrices from 'hooks/usePrices';
import { useQueryStakedBalances } from 'hooks/useQueryStakedBalances';
import useTransaction from 'hooks/useTransaction';
import { useRouter } from 'next/router';
import tokens from 'public/mainnet/white_listed_alliance_token_info.json';
import whiteListedEcosystemTokens from 'public/mainnet/white_listed_ecosystem_token_info.json'
import { useRecoilState, useRecoilValue } from 'recoil';
import { chainState } from 'state/chainState';
import { delegationState, DelegationState } from 'state/delegationState';
import { tabState, TabType } from 'state/tabState';
import { TxStep } from 'types/blockchain';

export const Undelegate = ({ tokenSymbol }) => {
  const [currentDelegationState, setCurrentDelegationState] =
        useRecoilState<DelegationState>(delegationState)
  const { walletChainName } = useRecoilValue(chainState)
  const { isWalletConnected, openView } = useChain(walletChainName)
  const router = useRouter()
  const { control } = useForm({
    mode: 'onChange',
    defaultValues: {
      currentDelegationState,
    },
  })
  const { submit, txStep } = useTransaction()

  const tabFromUrl = router.pathname.split('/')?.[1].split('/')?.[0]
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  const [_, setTabType] = useRecoilState(tabState)

  const whiteListedTokens = useMemo(() => {
    if (tabFromUrl === TabType.ecosystem) {
      return whiteListedEcosystemTokens
    }
    return null
  }, [tabFromUrl])

  useEffect(() => {
    if (tabFromUrl === TabType.ecosystem) {
      setTabType(TabType.ecosystem)
    }
  }, [tabFromUrl])

  const { data: stakedInfos } = useQueryStakedBalances()

  const currentTokenBalance: TokenBalance = useMemo(() => stakedInfos?.map((info) => ({
    tokenSymbol: info?.tokenSymbol,
    balance: info?.amount,
  }))?.find((e) => e.tokenSymbol === currentDelegationState.tokenSymbol), [stakedInfos, currentDelegationState.tokenSymbol])

  const [priceList] = usePrices() || []
  const lpTokenPrices = useGetLPTokenPrices()

  const price = useMemo(() => (currentDelegationState.tokenSymbol === 'mUSDC' ? 1 : currentDelegationState.tokenSymbol?.includes('-LP') ? lpTokenPrices?.[currentDelegationState.tokenSymbol] :
    priceList?.[
      tokens?.find((e) => e.symbol === currentDelegationState.tokenSymbol)?.
        name
    ]),
  [priceList, currentDelegationState.tokenSymbol, lpTokenPrices])

  useEffect(() => {
    if (tokenSymbol) {
      const token = whiteListedTokens.find((e) => e.symbol === tokenSymbol)
      if (!token) {
        return
      }
      setCurrentDelegationState({
        ...currentDelegationState,
        tokenSymbol: token.symbol,
        decimals: 6,
        denom: token?.denom,
      })
    } else {
      const token = whiteListedTokens.find((e) => e.symbol === currentDelegationState.tokenSymbol) || whiteListedTokens?.[0]
      setCurrentDelegationState({
        ...currentDelegationState,
        tokenSymbol: token?.symbol,
        decimals: 6,
        denom: token?.denom,
      })
    }
  }, [tokenSymbol]);

  return (
    <VStack
      width={{ base: '100%',
        md: '650px' }}
      alignItems="flex-start"
      top={200}
      position="absolute">
      <HStack width={'full'} justifyContent={'space-between'}>
        <IconButton
          variant="unstyled"
          color="white"
          fontSize="28px"
          aria-label="go back"
          icon={<ArrowBackIcon/>}
          onClick={async () => {
            await router.push('/');
            setCurrentDelegationState({
              ...currentDelegationState,
              amount: 0,
            });
          }}
        />
        <Text
          as="h2"
          fontSize="24"
          fontWeight="900"
          style={{ textTransform: 'capitalize' }}
        >
                    Undelegate
        </Text>
      </HStack>
      <VStack
        width="full"
        backgroundColor="rgba(0, 0, 0, 0.5)"
        borderRadius={'30px'}
        alignItems="flex-start"
        verticalAlign="flex-start"
        top={50}
        maxH={660}
        gap={4}
        as="form"
        position="absolute"
        p={7}
        left="50%"
        transform="translateX(-50%)"
        display="flex">
        <Controller
          name="currentDelegationState"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <AssetInput
              hideToken={currentDelegationState.tokenSymbol}
              hideLogo={currentDelegationState.tokenSymbol?.includes('-LP')}
              {...field}
              token={currentDelegationState}
              tokenPrice={price}
              balance={currentTokenBalance?.balance}
              minMax={false}
              disabled={false}
              onChange={(value, isTokenChange) => {
                field.onChange(value);
                if (isTokenChange) {
                  const { denom } = whiteListedTokens.find((t) => t.symbol === value.tokenSymbol);
                  setCurrentDelegationState({
                    ...currentDelegationState,
                    tokenSymbol: value.tokenSymbol,
                    amount: value.amount === '' ? 0 : Number(value.amount),
                    denom,
                  })
                } else {
                  setCurrentDelegationState({
                    ...currentDelegationState,
                    amount: value.amount === '' ? 0 : value.amount,
                  })
                }
              }}
            />
          )}
        />
        <CustomButton
          buttonLabel={'Undelegate'}
          onClick={async () => {
            if (isWalletConnected) {
              await submit(
                ActionType.undelegate,
                currentDelegationState.amount,
                currentDelegationState.denom,
              )
            } else {
              openView()
            }
          }}
          disabled={
            txStep === TxStep.Estimating ||
                        txStep === TxStep.Posting ||
                        txStep === TxStep.Broadcasting ||
                        (currentDelegationState.amount <= 0 && isWalletConnected)
          }
          loading={
            txStep === TxStep.Estimating ||
                        txStep === TxStep.Posting ||
                        txStep === TxStep.Broadcasting
          }
          height="42px"
          width="600px"
        />
      </VStack>
    </VStack>
  )
}

