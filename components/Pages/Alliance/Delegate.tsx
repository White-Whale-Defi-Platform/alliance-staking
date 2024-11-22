import React, { FC, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Text, VStack } from '@chakra-ui/react';
import { useChain } from '@cosmos-kit/react-lite';
import AssetInput from 'components/AssetInput/index';
import ValidatorInput from 'components/Pages/Alliance/ValidatorInput/ValidatorInput';
import { useGetLPTokenPrices } from 'hooks/useGetLPTokenPrices';
import usePrices from 'hooks/usePrices';
import useValidators from 'hooks/useValidators';
import { useRouter } from 'next/router';
import tokens from 'public/mainnet/tokens.json';
import { useRecoilState, useRecoilValue } from 'recoil';
import { chainState } from 'state/chainState';
import { delegationState, DelegationState } from 'state/delegationState';

export interface TokenBalance {
  tokenSymbol: string;
  balance: number;
}

export interface ActionProps {
  balance: TokenBalance[];
  validatorDestAddress: string;
  tokenSymbol: string;
}

const Delegate: FC<ActionProps> = ({
  balance,
  validatorDestAddress,
  tokenSymbol,
}) => {
  const [currentDelegationState, setCurrentDelegationState] =
    useRecoilState<DelegationState>(delegationState);

  const { data: { validators = [] } = {} } = useValidators()

  const chosenValidator = useMemo(() => validators.find((v) => v.operator_address === validatorDestAddress),
    [validatorDestAddress, validators]);

  const router = useRouter();

  useEffect(() => {
    const token = tokens.find((e) => e.symbol === tokenSymbol)
    setCurrentDelegationState({
      ...currentDelegationState,
      tokenSymbol: token.symbol,
      amount: 0,
      decimals: token.decimals,
      validatorSrcAddress: null,
      validatorDestAddress,
      validatorDestName: chosenValidator?.description.moniker,
      denom: token.denom,
    })
  }, [chosenValidator])

  const { control } = useForm({
    mode: 'onChange',
    defaultValues: {
      currentDelegationState,
    },
  });
  const currentTokenBalance: TokenBalance = balance?.find((e) => e.tokenSymbol === currentDelegationState.tokenSymbol)
  const [priceList] = usePrices() || [];
  const lpTokenPrices = useGetLPTokenPrices()

  const price = useMemo(() => (currentDelegationState.tokenSymbol === 'mUSDC' ? 1 : (currentDelegationState.tokenSymbol?.includes('-LP')) ? lpTokenPrices?.[currentDelegationState.tokenSymbol] :
    priceList?.[
      tokens?.find((e) => e.symbol === currentDelegationState.tokenSymbol)?.
        name
    ]),
  [priceList, currentDelegationState.tokenSymbol, lpTokenPrices]);
  return (
    <VStack px={7} width="full" alignItems="flex-start" marginBottom={5}>
      <Text>To</Text>
      <Controller
        name="currentDelegationState"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <ValidatorInput
            delegatedOnly={false}
            validatorName={currentDelegationState.validatorDestName}
            validatorList={validators}
            onChange={async (validator) => {
              field.onChange(validator)
              setCurrentDelegationState({
                ...currentDelegationState,
                validatorDestAddress: validator.operator_address,
                validatorDestName: validator.description.moniker,
              });
              await router.push({
                pathname: '/alliance/delegate',
                query: {
                  validatorDestAddress: validator.operator_address,
                  tokenSymbol: currentDelegationState.tokenSymbol,
                },
              });
            }}
            showList={true}
          />
        )}
      />
      <Text pt={5}>Amount</Text>
      <Controller
        name="currentDelegationState"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <AssetInput
            hideToken={currentDelegationState.tokenSymbol}
            {...field}
            token={currentDelegationState}
            tokenPrice={price}
            balance={currentTokenBalance?.balance}
            minMax={false}
            disabled={false}
            onChange={async (value, isTokenChange) => {
              field.onChange(value)
              if (isTokenChange) {
                const { denom, decimals } = tokens.find((t) => t.symbol === value.tokenSymbol)
                setCurrentDelegationState({
                  ...currentDelegationState,
                  tokenSymbol: value.tokenSymbol,
                  amount: value.amount === '' ? 0 : Number(value.amount),
                  denom,
                  decimals,
                })
                await router.push({
                  pathname: '/alliance/delegate',
                  query: {
                    validatorDestAddress:
                      currentDelegationState.validatorDestAddress,
                    tokenSymbol: value.tokenSymbol,
                  },
                });
              } else {
                setCurrentDelegationState({
                  ...currentDelegationState,
                  amount: value.amount === '' ? 0 : value.amount,
                });
              }
            }}
          />
        )}
      />
    </VStack>
  )
}
export default Delegate
