import {useQuery} from "react-query";
import file from "public/mainnet/contract_addresses.json"
import tokens from "public/mainnet/tokens.json";
import {convertMicroDenomToDenom} from "util/conversion";
import {TabType} from "state/tabState";
import {useChain} from "@cosmos-kit/react-lite";
import {MIGALOO_CHAIN_NAME} from "constants/common";
import {useClients} from "hooks/useClients";
import {CosmWasmClient} from "@cosmjs/cosmwasm-stargate";

interface Asset {
    native: string
    cw20: string
}

interface RawRewardInfo {
    reward_asset: Asset
    rewards: string
    staked_asset: Asset
}

export interface RewardInfo {
    tabType: TabType
    tokenSymbol: string
    name: string
    denom: string
    amount: number
}
const getRewards = async (contractAddress: string, address: string, client: CosmWasmClient): Promise<RewardInfo[]> => {
    const msg = {
        all_pending_rewards: {
            address: address
        }
    }
    const rawRewards : RawRewardInfo[] = await client.queryContractSmart(contractAddress, msg)
    return rawRewards.map((info) => {
        const stakedToken = tokens?.find((token) => token.denom === (info?.staked_asset?.native ?? info?.staked_asset?.cw20))
        const rewardToken = tokens?.find((token) => token.denom === (info?.reward_asset?.native ?? info?.reward_asset?.cw20))

        return {
            tabType: stakedToken.tabType as TabType,
            tokenSymbol: rewardToken?.symbol,
            name: rewardToken?.name,
            denom: rewardToken?.denom,
            amount: convertMicroDenomToDenom(info?.rewards, 6),
        }
    }).filter((info) => info !== null)
        .reduce((acc, current) => {
            const existingEntry = acc?.find((entry) => entry.tabType === current.tabType && entry.tokenSymbol === current.tokenSymbol);
            if (existingEntry) {
                existingEntry.amount += current.amount // Add up the amounts
            } else {
                acc.push(current) // Add new entry
            }
            return acc
        }, [])
}
export const useQueryRewards = () => {
    const { address} = useChain(MIGALOO_CHAIN_NAME)
    const { cosmWasmClient: client } = useClients()
    const {data, isLoading} = useQuery({
        queryKey: ['rewards', file.alliance_contract, address],
        queryFn: () => getRewards(file.alliance_contract, address, client),
        refetchInterval: 60000,
        enabled: Boolean(file.alliance_contract) && Boolean(client) && Boolean(address),
    })
    return {data, isLoading}
}
