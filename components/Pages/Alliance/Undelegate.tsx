import React, { useEffect, useMemo } from 'react';
import { Text, VStack } from '@chakra-ui/react';
import AssetInput from 'components/AssetInput/index';
import {useRecoilState} from 'recoil';
import { Controller, useForm } from 'react-hook-form';
import { delegationState, DelegationState } from 'state/delegationState';
import ValidatorInput from 'components/ValidatorInput/ValidatorInput';
import tokens from 'public/mainnet/white_listed_alliance_token_info.json';
import usePrices from 'hooks/usePrices';
import useValidators from 'hooks/useValidators';
import { useRouter } from 'next/router';
import {useChain} from "@cosmos-kit/react-lite";
import {MIGALOO_CHAIN_ID, MIGALOO_CHAIN_NAME} from "constants/common";

const Undelegate = ({ delegations, validatorSrcAddress, tokenSymbol }) => {
    const { address } = useChain(MIGALOO_CHAIN_NAME)
    const [currentDelegationState, setCurrentDelegationState] =
    useRecoilState<DelegationState>(delegationState);

  const { data: { validators = [] } = {} } = useValidators({ address });

  const chosenSrcValidator = useMemo(
    () => validators.find((v) => v.operator_address === validatorSrcAddress),
    [validatorSrcAddress, validators],
  );

  const onInputChange = (tokenSymbol: string | null, amount: number) => {
    const newState = { ...currentDelegationState, amount: Number(amount) };
    if (tokenSymbol) {
      newState.tokenSymbol = tokenSymbol;
    }
    setCurrentDelegationState(newState);
  };

  useEffect(() => {
    const token = tokens.find((e) => e.symbol === tokenSymbol);

    setCurrentDelegationState({
      ...currentDelegationState,
      validatorDestAddress: null,
      tokenSymbol: token.symbol,
      amount: 0,
      decimals: 6,
      validatorSrcAddress: chosenSrcValidator?.operator_address,
      validatorSrcName: chosenSrcValidator?.description.moniker,
      denom: token.denom,
    });
  }, [chosenSrcValidator]);

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


    const price = useMemo(
    () =>
      priceList?.[
        tokens?.find((e) => e.symbol === currentDelegationState.tokenSymbol)
          ?.name
      ],
    [priceList, currentDelegationState.tokenSymbol],
  );
  const router = useRouter();

  return (
    <VStack px={7} width="full" alignItems="flex-start" marginBottom={5}>
      <Text>From</Text>
      <Controller
        name="currentDelegationState"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <ValidatorInput
            validatorName={currentDelegationState?.validatorSrcName}
            delegatedOnly={true}
            onChange={async (validator) => {
              field.onChange(validator);
              setCurrentDelegationState({
                ...currentDelegationState,
                validatorSrcAddress: validator.operator_address,
                validatorSrcName: validator.description.moniker,
              });
              await router.push({
                pathname: '/alliance/undelegate',
                query: {
                  validatorSrcAddress: validator.operator_address,
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
                const denom = tokens.find(
                  (t) => t.symbol === value.tokenSymbol,
                ).denom;
                setCurrentDelegationState({
                  ...currentDelegationState,
                  tokenSymbol: value.tokenSymbol,
                  amount: value.amount === '' ? 0 : value.amount,
                  denom: denom,
                });
                await router.push({
                  pathname: '/alliance/undelegate',
                  query: {
                    validatorSrcAddress:
                      currentDelegationState.validatorSrcAddress,
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

export default Undelegate;
