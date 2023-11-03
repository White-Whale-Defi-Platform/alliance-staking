import React, {useEffect, useMemo, useState} from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs, VStack} from '@chakra-ui/react';
import {useRecoilState} from 'recoil';
import {Token} from 'components/Pages/AssetOverview';
import {useMultipleTokenBalance} from 'hooks/useTokenBalance';
import whiteListedAllianceTokens from 'public/mainnet/white_listed_alliance_token_info.json'
import whiteListedEcosystemTokens from 'public/mainnet/white_listed_ecosystem_token_info.json'
import whiteListedLiquidityTokens from 'public/mainnet/white_listed_liquidity_token_info.json'
import useDelegations from 'hooks/useDelegations';
import usePrices from 'hooks/usePrices';
import {useAlliances} from 'hooks/useAlliances';
import {useTotalYearlyWhaleEmission} from 'hooks/useWhaleInfo';
import useUndelegations from 'hooks/useUndelegations';
import useValidators from 'hooks/useValidators';
import {AllianceTab} from "components/Pages/Alliance/AllianceTab";
import {EcosystemTab} from "components/Pages/Ecosystem/EcosystemTab";
import {LiquidityTab} from "components/Pages/Liquidity/LiquidityTab";
import {tabState, TabType} from "state/tabState";
import {useQueryRewards} from "hooks/useQueryRewards";
import {useQueryStakedBalances} from "hooks/useQueryStakedBalances";
import {calculateAllianceData} from "components/Pages/Alliance/hooks/alliance/calculateAllianceData";
import {calculateEcosystemData} from "components/Pages/Ecosystem/calculateEcosystemData";
import {calculateLiquidityData} from "components/Pages/Liquidity/calculateLiquidityData";
import {useGetLPTokenPrice} from "hooks/useGetLPTokenPrice";
import {useChain} from "@cosmos-kit/react-lite";
import {MIGALOO_CHAIN_ID, MIGALOO_CHAIN_NAME} from "constants/common";

export interface Reward {
    amount: number;
    denom: string;
    dollarValue: number;
}

export enum ActionType {
    delegate,
    redelegate,
    undelegate,
    claim,
    updateRewards
}

export type TokenData = {
    color: string;
    value: number;
    dollarValue: number;
    token?: Token;
    tokenSymbol?: string;
};

export interface DelegationData {
    delegated: TokenData[];
    undelegated: TokenData[];
    liquid: TokenData[];
    rewards: any;
    total?: TokenData[];
}

