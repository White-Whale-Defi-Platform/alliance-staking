import { useQuery } from 'react-query';

import { LCDClient } from '@terra-money/feather.js/dist/client/lcd/LCDClient';
import useLCDClient from 'hooks/useLCDClient';
import file from 'public/mainnet/contract_addresses.json'
import tokens from 'public/mainnet/tokens.json'
import { convertMicroDenomToDenom } from 'util/conversion'

interface Response {
    asset : {
        cw20?: string
        native?: string
    }
    balance: string
}

export interface TotalStakedBalance {
    denom: string
    tokenSymbol: string
    name: string
    totalAmount: number
}

export const fetchTotalStakedBalances = async (client: LCDClient) => {
  if (!client) {
    return null
  }
  const msg = {
    total_staked_balances: {},
  }
  const res: Response[] = await client.wasm.contractQuery(file.alliance_contract, msg)
  const totalStakedBalances = res.map((info) => {
    const token = tokens.find((token) => token.denom === (info?.asset?.native ?? info?.asset?.cw20))
    if (!token) {
      return {
        denom: (info?.asset?.native ?? info?.asset?.cw20),
        tokenSymbol: (info?.asset?.native ?? info?.asset?.cw20),
        name: (info?.asset?.native ?? info?.asset?.cw20),
        totalAmount: convertMicroDenomToDenom(info?.balance, 6),
      } as TotalStakedBalance
    }
    return {
      denom: token.denom,
      name: token.name,
      tokenSymbol: token.symbol,
      totalAmount: convertMicroDenomToDenom(info.balance, token?.decimals ?? 6),
    } as TotalStakedBalance
  })
  return { totalStakedBalances }
}
export const useGetTotalStakedBalances = () => {
  const client = useLCDClient()
  const { data, isLoading } = useQuery({
    queryKey: 'totalStakeBalances',
    queryFn: () => fetchTotalStakedBalances(client),
    enabled: Boolean(client),
  })
  return { ...data,
    isLoading }
}
