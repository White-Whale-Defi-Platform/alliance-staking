import React, { useEffect, useMemo, useState} from 'react';
import {HStack, Text, VStack} from '@chakra-ui/react';
import {useRecoilState} from 'recoil';
import {walletState, WalletStatusType} from 'state/atoms/walletAtoms';
import CardComponent from 'components/Pages/Delegations/CardComponent';
import AssetOverview, {Token, TokenType} from './AssetOverview';
import RewardsComponent from 'components/Pages/Delegations/RewardsComponent';
import Validators from 'components/Pages/Delegations/Validators';
import {useMultipleTokenBalance} from 'hooks/useTokenBalance';
import whiteListedTokens from 'public/mainnet/white_listed_token_info.json';
import useDelegations from 'hooks/useDelegations';
import {TOKENS_TO_EXCLUDE_BY_SYMBOL} from 'constants/staking';
import usePrice from 'hooks/usePrice';
import {useAlliances} from "hooks/useAlliances";
import {useTotalYearlyWhaleEmission} from "hooks/useMigaloo";
import {useWhalePrice} from "queries/useGetTokenDollarValueQuery";
import useUndelegations from "hooks/useUndelegations";


interface Reward {
    amount: number,
    denom: string,
    dollarValue: number
}
export enum ActionType {
    delegate,
    redelegate,
    undelegate,
    claim,
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
}