const Dashboard = () => {
    const {isWalletConnected, address} = useChain(MIGALOO_CHAIN_NAME)

    const rawAllianceTokenData = useMemo(() => {
        return whiteListedAllianceTokens.map((t) => ({
            token: Token[t.symbol],
            tokenSymbol: t.symbol,
            name: t.name,
            dollarValue: 0,
            value: 0,
            color: t.color,
        }));
    }, [whiteListedAllianceTokens])

    const rawLiquidityTokenData = useMemo(() => {
        return whiteListedLiquidityTokens?.map((t) => ({
            token: Token[t.symbol],
            tokenSymbol: t.symbol,
            name: t.name,
            dollarValue: 0,
            value: 0,
            color: t.color,
        }));
    }, [whiteListedAllianceTokens])

    const rawEcosystemTokenData = useMemo(() => {
        return whiteListedEcosystemTokens.map((t) => ({
            token: Token[t.symbol],
            tokenSymbol: t.symbol,
            name: t.name,
            dollarValue: 0,
            value: 0,
            color: t.color,
        }));
    }, [whiteListedAllianceTokens])


    const allianceRewardsTokenData = useMemo(() => {
        return whiteListedAllianceTokens.map((t) => ({
            token: Token[t.symbol],
            tokenSymbol: t.symbol,
            name: t.name,
            dollarValue: 0,
            value: 0,
            totalRewardDollarValue: 0,
            rewards: [],
        }));
    }, [whiteListedAllianceTokens])

    const ecosystemRewardsTokenData = useMemo(() => {
        return whiteListedEcosystemTokens.map((t) => ({
            token: Token[t.symbol],
            tokenSymbol: t.symbol,
            name: t.name,
            dollarValue: 0,
            value: 0,
            totalRewardDollarValue: 0,
            rewards: [],
        }));
    }, [whiteListedAllianceTokens])

    const liquidityRewardsTokenData = useMemo(() => {
        return whiteListedLiquidityTokens.map((t) => ({
            token: Token[t.symbol],
            tokenSymbol: t.symbol,
            name: t.name,
            dollarValue: 0,
            value: 0,
            totalRewardDollarValue: 0,
            rewards: [],
        }));
    }, [whiteListedAllianceTokens])

    const [priceList] = usePrices() || []

    // TODO: useDelegations should return 1 list of delegations which includes both native staking and alliance staking entries for the given address
    const {data} = useDelegations({address})

    const {data : stakedBalances} = useQueryStakedBalances()

    const delegations = useMemo(() => data?.delegations || [], [data])

    const {data: allianceBalances} = useMultipleTokenBalance(
        whiteListedAllianceTokens?.map((e) => e.symbol),
    )
    const {data: ecosystemBalances} = useMultipleTokenBalance(
        whiteListedEcosystemTokens?.map((e) => e.symbol),
    )

    const {data: liquidityBalances} = useMultipleTokenBalance(
        whiteListedLiquidityTokens?.map((e) => e.symbol),
    )

    const {alliances: allianceData} = useAlliances()
    const {totalYearlyWhaleEmission} = useTotalYearlyWhaleEmission()

    const {data: validatorData} = useValidators({address});

    const whalePrice = priceList?.['Whale']

    const alliances = useMemo(
        () => allianceData?.alliances || [],
        [allianceData?.alliances],
    )

    const {data: undelegationData} = useUndelegations({address})
    const undelegations = useMemo(
        () => undelegationData?.undelegations || [],
        [undelegationData],
    )
    const summedAllianceWeights = useMemo(
        () =>
            alliances
                ?.map((alliance) => {
                    return Number(alliance?.weight)
                })
                ?.reduce((acc, e) => acc + (isNaN(e) ? 0 : e), 0),
        [alliances],
    )

    const allianceAPRs = useMemo(() => {
        return alliances?.map((alliance) => {
            if (alliance.name === 'WHALE') {
                const apr = Number(
                    ((totalYearlyWhaleEmission * (1 - summedAllianceWeights)) /
                        (validatorData?.stakedWhale | 0)) *
                    100,
                )
                return {
                    name: 'WHALE',
                    apr: apr,
                };
            } else {
                const apr = !isNaN(alliance.totalDollarAmount)
                    ? ((totalYearlyWhaleEmission * whalePrice * alliance?.weight) /
                        alliance?.totalDollarAmount) *
                    100
                    : 0;
                return {
                    name: alliance.name,
                    apr: apr,
                }
            }
        })
    }, [alliances, totalYearlyWhaleEmission, whalePrice])

    const [currentTab, setCurrentTab] = useRecoilState(tabState)

    const setTabType = (index: number) => {
        switch (index) {
            case 0:
                setCurrentTab(TabType.alliance)
                break;
            case 1:
                setCurrentTab(TabType.ecosystem)
                break;
            case 2:
                setCurrentTab(TabType.liquidity)
                break;
        }
    }

    const tabTypeToIndex = (tabType: TabType) => {
        switch (tabType) {
            case TabType.alliance:
                return 0
            case TabType.ecosystem:
                return 1
            case TabType.liquidity:
                return 2
        }
    }

    const [updatedAllianceData, setAllianceData] = useState<DelegationData>({
        delegated: rawAllianceTokenData,
        undelegated: rawAllianceTokenData,
        liquid: rawAllianceTokenData,
        rewards: allianceRewardsTokenData,
        total: rawAllianceTokenData,
    })
    const [updatedEcosystemData, setEcosystemData] = useState({
        delegated: rawEcosystemTokenData,
        liquid: rawEcosystemTokenData,
        rewards: ecosystemRewardsTokenData,
        total: rawEcosystemTokenData,
    })

    const [updatedLiquidityData, setLiquidityData] = useState({
        delegated: rawLiquidityTokenData,
        liquid: rawLiquidityTokenData,
        rewards: liquidityRewardsTokenData,
        total: rawLiquidityTokenData,
    })

    const {data: rewards} = useQueryRewards()


    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        calculateAllianceData(rawAllianceTokenData, priceList, allianceBalances, delegations, undelegations, setAllianceData)
    }, [allianceBalances, delegations, rawAllianceTokenData, allianceRewardsTokenData, undelegations, priceList])

    useEffect(() => {
        calculateEcosystemData(rawEcosystemTokenData, priceList, ecosystemBalances, stakedBalances,rewards, setEcosystemData)
    }, [ecosystemBalances,stakedBalances, rewards, rawEcosystemTokenData, ecosystemRewardsTokenData, priceList])

    const { lpTokenPrice } = useGetLPTokenPrice()
    useEffect(() => {
        calculateLiquidityData(rawLiquidityTokenData, lpTokenPrice, liquidityBalances, stakedBalances, rewards, setLiquidityData)
    }, [liquidityBalances, delegations, rawLiquidityTokenData, liquidityRewardsTokenData, priceList, lpTokenPrice])



    useEffect(() => {
        setLoading(
            updatedAllianceData === null ||
            !priceList,
        )

    }, [updatedAllianceData, priceList]);

    return (
        <VStack
            pt={12}
            w="full"
            alignSelf="start"
            alignItems={'flex-start'}
            justifyContent={"center"}
            justify={'center'}>
                <Tabs variant={'brand'} index={tabTypeToIndex(currentTab)} onChange={(index)=>setTabType(index)}>
                    <TabList
                        display={['flex']}
                        flexWrap={['wrap']}
                        justifyContent="center"
                        borderRadius={30}
                        h={'49px'}
                        mt={-137}>
                        <Tab>Alliance</Tab>
                        <Tab>Ecosystem</Tab>
                        <Tab>Liquidity</Tab>
                    </TabList>
                    <TabPanels p={4}>
                        <TabPanel >
                            <AllianceTab isWalletConnected={isWalletConnected} isLoading={isLoading} address={address}
                                         updatedData={updatedAllianceData} allianceAPRs={allianceAPRs}/>
                        </TabPanel>
                        <TabPanel>
                            <EcosystemTab isWalletConnected={isWalletConnected} isLoading={isLoading} address={address} updatedData={updatedEcosystemData}/>
                        </TabPanel>
                        <TabPanel>
                           <LiquidityTab isWalletConnected={isWalletConnected} isLoading={isLoading} address={address} updatedData={updatedLiquidityData}/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
        </VStack>
    )
}

export default Dashboard;
