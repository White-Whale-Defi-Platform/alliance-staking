import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import { useToast } from '@chakra-ui/react';
import { useChain } from '@cosmos-kit/react-lite';
import Finder from 'components/Finder';
import { allianceDelegate } from 'components/Pages/Alliance/hooks/allianceDelegate';
import { allianceRedelegate } from 'components/Pages/Alliance/hooks/allianceRedelegate';
import { allianceUndelegate } from 'components/Pages/Alliance/hooks/allianceUndelegate';
// Native staking
import { claimAllRewards } from 'components/Pages/Alliance/hooks/claimAllRewards';
import { nativeDelegate } from 'components/Pages/Alliance/hooks/nativeDelegate';
import { nativeUndelegate } from 'components/Pages/Alliance/hooks/nativeUndelegate';
import { ActionType } from 'components/Pages/Dashboard';
import { updateRewards } from 'hooks/updateRewards';
import { useClients } from 'hooks/useClients';
import useDelegations from 'hooks/useDelegations';
import { useRecoilValue } from 'recoil';
import { chainState } from 'state/chainState';
import { TxStep } from 'types/blockchain';
import { convertDenomToMicroDenom } from 'util/conversion';

export const useAllianceTransaction = () => {
  const toast = useToast()
  const { chainId, walletChainName } = useRecoilValue(chainState)
  const { address } = useChain(walletChainName)
  const [txStep, setTxStep] = useState<TxStep>(TxStep.Idle)
  const [delegationAction, setDelegationAction] = useState<ActionType>(null)
  const [txHash, setTxHash] = useState<string>(null)
  const [error, setError] = useState(null)
  const [buttonLabel, setButtonLabel] = useState<string>(null)
  const { signingClient: client, allianceSigningClient } = useClients()
  const { data: { delegations = [] } = {} } = useDelegations()

  const { data: fee } = useQuery(
    ['fee'],
    () => {
      setError(null)
      setTxStep(TxStep.Estimating)
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
          console.error({ error })
          setTxStep(TxStep.Idle)
          setError(error?.message)
          throw Error(error?.message)
        }
      }
    },
    {
      enabled: txStep === TxStep.Idle && error === null && Boolean(client) && Boolean(address),
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 0,
      onSuccess: () => {
        setTxStep(TxStep.Ready)
      },
      onError: () => {
        setTxStep(TxStep.Idle)
      },
    },
  )

  const { data: txInfo } = useQuery(
    ['txInfo', txHash],
    async () => {
      if (!txHash) {
        return null
      }
      return await client.getTx(txHash);
    },
    {
      enabled: Boolean(txHash),
      retry: true,
    },
  )
  const { mutate } = useMutation((data: any) => {
    const adjustedAmount = convertDenomToMicroDenom(data?.amount, data?.decimals).toString()
    const isNative = data.denom === 'uwhale'
    if (data.action === ActionType.delegate) {
      return isNative
        ? nativeDelegate(
          client,
          data.validatorDestAddress,
          address,
          adjustedAmount,
          data.denom,
        )
        : allianceDelegate(
          allianceSigningClient,
          data.validatorDestAddress,
          address,
          adjustedAmount,
          data.denom,
        )
    } else if (data.action === ActionType.undelegate) {
      return isNative
        ? nativeUndelegate(
          client,
          data.validatorSrcAddress,
          address,
          adjustedAmount,
          data.denom,
        )
        : allianceUndelegate(
          allianceSigningClient,
          data.validatorSrcAddress,
          address,
          adjustedAmount,
          data.denom,
        )
    } else if (data.action === ActionType.redelegate) {
      return isNative ? () => 0
        /*
         * ? nativeRedelegate(
         *   client,
         *   'migaloo-1',
         *   data.validatorSrcAddress,
         *   data.validatorDestAddress,
         *   address,
         *   adjustedAmount,
         *   data.denom,
         * )
         */
        : allianceRedelegate(
          allianceSigningClient,
          data.validatorSrcAddress,
          data.validatorDestAddress,
          address,
          adjustedAmount,
          data.denom,
        )
    } else if (data.action === ActionType.claim) {
      return claimAllRewards(
        allianceSigningClient, delegations, address,
      )
    } else {
      return updateRewards(client, address)
    }
  },
  {
    onMutate: () => {
      setTxStep(TxStep.Posting);
    },
    onError: (e) => {
      let message: any = '';
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
          <Finder txHash={txInfo?.hash} chainId={chainId}>
            {' '}
          </Finder>
        )
      } else {
        setError('Failed to post transaction.')
        message = 'Failed to post transaction.'
      }

      toast({
        title: (() => {
          switch (delegationAction) {
            case ActionType.delegate:
              return 'Delegation Failed.'
            case ActionType.undelegate:
              return 'Undelegation Failed'
            case ActionType.redelegate:
              return 'Redelegation Failed.'
            case ActionType.claim:
              return 'Claiming Failed.'
            case ActionType.updateRewards:
              return 'Updating Failed.'
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
        const hash = data?.result?.result?.txhash ?? data?.result?.transactionHash ?? data?.transactionHash
        setTxHash(hash)
        toast({
          title: (() => {
            switch (delegationAction) {
              case ActionType.delegate:
                return 'Delegation Successful.'
              case ActionType.undelegate:
                return 'Undelegation Successful.'
              case ActionType.redelegate:
                return 'Redelegation Successful.'
              case ActionType.claim:
                return 'Claiming Successful.'
              case ActionType.updateRewards:
                return 'Updating Rewards Successful.'
              default:
                return ''
            }
          })(),
          description: (
            <Finder txHash={hash} chainId={chainId}>
              {' '}
            </Finder>
          ),
          status: 'success',
          duration: 9000,
          position: 'top-right',
          isClosable: true,
        })
      }, 2000)
    },
  })

  const reset = () => {
    setError(null)
    setTxHash(null)
    setTxStep(TxStep.Idle)
  }

  const submit = useCallback((
    action: ActionType,
    validatorDestAddress: string | null,
    validatorSrcAddress: string | null,
    amount: number | null,
    denom: string | null,
    decimals: number | null,
  ) => {
    if (fee) {
      return null
    }
    setDelegationAction(action)

    return mutate({
      fee,
      action,
      validatorDestAddress,
      validatorSrcAddress,
      denom,
      amount,
      decimals,
    })
  },
  [fee, mutate])

  useEffect(() => {
    if (txInfo && txHash) {
      if (txInfo?.code) {
        setTxStep(TxStep.Failed)
      } else {
        setTxStep(TxStep.Successful)
      }
    }
  }, [txInfo, txHash, error])

  useEffect(() => {
    if (error) {
      setError(null);
    }

    if (txStep !== TxStep.Idle && txStep !== TxStep.Ready) {
      setTxStep(TxStep.Idle);
    }
  }, [txStep, error])

  return useMemo(() => ({
    fee,
    buttonLabel,
    submit,
    txStep,
    txInfo,
    txHash,
    error,
    reset,
  }), [fee, buttonLabel, submit, txStep, txInfo, txHash])
}

export default useAllianceTransaction
