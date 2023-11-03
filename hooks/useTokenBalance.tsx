import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { convertMicroDenomToDenom } from 'util/conversion'

import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from 'util/constants'
import { getTokenInfoFromTokenList } from './useTokenInfo'
import { useTokenList } from './useTokenList'
import {CW20} from "services/cw20"
import {useChain} from "@cosmos-kit/react-lite"
import {MIGALOO_CHAIN_NAME} from "constants/common"
import {useClients} from "hooks/useClients"
import {CosmWasmClient} from "@cosmjs/cosmwasm-stargate"

async function fetchTokenBalance({
  client,
  token = {},
  address,
}: {
  client: CosmWasmClient
  token: any;
  address: string;
}) {
  const { denom, native, token_address, decimals } = token || {};

  if (!denom && !token_address) {
    return 0
  }

  if (native && !!client) {
    const coin = await client.getBalance(address, denom);
    const amount = coin ? Number(coin.amount) : 0;
    return convertMicroDenomToDenom(amount, decimals);
  }
  if (token_address) {
    try {
      const balance = await CW20(client, null).
      use(token_address).
      balance(address)
      return convertMicroDenomToDenom(Number(balance), decimals)
    } catch (err) {
      return 0
    }
  }
  return 0;
}

export const useTokenBalance = (tokenSymbol: string) => {
  const { address} = useChain(MIGALOO_CHAIN_NAME)
  const {cosmWasmClient: client} = useClients()

  const { tokens } = useTokenList();
  const tokenInfo = tokens?.filter((e) => e.symbol === tokenSymbol)[0];
  const {
    data: balance = 0,
    isLoading,
    refetch,
  } = useQuery(
    ['tokenBalance', tokenSymbol, address],
    async () => {
      return await fetchTokenBalance({
        client,
        address,
        token: tokenInfo,
      });
    },
    {
      enabled: !!tokenSymbol && !!address && !!client && !!tokenInfo,
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    },
  )

  return { balance, isLoading: isLoading, refetch };
}

export const useMultipleTokenBalance = (tokenSymbols?: Array<string>) => {
  const { address, isWalletConnected } = useChain(MIGALOO_CHAIN_NAME)
  const {cosmWasmClient: client} = useClients()
  const { tokens } = useTokenList();
  const queryKey = useMemo(
    () => `multipleTokenBalances/${tokenSymbols?.join('+')}`,
    [tokenSymbols],
  );

  const { data, isLoading } = useQuery(
    [queryKey, address],
    async () => {
      return await Promise.all(
        tokenSymbols
          .map((tokenSymbol) => {
            return fetchTokenBalance({
              client,
              address,
              token:
                getTokenInfoFromTokenList(tokenSymbol, tokens) ||
                {},
            });
          }),
      );
    },
    {
      enabled: Boolean(
        isWalletConnected &&
          tokenSymbols?.length &&
          tokens &&
          !!address,
      ),

      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,

      onError(error) {
        console.error('Cannot fetch token balance bc:', error);
      },
    },
  );

  return { data, isLoading } as const;
};
