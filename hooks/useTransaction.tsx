import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useMutation, useQuery} from 'react-query';

import {useToast} from '@chakra-ui/react';
import Finder from 'components/Finder';
import {convertDenomToMicroDenom} from 'util/conversion';
import {ActionType} from 'components/Pages/Dashboard';
import {TxStep} from 'types/blockchain';
import {delegate} from "hooks/delegate";
import {undelegate} from "hooks/undelegate";
import {claimRewards} from "hooks/claimRewards";
import {isNativeToken} from "util/isNative";
import {useChain} from "@cosmos-kit/react-lite";
import {MIGALOO_CHAIN_ID, MIGALOO_CHAIN_NAME} from "constants/common";
import {useClients} from "hooks/useClients";

export const useTransaction = () => {
    const toast = useToast();
    const { address} = useChain(MIGALOO_CHAIN_NAME)
    const { signingClient: client } = useClients()
    const [txStep, setTxStep] = useState<TxStep>(TxStep.Idle);
    const [delegationAction, setDelegationAction] = useState<ActionType>(ActionType.delegate)
    const [txHash, setTxHash] = useState<string>(null)
    const [error, setError] = useState(null)
    const [buttonLabel, setButtonLabel] = useState(null)

    const {data: fee} = useQuery(
        ['fee', error],
        async () => {
            setError(null);
            setTxStep(TxStep.Estimating);
            try {
                const response = 0; //await client.simulate(address, [delegationMsg], '')

                if (!!buttonLabel) setButtonLabel(null);
                setTxStep(TxStep.Ready);
                return response;
            } catch (error) {
                if (
                    /insufficient funds/i.test(error.toString()) ||
                    /Overflow: Cannot Sub with/i.test(error.toString())
                ) {
                    console.error(error);
                    setTxStep(TxStep.Idle);
                    setError('Insufficient Funds');
                    setButtonLabel('Insufficient Funds');
                    throw new Error('Insufficient Funds');
                } else if (/account sequence mismatch/i.test(error?.toString())) {
                    setError('You have pending transaction');
                    setButtonLabel('You have pending transaction');
                    throw new Error('You have pending transaction');
                } else {
                    console.error({error});
                    setTxStep(TxStep.Idle);
                    setError(error?.message);
                    throw Error(error?.message);
                }
            }
        },
        {
            enabled: txStep === TxStep.Idle && error === null && !!client && !!address,
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

    const {mutate} = useMutation(
        (data: any) => {
            const adjustedAmount = convertDenomToMicroDenom(data.amount, 6).toString();
            if (data.action === ActionType.delegate) {
                return delegate(client, address, adjustedAmount, data.denom)
            } else if (data.action === ActionType.undelegate) {
                return undelegate(client, address, adjustedAmount, data.denom, isNativeToken(data.denom))
            } else {
                return claimRewards(client, address, data.denom, isNativeToken(data.denom))
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
                    /insufficient funds/i.test(e?.toString()) ||
                    /Overflow: Cannot Sub with/i.test(e?.toString())
                ) {
                    setError('Insufficient Funds');
                    message = 'Insufficient Funds';
                } else if (/Request rejected/i.test(e?.toString())) {
                    setError('User Denied');
                    message = 'User Denied';
                } else if (/account sequence mismatch/i.test(e?.toString())) {
                    setError('You have pending transaction');
                    message = 'You have pending transaction';
                } else if (/out of gas/i.test(e?.toString())) {
                    setError('Out of gas, try increasing gas limit on wallet.');
                    message = 'Out of gas, try increasing gas limit on wallet.';
                } else if (
                    /was submitted but was not yet found on the chain/i.test(
                        e?.toString(),
                    )
                ) {
                    setError(e?.toString());
                    message = (
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
            },
        },
    );

    const {data: txInfo} = useQuery(
        ['txInfo', txHash],
        async () => {
            if (txHash === null) {
                return
            }
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

    const submit = useCallback(
        async (
            action: ActionType,
            amount: number | null,
            denom: string | null,
        ) => {

            setDelegationAction(action)

            mutate({
                fee,
                action,
                denom,
                amount,
            });
        },
        [fee, mutate, client],
    );

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
    }, []); //debouncedMsgs

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
        };
    }, [fee, buttonLabel, submit, txStep, txInfo, txHash, error]);
};

export default useTransaction;
