import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Text, VStack } from '@chakra-ui/react';
import { useChain } from '@cosmos-kit/react-lite';
import AssetInput from 'components/AssetInput/index';
import ValidatorInput from 'components/Pages/Alliance/ValidatorInput/ValidatorInput';
import { useGetLPTokenPrices } from 'hooks/useGetLPTokenPrices';
import usePrices from 'hooks/usePrices';
import useValidators from 'hooks/useValidators';
import { useRouter } from 'next/router';
import tokens from 'public/mainnet/white_listed_alliance_token_info.json';
import { useRecoilState, useRecoilValue } from 'recoil';
import { chainState } from 'state/chainState';
import { delegationState, DelegationState } from 'state/delegationState';

const Redelegate = ({
  validatorDestAddress,
  validatorSrcAddress,
  delegations,
  tokenSymbol,
}) => {
  const { walletChainName } = useRecoilValue(chainState)
  const { address } = useChain(walletChainName)
  const [currentDelegationState, setCurrentDelegationState] =
    useRecoilState<DelegationState>(delegationState);

  const { data: { validators = [], allValidators } = {} } = useValidators({ address });

  const chosenDestValidator = useMemo(() => validators.find((v) => v.operator_address === validatorDestAddress),
    [validatorDestAddress, validators]);

  const chosenSrcValidator = useMemo(() => validators.find((v) => v.operator_address === validatorSrcAddress),
    [validatorSrcAddress, validators]);

  const onInputChange = (tokenSymbol: string | null, amount: number) => {
    if (tokenSymbol) {
      setCurrentDelegationState({
        ...currentDelegationState,
        tokenSymbol,
        amount: Number(amount),
      });
    } else {
      setCurrentDelegationState({
        ...currentDelegationState,
        amount: Number(amount),
      });
    }
  };

  useEffect(() => {
    const token = tokens.find((e) => e.symbol === tokenSymbol);
    setCurrentDelegationState({
      ...currentDelegationState,
      validatorDestAddress: chosenDestValidator?.operator_address,
      validatorDestName: chosenDestValidator?.description.moniker,
      amount: 0,
      denom: token.denom,
      tokenSymbol: token.symbol,
      validatorSrcAddress: chosenSrcValidator?.operator_address,
      validatorSrcName: chosenSrcValidator?.description.moniker,
      decimals: token.decimals,
    });
  }, [chosenDestValidator, chosenSrcValidator]);

  const { control } = useForm({
    mode: 'onChange',
    defaultValues: {
      currentDelegationState,
    },
  });

  const allSingleTokenDelegations = useMemo(() => delegations.
    filter((d) => d.token.symbol === currentDelegationState.tokenSymbol).
    filter((d) => currentDelegationState.validatorSrcAddress === null ||
          d.delegation.validator_address ===
            currentDelegationState.validatorSrcAddress), [delegations, currentDelegationState]);

  const aggregatedAmount = allSingleTokenDelegations?.
    reduce((acc, e) => acc + Number(e?.token?.amount ?? 0), 0).
    toFixed(6);
  const [priceList] = usePrices() || [];

  const router = useRouter();
  const lpTokenPrices = useGetLPTokenPrices()

  const price = useMemo(() => (currentDelegationState.tokenSymbol === 'mUSDC' ? 1 : currentDelegationState.tokenSymbol?.includes('-LP') ? lpTokenPrices?.[currentDelegationState.tokenSymbol] :
    priceList?.[
      tokens?.find((e) => e.symbol === currentDelegationState.tokenSymbol)?.
        name
    ]),
  [priceList, currentDelegationState.tokenSymbol, lpTokenPrices])
  return (
    <VStack px={7} width="full" alignItems="flex-start" marginBottom={5}>
      <Text>From</Text>
      <Controller
        name="currentDelegationState"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <ValidatorInput
            delegatedOnly={true}
            validatorName={currentDelegationState.validatorSrcName}
            validatorList={allValidators}
            onChange={async (validator) => {
              field.onChange(validator);
              setCurrentDelegationState({
                ...currentDelegationState,
                validatorSrcAddress: validator.operator_address,
                validatorSrcName: validator.description.moniker,
              });
              await router.push({
                pathname: '/alliance/redelegate',
                query: {
                  validatorSrcAddress: validator.operator_address,
                  validatorDestAddress:
                    currentDelegationState.validatorDestAddress,
                  tokenSymbol: currentDelegationState.tokenSymbol,
                },
              });
            }}
            showList={true}
          />
        )}
      />
      <Text pt={5}>To</Text>
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
              field.onChange(validator);
              setCurrentDelegationState({
                ...currentDelegationState,
                validatorDestAddress: validator.operator_address,
                validatorDestName: validator.description.moniker,
              });
              await router.push({
                pathname: '/alliance/redelegate',
                query: {
                  validatorSrcAddress:
                    currentDelegationState.validatorSrcAddress,
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
            balance={aggregatedAmount}
            minMax={false}
            disabled={false}
            onChange={async (value, isTokenChange) => {
              onInputChange(value, 0);
              field.onChange(value);
              if (isTokenChange) {
                const { denom, decimals } = tokens.find((t) => t.symbol === value.tokenSymbol);
                setCurrentDelegationState({
                  ...currentDelegationState,
                  tokenSymbol: value.tokenSymbol,
                  amount: value.amount === '' ? 0 : value.amount,
                  denom,
                  decimals,
                })
                await router.push({
                  pathname: '/alliance/redelegate',
                  query: {
                    validatorSrcAddress:
                      currentDelegationState.validatorSrcAddress,
                    validatorDestAddress:
                      currentDelegationState.validatorDestAddress,
                    tokenSymbol: value.tokenSymbol,
                  },
                });
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
    </VStack>
  )
}

export default Redelegate
