import React, {useEffect, useMemo} from 'react';

import {
    HStack, IconButton,
    Text, VStack,
} from '@chakra-ui/react';
import {useRecoilState} from 'recoil';
import {Controller, useForm} from "react-hook-form";
import AssetInput from "components/AssetInput/index";
import {delegationState, DelegationState} from "state/delegationState";
import usePrices from "hooks/usePrices";
import tokens from "public/mainnet/white_listed_alliance_token_info.json";
import {TokenBalance} from "components/Pages/Alliance/Delegate";
import CustomButton from "components/CustomButton";
import {useRouter} from "next/router";
import {ArrowBackIcon} from "@chakra-ui/icons";
import whiteListedEcosystemTokens from "public/mainnet/white_listed_ecosystem_token_info.json"
import whiteListedLiquidityTokens from "public/mainnet/white_listed_liquidity_token_info.json"
import {tabState, TabType} from "state/tabState";
import {useQueryStakedBalances} from "hooks/useQueryStakedBalances";
import {ActionType} from "components/Pages/Dashboard";
import useTransaction from "hooks/useTransaction";
import {TxStep} from "types/blockchain";
import {useGetLPTokenPrice} from "hooks/useGetLPTokenPrice";
import {useChain} from "@cosmos-kit/react-lite";
import {MIGALOO_CHAIN_ID, MIGALOO_CHAIN_NAME} from "constants/common";

export const Undelegate = ({tokenSymbol}) => {
    const [currentDelegationState, setCurrentDelegationState] =
        useRecoilState<DelegationState>(delegationState)
    const {isWalletConnected,openView} = useChain(MIGALOO_CHAIN_NAME)

    const router = useRouter()
    const {control} = useForm({
        mode: 'onChange',
        defaultValues: {
            currentDelegationState,
        },
    })
    const {submit, txStep} = useTransaction()

    const tabFromUrl = router.pathname.split('/')?.[1].split('/')?.[0]
    const [_, setTabType] = useRecoilState(tabState)

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

    const {data: stakedInfos} = useQueryStakedBalances()

    const currentTokenBalance: TokenBalance = useMemo(() => stakedInfos?.map(info => {
        return {
            tokenSymbol: info?.tokenSymbol,
            balance: info?.amount,
        }
    })?.find(
        (e) => e.tokenSymbol === currentDelegationState.tokenSymbol,
    ), [stakedInfos, currentDelegationState.tokenSymbol])

    const [priceList] = usePrices() || [];
    const { lpTokenPrice } = useGetLPTokenPrice()

    const price = useMemo(
        () => currentDelegationState?.tokenSymbol === "USDC-WHALE_LP" ? lpTokenPrice :
            priceList?.[
                tokens?.find((e) => e.symbol === currentDelegationState.tokenSymbol)
                    ?.name
                ],
        [priceList, lpTokenPrice, currentDelegationState.tokenSymbol],
    )

    useEffect(() => {
        if (tokenSymbol) {
            const token = whiteListedTokens.find((e) => e.symbol === tokenSymbol)
            if(!token) return
            setCurrentDelegationState({
                ...currentDelegationState,
                tokenSymbol: token.symbol,
                decimals: 6,
                denom: token?.denom,
            })
        }else {
            const token = whiteListedTokens.find((e) => e.symbol === currentDelegationState.tokenSymbol) || whiteListedTokens[0]
            setCurrentDelegationState({
                ...currentDelegationState,
                tokenSymbol: token?.symbol,
                decimals: 6,
                denom: token?.denom,
            })
        }
    }, [tokenSymbol]);

    return (
        <VStack
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
                        await router.push(`/`);
                        setCurrentDelegationState({
                            ...currentDelegationState,
                            amount: 0,
                        });
                    }}
                />
                <Text
                    as="h2"
                    fontSize="24"
                    fontWeight="900"
                    style={{textTransform: 'capitalize'}}
                >
                    Undelegate
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
                                    const denom = whiteListedTokens.find(
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
                    buttonLabel={'Undelegate'}
                    onClick={async () => {
                        if (isWalletConnected) {
                            await submit(ActionType.undelegate,
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

