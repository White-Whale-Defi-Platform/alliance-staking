import React, { useEffect, useMemo } from 'react';
import { Text, VStack } from '@chakra-ui/react';
import AssetInput from 'components/AssetInput/index';
import {useRecoilState} from 'recoil';
import { Controller, useForm } from 'react-hook-form';
import { delegationState, DelegationState } from 'state/delegationState';
import ValidatorInput from 'components/ValidatorInput/ValidatorInput';
import tokenList from 'public/mainnet/white_listed_alliance_token_info.json';
import useValidators from 'hooks/useValidators';
import usePrices from 'hooks/usePrices';
import tokens from 'public/mainnet/white_listed_alliance_token_info.json';
import { useRouter } from 'next/router';
import {useChain} from "@cosmos-kit/react-lite";
import {MIGALOO_CHAIN_NAME} from "constants/common";

const Redelegate = ({
  validatorDestAddress,
  validatorSrcAddress,
  delegations,
  tokenSymbol,
}) => {
  const { address } = useChain(MIGALOO_CHAIN_NAME)
  const [currentDelegationState, setCurrentDelegationState] =
    useRecoilState<DelegationState>(delegationState);

  const { data: { validators = [] } = {} } = useValidators({ address });

  const chosenDestValidator = useMemo(
    () => validators.find((v) => v.operator_address === validatorDestAddress),
    [validatorDestAddress, validators],
  );

  const chosenSrcValidator = useMemo(
    () => validators.find((v) => v.operator_address === validatorSrcAddress),
    [validatorSrcAddress, validators],
  );

  const onInputChange = (tokenSymbol: string | null, amount: number) => {
    if (tokenSymbol) {
      setCurrentDelegationState({
        ...currentDelegationState,
        tokenSymbol: tokenSymbol,
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
      decimals: 6,
    });
  }, [chosenDestValidator, chosenSrcValidator]);

  const { control } = useForm({
    mode: 'onChange',
    defaultValues: {
      currentDelegationState,
    },
  });

  const allSingleTokenDelegations = useMemo(() => {
    return delegations
      .filter((d) => d.token.symbol === currentDelegationState.tokenSymbol)
      .filter(
        (d) =>
          currentDelegationState.validatorSrcAddress === null ||
          d.delegation.validator_address ===
            currentDelegationState.validatorSrcAddress,
      );
  }, [delegations, currentDelegationState]);

  const aggregatedAmount = allSingleTokenDelegations
    ?.reduce((acc, e) => acc + Number(e?.token?.amount ?? 0), 0)
    .toFixed(6);
    const [priceList] = usePrices() || [];



    const router = useRouter();
  const price = useMemo(() => {
    if (!tokens || !Array.isArray(tokens) || !priceList) {
      return undefined;
    }
    const token = tokens.find(
      (e) => e.symbol === currentDelegationState.tokenSymbol,
    );

    if (!token) {
      return undefined;
    }
    return priceList[token.name];
  }, [priceList, currentDelegationState.tokenSymbol, tokens]);

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
            whalePrice={price}
            balance={aggregatedAmount}
            minMax={false}
            disabled={false}
            onChange={async (value, isTokenChange) => {
              onInputChange(value, 0);
              field.onChange(value);
              if (isTokenChange) {
                const denom = tokenList.find(
                  (t) => t.symbol === value.tokenSymbol,
                ).denom;
                setCurrentDelegationState({
                  ...currentDelegationState,
                  tokenSymbol: value.tokenSymbol,
                  amount: value.amount === '' ? 0 : value.amount,
                  denom: denom,
                });
                await router.push({
                  pathname: '/redelegate',
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
                });
              }
            }}
          />
        )}
      />
    </VStack>
  );
};

export default Redelegate;
