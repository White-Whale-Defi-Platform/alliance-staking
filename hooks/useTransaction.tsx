import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useToast } from '@chakra-ui/react';
import { useChain } from '@cosmos-kit/react-lite';
import Finder from 'components/Finder';
import { ActionType } from 'components/Pages/Dashboard';
import { MIGALOO_CHAIN_ID, MIGALOO_CHAIN_NAME } from 'constants/common';
import { claimRewards } from 'hooks/claimRewards';
import { delegate } from 'hooks/delegate'
import { undelegate } from 'hooks/undelegate'
import { useClients } from 'hooks/useClients'
import { TxStep } from 'types/blockchain'
import { convertDenomToMicroDenom } from 'util/conversion';
import { isNativeToken } from 'util/isNative';

export const useTransaction = () => {
  const toast = useToast();
  const { address } = useChain(MIGALOO_CHAIN_NAME)
  const { signingClient: client, allianceSigningClient } = useClients()
  const [txStep, setTxStep] = useState<TxStep>(TxStep.Idle);
  const [delegationAction, setDelegationAction] = useState<ActionType>(ActionType.delegate)
  const [txHash, setTxHash] = useState<string>(null)
  const [error, setError] = useState(null)
  const [buttonLabel, setButtonLabel] = useState(null)
  const queryClient = useQueryClient();

  const { data: fee } = useQuery(
    ['fee', error],
    async () => {
      setError(null);
      setTxStep(TxStep.Estimating);
      try {
        const response = 0; // Await client.simulate(address, [delegationMsg], '')

        if (buttonLabel) {
          setButtonLabel(null);
        }
        setTxStep(TxStep.Ready);
        return response;
      } catch (error) {
        if (
          (/insufficient funds/u).test(error.toString()) ||
          (/Overflow: Cannot Sub with/u).test(error.toString())
        ) {
          console.error(error);
          setTxStep(TxStep.Idle);
          setError('Insufficient Funds');
          setButtonLabel('Insufficient Funds');
          throw new Error('Insufficient Funds');
        } else if ((/account sequence mismatch/u).test(error?.toString())) {
          setError('You have pending transaction');
          setButtonLabel('You have pending transaction');
          throw new Error('You have pending transaction');
        } else {
          console.error({ error });
          setTxStep(TxStep.Idle);
          setError(error?.message);
          throw Error(error?.message);
        }
      }
    },
    {
      enabled: txStep === TxStep.Idle && error === null && Boolean(client) && Boolean(address),
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess: () => {
        setTxStep(TxStep.Ready);
      },
      onError: () => {
        setTxStep(TxStep.Idle);
      },
    },
  )

  const { mutate } = useMutation((data: any) => {
    console.log({ data })
    if (data.action === ActionType.delegate) {
      const adjustedAmount = convertDenomToMicroDenom(data?.amount ?? 0, 6).toString();
      return delegate(
        allianceSigningClient, address, adjustedAmount, data.denom,
      )
    } else if (data.action === ActionType.undelegate) {
      const adjustedAmount = convertDenomToMicroDenom(data?.amount ?? 0, 6).toString();
      return undelegate(
        allianceSigningClient, address, adjustedAmount, data.denom, isNativeToken(data.denom),
      )
    } else {
      return claimRewards(
        allianceSigningClient, address, data.denom,
      )
    }
  },
  {
    onMutate: () => {
      setTxStep(TxStep.Posting);
    },
    onError: (e) => {
      let message: any = '';
      console.error(e?.toString());
      setTxStep(TxStep.Failed);
      if (
        (/insufficient funds/u).test(e?.toString()) ||
          (/Overflow: Cannot Sub with/u).test(e?.toString())
      ) {
        setError('Insufficient Funds');
        message = 'Insufficient Funds';
      } else if ((/Request rejected/u).test(e?.toString())) {
        setError('User Denied');
        message = 'User Denied';
      } else if ((/account sequence mismatch/u).test(e?.toString())) {
        setError('You have pending transaction');
        message = 'You have pending transaction';
      } else if ((/out of gas/u).test(e?.toString())) {
        setError('Out of gas, try increasing gas limit on wallet.');
        message = 'Out of gas, try increasing gas limit on wallet.';
      } else if (
        (/was submitted but was not yet found on the chain/u).test(e?.toString())
      ) {
        setError(e?.toString());
        message = (
          // eslint-disable-next-line
          <Finder txHash={txInfo?.hash} chainId={MIGALOO_CHAIN_ID}>
            {' '}
          </Finder>
        );
      } else {
        setError('Failed to post transaction.');
        message = 'Failed to post transaction.';
      }

      toast({
        title: (() => {
          switch (delegationAction) {
            case ActionType.delegate:
              return 'Delegation Failed.'
            case ActionType.undelegate:
              return 'Undelegation Failed'
            default:
              return '';
          }
        })(),
        description: message,
        status: 'error',
        duration: 9000,
        position: 'top-right',
        isClosable: true,
      })
    },
    onSuccess: (data: any) => {
      setTxStep(TxStep.Broadcasting)
      setTimeout(() => {
        setTxHash(data?.transactionHash ?? data?.result?.txhash)
        toast({
          title: (() => {
            switch (delegationAction) {
              case ActionType.delegate:
                return 'Delegation Successful.'
              case ActionType.undelegate:
                return 'Undelegation Successful.'
              default:
                return '';
            }
          })(),
          description: (
            <Finder txHash={data?.transactionHash ?? data?.result?.txhash} chainId={MIGALOO_CHAIN_ID}>
              {' '}
            </Finder>
          ),
          status: 'success',
          duration: 9000,
          position: 'top-right',
          isClosable: true,
        })
      }, 2000);
      queryClient.invalidateQueries('restakeTokenBalances')
      queryClient.invalidateQueries('allianceTokenBalances')
      queryClient.invalidateQueries('stakedBalances')
      queryClient.invalidateQueries('delegations')
    },
  });

  const { data: txInfo } = useQuery(
    ['txInfo', txHash],
    async () => {
      if (txHash === null) {
        return
      }
      // eslint-disable-next-line
      return await client.getTx(txHash);
    },
    {
      enabled: Boolean(txHash),
      retry: true,
    },
  );

  const reset = () => {
    setError(null);
    setTxHash(null);
    setTxStep(TxStep.Idle);
  };

  const submit = useCallback(async (
    action: ActionType,
    amount: number | null,
    denom: string | null | string[],
  ) => {
    setDelegationAction(action)
    mutate({
      fee,
      action,
      denom,
      amount,
    });
  },
  [fee, mutate, client]);

  useEffect(() => {
    if (txInfo && txHash) {
      if (txInfo?.code) {
        setTxStep(TxStep.Failed);
      } else {
        setTxStep(TxStep.Successful);
      }
    }
  }, [txInfo, txHash, error]);

  useEffect(() => {
    if (error) {
      setError(null);
    }

    if (txStep !== TxStep.Idle) {
      setTxStep(TxStep.Idle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // DebouncedMsgs

  return useMemo(() => ({
    fee,
    buttonLabel,
    submit,
    txStep,
    txInfo,
    txHash,
    error,
    reset,
  }), [fee, buttonLabel, submit, txStep, txInfo, txHash, error]);
};

export default useTransaction
