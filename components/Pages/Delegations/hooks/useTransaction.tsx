import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {useMutation, useQuery} from 'react-query'

import {useToast} from '@chakra-ui/react'
import Finder from 'components/Finder'
import {useRecoilValue} from "recoil";
import {walletState} from "state/atoms/walletAtoms";
import {convertDenomToMicroDenom} from "util/conversion";
import {ActionType} from "components/Pages/Delegations/Dashboard";
import {delegate as allianceDelegate} from "./native-staking/delegate";
import {undelegate as allianceUnDelegate} from "./native-staking/undelegate";
import {redelegate as allianceRedelegate} from "./native-staking/redelegate";
import {claimRewards as allianceClaimRewards} from "./native-staking/claimRewards";
// Native staking 
import {delegate as nativeDelegate} from "./native-staking/delegate";
import {undelegate as nativeUnDelegate} from "./native-staking/undelegate";
import {redelegate as nativeRedelegate} from "./native-staking/redelegate";
import { claimRewards as nativeClaimRewards } from './native-staking/claimRewards';
import useClient from "hooks/useTerraStationClient";
import useDelegations from "hooks/useDelegations";
import useValidators from "hooks/useValidators";
export enum TxStep {
  /**
   * Idle
   */
  Idle = 0,
  /**
   * Estimating fees
   */
  Estimating = 1,
  /**
   * Ready to post transaction
   */
  Ready = 2,
  /**
   * Signing transaction in Terra Station
   */
  Posting = 3,
  /**
   * Broadcasting
   */
  Broadcasting = 4,
  /**
   * Successful
   */
  Successful = 5,
  /**
   * Failed
   */
  Failed = 6,
}

