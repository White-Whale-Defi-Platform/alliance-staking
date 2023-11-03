import React, { FC, useEffect, useMemo } from 'react';
import { Text, VStack } from '@chakra-ui/react';
import {useRecoilState} from 'recoil';
import { Controller, useForm } from 'react-hook-form';
import { delegationState, DelegationState } from 'state/delegationState';
import AssetInput from 'components/AssetInput/index';
import ValidatorInput from 'components/ValidatorInput/ValidatorInput';
import tokenList from 'public/mainnet/white_listed_alliance_token_info.json';
import tokens from 'public/mainnet/white_listed_alliance_token_info.json';
import useValidators from 'hooks/useValidators';
import usePrices from 'hooks/usePrices';
import { useRouter } from 'next/router';
import {useChain} from "@cosmos-kit/react-lite";
import {MIGALOO_CHAIN_NAME} from "constants/common";

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
  const { address } = useChain(MIGALOO_CHAIN_NAME)
  const [currentDelegationState, setCurrentDelegationState] =
    useRecoilState<DelegationState>(delegationState);

  const { data: { validators = [] } = {} } = useValidators({ address });

  const chosenValidator = useMemo(
    () => validators.find((v) => v.operator_address === validatorDestAddress),
    [validatorDestAddress, validators],
  );

  const router = useRouter();

  useEffect(() => {
    const token = tokens.find((e) => e.symbol === tokenSymbol);
    setCurrentDelegationState({
      ...currentDelegationState,
      tokenSymbol: token.symbol,
      amount: 0,
      decimals: 6,
      validatorSrcAddress: null,
      validatorDestAddress: validatorDestAddress,
      validatorDestName: chosenValidator?.description.moniker,
      denom: token.denom,
    });
  }, [chosenValidator]);

  const { control } = useForm({
    mode: 'onChange',
    defaultValues: {
      currentDelegationState,
    },
  });
  const currentTokenBalance: TokenBalance = balance?.find(
    (e) => e.tokenSymbol === currentDelegationState.tokenSymbol,
  )
    const [priceList] = usePrices() || [];



    const price = useMemo(
    () =>
      priceList?.[
        tokens?.find((e) => e.symbol === currentDelegationState.tokenSymbol)
          ?.name
      ],
    [priceList, currentDelegationState.tokenSymbol],
  );
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
            onChange={async (validator) => {
              field.onChange(validator);
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
            whalePrice={price}
            balance={currentTokenBalance?.balance}
            minMax={false}
            disabled={false}
            onChange={async (value, isTokenChange) => {
              field.onChange(value);
              if (isTokenChange) {
                const denom = tokenList.find(
                  (t) => t.symbol === value.tokenSymbol,
                ).denom;
                setCurrentDelegationState({
                  ...currentDelegationState,
                  tokenSymbol: value.tokenSymbol,
                  amount: value.amount === '' ? 0 : Number(value.amount),
                  denom: denom,
                });
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
export default Delegate;
