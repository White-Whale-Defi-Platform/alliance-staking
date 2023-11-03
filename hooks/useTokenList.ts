import {useRecoilValue} from 'recoil';
import {useQuery} from 'react-query';
import {TokenInfo} from 'hooks/useTokenInfo';
import {tabState, TabType} from "state/tabState";
import {NetworkType} from "types/common";

export const useTokenList = () => {
    const tabType = useRecoilValue(tabState)
    let tokenInfoList: TokenInfo[]
    let isLoading: boolean
    if (tabType === TabType.alliance) {
        const {data, isLoading: loading} = useQuery<TokenInfo[]>(
            ['tokenInfo-alliance'],
            async () => {
                const url = `/${NetworkType.mainnet}/white_listed_alliance_token_info.json`;
                const response = await fetch(url);
                return await response?.json();
            },
            {
                refetchOnMount: false,
            },
        )
        tokenInfoList = data
        isLoading = loading
    } else if (tabType === TabType.ecosystem) {
        const {data, isLoading: loading} = useQuery<TokenInfo[]>(
            ['tokenInfo-ecosystem'],
            async () => {
                const url = `/${NetworkType.mainnet}/white_listed_ecosystem_token_info.json`;
                const response = await fetch(url);
                return await response?.json();
            },
            {
                refetchOnMount: false,
            },
        )
        tokenInfoList = data
        isLoading = loading
    } else {
        const {data, isLoading: loading} = useQuery<TokenInfo[]>(
            ['tokenInfo-liquidity'],
            async () => {
                const url = `/${NetworkType.mainnet}/white_listed_liquidity_token_info.json`;
                const response = await fetch(url);
                return await response?.json();
            },
            {
                refetchOnMount: false,
            },
        )
        tokenInfoList = data
        isLoading = loading
    }

    return {tokens: tokenInfoList, isLoading};
};
