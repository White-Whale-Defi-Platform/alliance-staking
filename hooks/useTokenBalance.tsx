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
}: {
    client: CosmWasmClient
    tokenSymbols: Array<string>
    address: string;
    tokens: any
}) => await Promise.all(tokenSymbols.map(async (symbol) => {
  const token = getTokenInfoFromTokenList(symbol, tokens)
  const balance = await fetchTokenBalance({
    client,
    token,
    address,
  })
  return balance || 0
}))

export const useMultipleTokenBalance = (tokenSymbols?: Array<string>) => {
  const { walletChainName } = useRecoilValue(chainState)
  const { isWalletConnected, address } = useChain(walletChainName)
  const { cosmWasmClient: client } = useClients()
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
  return { data,
    isLoading } as const;
}
