import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { StargateClient } from '@cosmjs/stargate'
import { useChain } from '@cosmos-kit/react-lite'
import { useAllTokenList } from 'hooks/useAllTokenList'
import { useClients } from 'hooks/useClients'
import whiteListedAllianceTokens from 'public/mainnet/white_listed_alliance_token_info.json'
import whiteListedEcosystemTokens from 'public/mainnet/white_listed_ecosystem_token_info.json'
import { useRecoilValue } from 'recoil'
import { CW20 } from 'services/cw20'
import { chainState } from 'state/chainState'
import { TabType } from 'state/tabState'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from 'util/constants'
import { convertMicroDenomToDenom } from 'util/conversion'

import { getTokenInfoFromTokenList } from './useTokenInfo'

const fetchTokenBalance = async ({
  client,
  token = {},
  address,
}: {
  client: CosmWasmClient
  token: any;
  address: string;
}) => {
  const { denom, native, token_address: tokenAddress, decimals } = token || {};

  if (!denom && !tokenAddress) {
    return 0
  }

  if (native && client) {
    const coin = await client.getBalance(address, denom);
    const amount = coin ? Number(coin.amount) : 0;
    return convertMicroDenomToDenom(amount, decimals);
  }
  if (tokenAddress) {
    try {
      const balance = await CW20(client, null).use(tokenAddress).
        balance(address)
      return convertMicroDenomToDenom(Number(balance), decimals)
    } catch (err) {
      return 0
    }
  }
  return 0;
}

const fetchTokenBalances = async ({
  client,
  tokenSymbols,
  address,
  tokens,
  stargateClient,
}: {
  client: CosmWasmClient
  tokenSymbols: Array<string>
  address: string;
  tokens: any
  stargateClient: StargateClient
}) => {
  const nativeBalances = await stargateClient?.getAllBalances(address)
  return await Promise.all(tokenSymbols.map(async (symbol) => {
    const token = getTokenInfoFromTokenList(symbol, tokens)
    if (!token?.native) {
      return await fetchTokenBalance({
        client,
        token,
        address,
      })
    } else {
      return convertMicroDenomToDenom((nativeBalances.find((b) => b.denom === token.denom)?.amount || 0), token.decimals)
    }
  }))
}

export const useAllianceTokenBalance = () => {
  const { walletChainName } = useRecoilValue(chainState)
  const { isWalletConnected, address } = useChain(walletChainName)
  const { cosmWasmClient: client, stargateClient } = useClients()
  const { tokensList } = useAllTokenList()
  const tokenSymbols = whiteListedAllianceTokens.map((e) => e.symbol)
  const queryKey = useMemo(() => 'allianceTokenBalances',
    [tokenSymbols])

  const { data, isLoading } = useQuery(
    [queryKey, address, isWalletConnected],
    async () => await fetchTokenBalances({
      client,
      tokenSymbols,
      address,
      tokens: tokensList,
      stargateClient,
    }),
    {
      enabled: Boolean(isWalletConnected &&
        tokenSymbols &&
        tokensList &&
        address && client && stargateClient),

      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
      onError(error) {
        console.error('Cannot fetch token balance bc:', error);
      },
    },
  )
  return {
    data,
    isLoading,
  } as const;
}

export const useMultipleTokenBalanceAssetlist = (
  type: string, router?: any, delegations?: any, restakedAssets?: any,
) => {
  const tokenSymbols = type === TabType.ecosystem ? whiteListedEcosystemTokens.map((e) => e.symbol) : whiteListedAllianceTokens.map((e) => e.symbol)
  const isUndelegate = router.pathname.includes('undelegate') || router.pathname.includes('redelegate')

  if (isUndelegate) {
    if (type === TabType.alliance) {
      const val = router.query?.validatorSrcAddress
      if (val) {
        let balances = tokenSymbols.map((e) => (delegations?.delegations.filter((d) => d.delegation.validator_address === val).find((s) => s.token.symbol === e)))
        balances = balances.map((e) => e?.token?.amount ?? 0)
        return balances
      }
    } else if (type === TabType.ecosystem) {
      return tokenSymbols.map((e) => (restakedAssets?.find((s) => s.tokenSymbol === e)?.
        amount ?? 0))
    }
  }
  switch (type) {
    case 'alliance':
      return useAllianceTokenBalance()?.data
    case 'restaking':
      return useRestakeTokenBalance()?.data
  }
}

export const useRestakeTokenBalance = () => {
  const { walletChainName } = useRecoilValue(chainState)
  const { isWalletConnected, address } = useChain(walletChainName)
  const { cosmWasmClient: client, stargateClient } = useClients()
  const { tokensList } = useAllTokenList()
  const tokenSymbols = whiteListedEcosystemTokens.map((e) => e.symbol)
  const queryKey = useMemo(() => 'restakeTokenBalances',
    [tokenSymbols])

  const { data, isLoading } = useQuery(
    [queryKey, address, isWalletConnected],
    async () => await fetchTokenBalances({
      client,
      tokenSymbols,
      address,
      tokens: tokensList,
      stargateClient,
    }),
    {
      enabled: Boolean(isWalletConnected &&
        tokenSymbols &&
        tokensList &&
        address && client && stargateClient),

      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
      onError(error) {
        console.error('Cannot fetch token balance bc:', error);
      },
    },
  )
  return {
    data,
    isLoading,
  } as const
}