export const useTransaction = () => {
  const toast = useToast()
  const { chainId, address } = useRecoilValue(walletState)
  const [txStep, setTxStep] = useState<TxStep>(TxStep.Idle)
  const [delegationAction, setDelegationAction] = useState<ActionType>(null)
  const [txHash, setTxHash] = useState<string | undefined>(undefined)
  const [error, setError] = useState<unknown | null>(null)
  const [buttonLabel, setButtonLabel] = useState<unknown | null>(null)
  const client = useClient()
  const { data: { delegations = [] } = {} } = useDelegations({address})
  const {data: {validators = []} = {}} = useValidators({address})

  // const delegationMsg = new MsgAllianceDelegate(
  //       address,
  //       "migaloovaloper1qvqqflpzkkakzwdkm2dx6f25sxnknuga4f90qp",
  //       new Coin('ibc/05238E98A143496C8AF2B6067BABC84503909ECE9E45FBCBAC2CBA5C889FD82A', 1000)
  //   ).packAny()


  const { data: fee } = useQuery<unknown, unknown, any | null>(
    ['fee', error],
    async () => {
      setError(null)
      setTxStep(TxStep.Estimating)
      try {
        const response = 0//await client.simulate(address, [delegationMsg], '')

        if (!!buttonLabel) setButtonLabel(null)
        setTxStep(TxStep.Ready)
        return response
      } catch (error) {
        if (
          /insufficient funds/i.test(error.toString()) ||
          /Overflow: Cannot Sub with/i.test(error.toString())
        ) {
          console.error(error)
          setTxStep(TxStep.Idle)
          setError('Insufficient Funds')
          setButtonLabel('Insufficient Funds')
          throw new Error('Insufficient Funds')
        } else if (/account sequence mismatch/i.test(error?.toString())) {
          setError('You have pending transaction')
          setButtonLabel('You have pending transaction')
          throw new Error('You have pending transaction')
        } else {
          console.error({ error })
          setTxStep(TxStep.Idle)
          setError(error?.message)
          throw Error(error?.message)
          // setTxStep(TxStep.Idle)
          // setError("Failed to execute transaction.")
          // throw Error("Failed to execute transaction.")
        }
      }
    },
    {
      enabled:
        txStep == TxStep.Idle &&
        error == null &&
        !!client &&
        !!address ,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 0,
      onSuccess: () => {
        setTxStep(TxStep.Ready)
      },
      onError: () => {
        setTxStep(TxStep.Idle)
      },
    }
  )

  const { mutate } = useMutation(
    (data: any) => {
      const adjustedAmount = convertDenomToMicroDenom(data.amount, 6)
      if(data.action===ActionType.delegate){
       return data.denom == "uwhale" ? nativeDelegate(client,"migaloo-1", data.validatorDestAddress,address,adjustedAmount, data.denom) : allianceDelegate(client,"migaloo-1", data.validatorDestAddress,address,adjustedAmount, data.denom)
      }else if (data.action===ActionType.undelegate){
        return data.denom == "uwhale" ? nativeUnDelegate(client,"migaloo-1", data.validatorSrcAddress,address,adjustedAmount, data.denom) : allianceUnDelegate(client,"migaloo-1", data.validatorSrcAddress,address,adjustedAmount, data.denom)
      }else if (data.action===ActionType.redelegate){
        return data.denom == "uwhale" ? nativeRedelegate(client,"migaloo-1", data.validatorSrcAddress,data.validatorDestAddress,address,adjustedAmount,validators, data.denom) : allianceRedelegate(client,"migaloo-1", data.validatorSrcAddress,data.validatorDestAddress,address,adjustedAmount,validators, data.denom)
      }
      else{
        return nativeClaimRewards(client, delegations, address)
      }
    },
    {
      onMutate: () => {
        setTxStep(TxStep.Posting)
      },
      onError: (e) => {
        let message: any = ''
        console.error(e?.toString())
        setTxStep(TxStep.Failed)
        if (
          /insufficient funds/i.test(e?.toString()) ||
          /Overflow: Cannot Sub with/i.test(e?.toString())
        ) {
          setError('Insufficient Funds')
          message = 'Insufficient Funds'
        } else if (/Request rejected/i.test(e?.toString())) {
          setError('User Denied')
          message = 'User Denied'
        } else if (/account sequence mismatch/i.test(e?.toString())) {
          setError('You have pending transaction')
          message = 'You have pending transaction'
        } else if (/out of gas/i.test(e?.toString())) {
          setError('Out of gas, try increasing gas limit on wallet.')
          message = 'Out of gas, try increasing gas limit on wallet.'
        } else if (
          /was submitted but was not yet found on the chain/i.test(
            e?.toString()
          )
        ) {
          setError(e?.toString())
          message = (
            <Finder txHash={txInfo?.txhash} chainId={chainId}>
              {' '}
            </Finder>
          )
        } else {
          setError('Failed to post transaction.')
          message = 'Failed to post transaction.'
        }

        toast({
          title:  (() => {
            switch (delegationAction) {
              case ActionType.delegate:
                return "Delegation Failed.";
              case ActionType.undelegate:
                return "Undelegation Failed";
              case ActionType.redelegate:
                return "Redelegation Failed.";
              case ActionType.claim:
                return "Claiming Failed.";
              default:
                return "";
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
        setTimeout(()=>{
          setTxHash(data?.result.txhash)

        toast({
          title:  (() => {
            switch (delegationAction) {
              case ActionType.delegate:
                return "Delegation Successful.";
              case ActionType.undelegate:
                return "Undelegation Successful.";
              case ActionType.redelegate:
                return "Redelegation Successful.";
              case ActionType.claim:
                return "Claiming Successful.";
              default:
                return "";
            }
          })(),
          description: (
            <Finder
              txHash={data?.result.txhash}
              chainId={chainId}>
              {' '}
            </Finder>
          ),
          status: 'success',
          duration: 9000,
          position: 'top-right',
          isClosable: true,
        }) },2000)
      }
    }
  )

  const { data: txInfo } = useQuery(
    ['txInfo', txHash],
    async () => {
      if (txHash == null) {
        return
      }
      return await client.getTx(txHash)
    },
    {
      enabled: txHash != null,
      retry: true,
    }
  )

  const reset = () => {
    setError(null)
    setTxHash(undefined)
    setTxStep(TxStep.Idle)
  }

  const submit = useCallback(async (action: ActionType,validatorDestAddress: string |null,validatorSrcAddress:string | null, amount:number | null, denom:string | null) => {
    if (fee == null) {
      return
    }
    await setDelegationAction(action)

     mutate({
      fee,
      action,
      validatorDestAddress,
      validatorSrcAddress,
      denom,
      amount,
    })
  }, [fee, mutate, client])

  useEffect(() => {
    if (txInfo != null && txHash != null) {
      if (txInfo?.code) {
        setTxStep(TxStep.Failed)
      } else {
        setTxStep(TxStep.Successful)
      }
    }
  }, [txInfo, txHash, error])

  useEffect(() => {
    if (error) {
      setError(null)
    }

    if (txStep != TxStep.Idle) {
      setTxStep(TxStep.Idle)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) //debouncedMsgs

  return useMemo(() => {
    return {
      fee,
      buttonLabel,
      submit,
      txStep,
      txInfo,
      txHash,
      error,
      reset,
    }
  }, [fee, buttonLabel, submit, txStep, txInfo, txHash, error])
}

export default useTransaction
