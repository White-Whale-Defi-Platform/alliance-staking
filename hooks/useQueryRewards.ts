import { useQuery } from 'react-query';

import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useChain } from '@cosmos-kit/react-lite';
import { MIGALOO_CHAIN_NAME } from 'constants/common';
import { useClients } from 'hooks/useClients';
import file from 'public/mainnet/contract_addresses.json'
import tokens from 'public/mainnet/tokens.json';
import { TabType } from 'state/tabState';
import { convertMicroDenomToDenom } from 'util/conversion';

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
  stakedDenom: string
}
const getRewards = async (
  contractAddress: string, address: string, client: CosmWasmClient,
): Promise<RewardInfo[]> => {
  const msg = {
    all_pending_rewards: {
      address,
    },
  }
  const rawRewards: RawRewardInfo[] = await client.queryContractSmart(contractAddress, msg)
  return rawRewards.map((info) => {
    const stakedToken = tokens?.find((token) => (token.denom === (info?.staked_asset?.native ?? info?.staked_asset?.cw20) && token.tabType === TabType.ecosystem))
    const rewardToken = tokens?.find((token) => (token.denom === (info?.reward_asset?.native ?? info?.reward_asset?.cw20) && token.tabType === TabType.ecosystem))

    return {
      tabType: stakedToken.tabType as TabType,
      tokenSymbol: rewardToken?.symbol,
      name: rewardToken?.name,
      denom: rewardToken?.denom,
      amount: convertMicroDenomToDenom(info?.rewards, rewardToken.decimals),
      stakedDenom: stakedToken?.denom,
    }
  })
}
export const useQueryRewards = () => {
  const { address } = useChain(MIGALOO_CHAIN_NAME)
  const { cosmWasmClient: client } = useClients()
  const { data, isLoading } = useQuery({
    queryKey: ['rewards', file.alliance_contract, address],
    queryFn: () => getRewards(
      file.alliance_contract, address, client,
    ),
    refetchInterval: 15000,
    enabled: Boolean(file.alliance_contract) && Boolean(client) && Boolean(address),
  })
  return {
    data,
    isLoading
  }
}
