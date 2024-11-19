import { useQuery } from 'react-query';

import { useChain } from '@cosmos-kit/react-lite';
import { Coins, LCDClient } from '@terra-money/feather.js';
import { MIGALOO_CHAIN_NAME } from 'constants/common'
import useLCDClient from 'hooks/useLCDClient';
import usePrices from 'hooks/usePrices';
import { num } from 'libs/num';
import tokens from 'public/mainnet/white_listed_alliance_token_info.json'
import { TabType } from 'state/tabState'

const getAllianceDelegations = async (client: LCDClient | null, delegatorAddress: string) => (await client?.alliance.alliancesDelegation(delegatorAddress)).delegations

export const getDelegation = async (
  client: LCDClient | null,
  priceList: any,
  delegatorAddress: string,
  allianceDelegation: any,
): Promise<any> => {
  if (!client) {
    return Promise.resolve([]);
  }
  // This needs to be reworked such that if denom is whale we use client.distribution.rewards instead
  const getRewards = (delegations: any) => Promise.all(delegations?.map(async (item: any) => {
    const { delegator_address: delegatorAddress, validator_address: validatorAddress, denom } = item.delegation;

    return item.type === 'native'
      ? await client?.distribution.
        getReqFromAddress(delegatorAddress).
        get<{ rewards?: any }>(`/cosmos/distribution/v1beta1/delegators/${delegatorAddress}/rewards/${validatorAddress}`,
          {}).
        then(({ rewards }) => ({
          ...item,
          rewards,
        })).
        catch(() => ({
          ...item,
          rewards: null,
        }))
      : await client?.alliance.
        getReqFromAddress(delegatorAddress).
        get<{ rewards?: Coins }>(`/terra/alliances/rewards/${delegatorAddress}/${validatorAddress}/${denom}`,
          {}).
        then(({ rewards }) => ({
          ...item,
          rewards,
        })).
        catch(() => ({
          ...item,
          rewards: null,
        }));
  }));

  const nativeStake = (await client.staking.delegations(delegatorAddress))[0]
  const delegations = [
    ...nativeStake.map((item: any) => ({
      type: 'native',
      delegation: {
        delegator_address: item.delegator_address || 0,
        validator_address: item.validator_address || 0,
        denom: item.balance.denom || '',
      },
      balance: {
        denom: item.balance.denom || '',
        amount: `${String(item.balance.amount)}` || 0,
      },
    })),
    ...allianceDelegation.map((item: any) => ({
      type: TabType.alliance,
      delegation: item.delegation,
      balance: item.balance,
    })),
  ]
  // This needs to be reworked such that we are working on a list of delegations from both modules
  return getRewards(delegations).
    then((data) => data?.map((item) => {
      const delegatedToken = tokens.find((token) => token.denom === item.delegation?.denom);
      // If item type is native we need to return the uwhale token with 0 amount
      const rewardTokens = item.rewards.map((r) => {
        const token = tokens.find((t) => t.denom === r.denom)
        return {
          amount: r?.amount,
          name: token?.name,
          decimals: token.decimals,
          denom: token.denom,
        }
      })
      // Delegation amount
      const amount = delegatedToken
        ? num(item.balance?.amount).
          div(10 ** delegatedToken.decimals).
          toNumber()
        : 0
      const dollarValue = delegatedToken
        ? num(amount).times(priceList[delegatedToken.name]).
          dp(2).
          toNumber()
        : 0

      const rewards = rewardTokens.map((rt) => {
        const amount = num(rt.amount).
          div(10 ** rt.decimals).
          toNumber();
        return {
          amount,
          dollarValue: num(amount).times(priceList[rt.name]).
            dp(3).
            toNumber(),
          denom: rt.denom,
        }
      })
      return {
        ...item,
        rewards,
        token: {
          ...delegatedToken,
          amount,
          dollarValue,
        },
      }
    })).
    then((data) => {
      // Sum to total delegation
      const totalDelegation = data.reduce((acc, item) => {
        const { dollarValue } = item.token;
        return {
          dollarValue: acc.dollarValue + dollarValue,
        }
      },
      { dollarValue: 0 })
      return {
        delegations: data,
        totalDelegation: totalDelegation?.dollarValue?.toFixed(2),
      }
    })
}

const useDelegations = () => {
  const { address } = useChain(MIGALOO_CHAIN_NAME)
  const client = useLCDClient()
  const [priceList] = usePrices() || []
  const { data: getAllianceDelegations } = useAllianceDelegations({ address })
  return useQuery({
    queryKey: ['delegations', priceList, address],
    queryFn: () => getDelegation(
      client, priceList, address, getAllianceDelegations,
    ),
    enabled: Boolean(client) && Boolean(address) && Boolean(priceList) && Boolean(getAllianceDelegations),
  })
}

const useAllianceDelegations = ({ address }) => {
  const client = useLCDClient()
  return useQuery({
    queryKey: ['allianceDelegations', address],
    queryFn: () => getAllianceDelegations(client, address),
    enabled: Boolean(client) && Boolean(address),
  })
}

export default useDelegations