const Dashboard = () => {
    const [{status, address}] = useRecoilState(walletState);
    const isWalletConnected: boolean = status === WalletStatusType.connected;

    const filteredTokens = useMemo(
        () => whiteListedTokens.filter((token) => !TOKENS_TO_EXCLUDE_BY_SYMBOL.includes(token.symbol)),
        []
    );

    const rawTokenData = useMemo(() => {
        return filteredTokens.map((t) => ({
            token: Token[t.symbol],
            tokenSymbol: t.symbol,
            name: t.name,
            dollarValue: 0,
            value: 0,
            color: t.color,
        }));
    }, [filteredTokens]);

    const rewardsTokenData = useMemo(() => {
        return whiteListedTokens.map((t) => ({
            token: Token[t.symbol],
            tokenSymbol: t.symbol,
            name: t.name,
            dollarValue: 0,
            value: 0,
            totalRewardDollarValue: 0,
            rewards: [],
        }));
    }, []);

    const [priceList] = usePrice() || [];
    // TODO: useDelegations should return 1 list of delegations which includes both native staking and alliance staking entries for the given address
    const {data, isLoading: isDelegationsLoading} = useDelegations({address});
    const delegations = useMemo(() => data?.delegations || [], [data]);
    const {data: balances } = useMultipleTokenBalance(filteredTokens.map((e) => e.symbol));

    const {alliances: allianceData} = useAlliances()
    const {totalYearlyWhaleEmission} = useTotalYearlyWhaleEmission()

    const price = useWhalePrice()
    const alliances = useMemo(() => allianceData?.alliances || [], [allianceData?.alliances]);
    const  {data: undelegationData}  = useUndelegations({address})
    const undelegations = useMemo(() => undelegationData?.undelegations || [], [undelegationData]);

    const allianceAPRs = useMemo(() => {
        return alliances?.map(alliance => {
            return ({
                name: alliance.name,
                apr: !isNaN(alliance.totalDollarAmount) ?
                    ((totalYearlyWhaleEmission * price * alliance?.weight) / alliance?.totalDollarAmount)*100 : 0,
            })
        });
        }, [alliances, totalYearlyWhaleEmission, price]);


    const [updatedData, setData] = useState<DelegationData>({
        delegated: rawTokenData,
        undelegated: rawTokenData,
        liquid: rawTokenData,
        rewards: rewardsTokenData,
    });

    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Calculate data when dependencies change
        if (!priceList || !balances || !delegations) return;

        const liquidData = rawTokenData.map((token, index) => {
            const balance = balances?.[index] !== undefined ? balances?.[index] : 0;
            return {
                ...token,
                dollarValue: priceList && priceList[token.name] ? priceList[token.name] * balance : 0,
                value: balance,
            };
        });

        const calculateDelegationData = (tokenData: any) => {
            
            const allDelegations = delegations.filter((d) => d.token.symbol === tokenData.tokenSymbol);
            const aggregatedDollarValue = allDelegations.reduce((acc, e) => acc + Number( e?.token.dollarValue ?? 0), 0);
            const aggregatedAmount = allDelegations.reduce((acc, e) => acc + Number( e?.token?.amount ?? 0), 0);

            return {
                ...tokenData,
                dollarValue: Number(aggregatedDollarValue),
                value: Number(aggregatedAmount),
            };
        };
        const calculateUndelegationData = (tokenData: any) => {
            const allUndelegations = undelegations.filter((d) => d.symbol === tokenData.tokenSymbol);
            const aggregatedDollarValue = allUndelegations.reduce((acc, e) => acc + Number( e?.dollarValue ?? 0) , 0);
            const aggregatedAmount = allUndelegations.reduce((acc, e) => acc + Number(e?.amount ?? 0), 0);

            return {
                ...tokenData,
                dollarValue: Number(aggregatedDollarValue),
                value: Number(aggregatedAmount),
            };
        };
        const calculateRewardData = () => {
            const allRewards = delegations.map(d=>d.rewards);
            const concatenatedRewards: Reward[] = allRewards.reduce((acc: Reward[], currList: Reward[]) => {
                return acc.concat(currList);
            }, []);

            const aggregatedRewards = whiteListedTokens.map(t=> {

               const sameTokenRewards =  concatenatedRewards.filter(r => r.denom === t.denom)

               const amount = sameTokenRewards?.reduce((acc, e) =>
                    acc + (Number(e?.amount) ?? 0), 0)
                const dollarValue = sameTokenRewards?.reduce((acc, e) =>
                    acc + (Number(e?.dollarValue) ?? 0), 0)
                return {
                   symbol: t.symbol,
                    amount: amount,
                    dollarValue: dollarValue
                }

            })
            return aggregatedRewards;
        };

        const delegatedData = rawTokenData.map((tokenData) => calculateDelegationData(tokenData));

        const undelegatedData = rawTokenData.map((tokenData) => calculateUndelegationData(tokenData));

        const rewardsData = calculateRewardData();

        const delegationData: DelegationData = {
            delegated: delegatedData,
            undelegated: undelegatedData,
            liquid: liquidData,
            rewards: rewardsData,
        };

        setData(delegationData);

    }, [balances, delegations, rawTokenData, rewardsTokenData, undelegations]);

    useEffect(() => {
        setLoading(balances === null || isDelegationsLoading || updatedData === null || !priceList);
    }, [balances, isDelegationsLoading, updatedData, priceList]);

    return (
        <VStack
            pt={12}
            minW={1270}
            alignSelf="center"
            alignItems={'flex-start'}
            spacing={6}>
            <Text
                fontSize={35}
                fontWeight={'bold'}>
                Dashboard
            </Text>
            <HStack
                width="full"
                paddingY={5}
                spacing={10}>
                <CardComponent
                    isWalletConnected={isWalletConnected}
                    isLoading={isLoading}
                    title={'Alliance Token Balances'}
                    tokenData={updatedData?.liquid}/>
                <CardComponent
                    isWalletConnected={isWalletConnected}
                    isLoading={isLoading}
                    title={'Delegations'}
                    tokenData={updatedData?.delegated}/>
                <CardComponent
                    isWalletConnected={isWalletConnected}
                    isUndelegations={true}
                    isLoading={isLoading}
                    title={'Undelegations'} tokenData={updatedData?.undelegated}/>
            </HStack>
            <HStack width="full" spacing={10}>
                <AssetOverview
                    isLoading={isLoading}
                    data={updatedData && updatedData?.delegated}
                    isWalletConnected={isWalletConnected}
                    aprs={allianceAPRs}/>
                <RewardsComponent
                    isWalletConnected={isWalletConnected}
                    isLoading={isLoading}
                    data={updatedData && updatedData[TokenType[TokenType.rewards]]}
                    address={address}/>
            </HStack>
            <Validators address={address}/>
        </VStack>
    )
}

export default Dashboard;