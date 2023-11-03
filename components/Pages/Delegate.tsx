import React, {useEffect, useMemo} from 'react';

import {HStack, IconButton, Text, VStack,} from '@chakra-ui/react';
import {useRecoilState} from 'recoil';
import {Controller, useForm} from "react-hook-form";
import AssetInput from "components/AssetInput/index";
import {delegationState, DelegationState} from "state/delegationState";
import usePrices from "hooks/usePrices";
import {TokenBalance} from "components/Pages/Alliance/Delegate";
import CustomButton from "components/CustomButton";
import {useRouter} from "next/router";
import {ArrowBackIcon} from "@chakra-ui/icons";
import useTransaction from "hooks/useTransaction";
import {TxStep} from "types/blockchain";
import whiteListedEcosystemTokens from "public/mainnet/white_listed_ecosystem_token_info.json";
import whiteListedLiquidityTokens from "public/mainnet/white_listed_liquidity_token_info.json";
import {useMultipleTokenBalance} from "hooks/useTokenBalance";
import {ActionType} from "components/Pages/Dashboard";
import {tabState, TabType} from "state/tabState";
import {useGetLPTokenPrice} from "hooks/useGetLPTokenPrice";
import {useChain} from "@cosmos-kit/react-lite";
import {MIGALOO_CHAIN_NAME} from "constants/common";


export const Delegate = ({tokenSymbol}) => {
    const [currentDelegationState, setCurrentDelegationState] =
        useRecoilState<DelegationState>(delegationState)
    const [_, setTabType] = useRecoilState(tabState)
    const {isWalletConnected,openView} = useChain(MIGALOO_CHAIN_NAME)
    const {submit, txStep} = useTransaction()
    const router = useRouter()
    const tabFromUrl = router.pathname.split('/')?.[1].split('/')?.[0]
    const {control} = useForm({
        mode: 'onChange',
        defaultValues: {
            currentDelegationState,
        },
    })

    const whiteListedTokens = useMemo(() => {
        if (tabFromUrl === TabType.ecosystem) {
            return whiteListedEcosystemTokens
        } else if (tabFromUrl === TabType.liquidity) {
            return whiteListedLiquidityTokens
        }
    }, [tabFromUrl])

    useEffect(() => {
        if (tabFromUrl === TabType.ecosystem) {
            setTabType(TabType.ecosystem)
        } else if (tabFromUrl === TabType.liquidity) {
            setTabType(TabType.liquidity)
        }
    }, [tabFromUrl])

    const {data: balances} = useMultipleTokenBalance(
        whiteListedTokens?.map((e) => e.symbol) ?? [],
    )
    const liquidTokenPriceBalances: TokenBalance[] =
        whiteListedTokens?.map((tokenInfo, index) => ({
            balance: balances?.[index],
            tokenSymbol: tokenInfo.symbol,
        })) ?? []
    const currentTokenBalance: TokenBalance = liquidTokenPriceBalances?.find(
        (e) => e.tokenSymbol === currentDelegationState.tokenSymbol,
    )
    const [priceList] = usePrices() || []
    const {lpTokenPrice} = useGetLPTokenPrice()

    useEffect(() => {
        if (tokenSymbol) {
            const token = whiteListedTokens?.find((e) => e.symbol === tokenSymbol)
            if (!token) return
            setCurrentDelegationState({
                ...currentDelegationState,
                tokenSymbol: token.symbol,
                decimals: 6,
                denom: token?.denom,
            })
        } else {
            const token = whiteListedTokens?.find((e) => e.symbol === currentDelegationState.tokenSymbol) || whiteListedTokens[0]
            setCurrentDelegationState({
                ...currentDelegationState,
                tokenSymbol: token?.symbol,
                decimals: 6,
                denom: token?.denom,
            })
        }
    }, [tokenSymbol])

    useEffect(() => {
        router.push(`/${tabFromUrl}/delegate?tokenSymbol=${currentDelegationState.tokenSymbol}`)
    }, [tabFromUrl, currentDelegationState])

    const price = useMemo(
        () => currentDelegationState?.tokenSymbol === "USDC-WHALE_LP" ? lpTokenPrice :
            priceList?.[
                whiteListedTokens?.find((e) => e.symbol === currentDelegationState.tokenSymbol)
                    ?.name
                ],
        [priceList, lpTokenPrice, currentDelegationState.tokenSymbol],
    )
    const buttonLabel = useMemo(() => {
        if (!isWalletConnected) {
            return 'Connect Wallet'
        }
        return 'Delegate'
    }, [status])

    return (<VStack
            width={{base: '100%', md: '650px'}}
            alignItems="flex-start"
            top={200}
            position="absolute">
            <HStack width={"full"} justifyContent={"space-between"}>
                <IconButton
                    variant="unstyled"
                    color="white"
                    fontSize="28px"
                    aria-label="go back"
                    icon={<ArrowBackIcon/>}
                    onClick={async () => {
                        await router.push(`/`)
                        setCurrentDelegationState({
                            ...currentDelegationState,
                            amount: 0,
                        })
                    }}
                />
                <Text
                    fontSize="24"
                    fontWeight="900"
                    style={{textTransform: 'capitalize'}}>
                    Delegate
                </Text>
            </HStack>
            <VStack
                width="full"
                background={'#1C1C1C'}
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
                    rules={{required: true}}
                    render={({field}) => (
                        <AssetInput
                            hideToken={currentDelegationState.tokenSymbol}
                            hideLogo={currentDelegationState.tokenSymbol === "USDC-WHALE-LP"}
                            {...field}
                            token={currentDelegationState}
                            whalePrice={price}
                            balance={currentTokenBalance?.balance}
                            minMax={false}
                            disabled={false}
                            onChange={async (value, isTokenChange) => {
                                field.onChange(value);
                                if (isTokenChange) {
                                    const denom = whiteListedTokens?.find(
                                        (t) => t.symbol === value.tokenSymbol,
                                    ).denom;
                                    setCurrentDelegationState({
                                        ...currentDelegationState,
                                        tokenSymbol: value.tokenSymbol,
                                        amount: value.amount === '' ? 0 : Number(value.amount),
                                        denom: denom,
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
                    buttonLabel={buttonLabel}
                    onClick={async () => {
                        if (isWalletConnected) {
                            await submit(ActionType.delegate,
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
    );
}

