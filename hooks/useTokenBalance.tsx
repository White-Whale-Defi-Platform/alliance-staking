import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useChain } from '@cosmos-kit/react-lite';
import { useAllTokenList } from 'hooks/useAllTokenList';
import { useClients } from 'hooks/useClients';
import { useRecoilValue } from 'recoil';
import { CW20 } from 'services/cw20';
import { chainState } from 'state/chainState';
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from 'util/constants';
import { convertMicroDenomToDenom } from 'util/conversion';

import { getTokenInfoFromTokenList } from './useTokenInfo';
import { StargateClient } from '@cosmjs/stargate';

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
  const nativeBalances = await stargateClient.getAllBalances(address)
  const out = await Promise.all(tokenSymbols.map(async (symbol) => {
    const token = getTokenInfoFromTokenList(symbol, tokens)
    let balance = 0
    if (!token?.native) {
      balance = await fetchTokenBalance({
        client,
        token,
        address,
      })
    } else {
      balance = convertMicroDenomToDenom((nativeBalances.find((b) => b.denom === token.denom)?.amount || 0), token.decimals)
    }
    return balance || 0
  }))
  return out
}

export const useMultipleTokenBalance = (tokenSymbols?: Array<string>) => {
  const { walletChainName } = useRecoilValue(chainState)
  const { isWalletConnected, address } = useChain(walletChainName)
  const { cosmWasmClient: client, stargateClient } = useClients()
  const { tokens } = useAllTokenList()
  const queryKey = useMemo(() => `multipleTokenBalances/${tokenSymbols?.join('+')}`,
    [tokenSymbols])

  const { data, isLoading } = useQuery(
    [queryKey, address, isWalletConnected],
    async () => await fetchTokenBalances({
      client,
      tokenSymbols,
      address,
      tokens,
      stargateClient
    }),
    {
      enabled: Boolean(isWalletConnected &&
        tokenSymbols &&
        tokens &&
        address && client),

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
    isLoading
  } as const;
}
