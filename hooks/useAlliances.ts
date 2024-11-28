import { useQuery } from 'react-query'

import { LCDClient } from '@terra-money/feather.js'
import { AllianceAsset } from '@terra-money/feather.js/dist/client/lcd/api/AllianceAPI'
import { MIGALOO_CHAIN_ID } from 'constants/common'
import { useGetLPTokenPrices } from 'hooks/useGetLPTokenPrices'
import useLCDClient from 'hooks/useLCDClient'
import usePrices from 'hooks/usePrices'
import whiteListedTokens from 'public/mainnet/white_listed_alliance_token_info.json'
import { convertMicroDenomToDenom } from 'util/conversion'

export interface Alliance {
  name: string;
  weight: number;
  totalDollarAmount: number;
  totalTokens: number;
  takeRate: number;
}

const fetchAlliances = async (
  client: LCDClient, priceList, lpTokenPrices,
) => {
  const allianceAssets: AllianceAsset[] = (
    await client.alliance.alliances(MIGALOO_CHAIN_ID)
  ).alliances
  const alliances: Alliance[] = whiteListedTokens.map((token) => {
    const alliance = allianceAssets?.find((asset) => String(asset.denom).toLowerCase() === String(token.denom).toLowerCase());
    return {
      name: token.symbol,
      weight: Number(alliance?.reward_weight) || 0,
      totalDollarAmount:
        convertMicroDenomToDenom(alliance?.total_tokens, token.decimals) *
        (token.name.includes('LP') ? lpTokenPrices[token.name] : priceList[token.name]),
      totalTokens: convertMicroDenomToDenom(alliance?.total_tokens,
        token.decimals),
      takeRate: ((1 - Number(alliance?.take_rate)) ** 105120) * 100 || 0,
    }
  })
  const vA = allianceAssets.find((a) => a.denom === 'factory/migaloo190qz7q5fu4079svf890h4h3f8u46ty6cxnlt78eh486k9qm995hquuv9kd/ualliance')
  alliances.push({ name: 'restaking',
    weight: Number(vA.reward_weight),
    totalDollarAmount: 0,
    totalTokens: 0,
    takeRate: 0 })
  return { alliances }
}

export const useAlliances = () => {
  const client = useLCDClient()
  const [priceList] = usePrices() || []
  const lpTokenPrices = useGetLPTokenPrices()

  const { data: alliances } = useQuery({
    queryKey: ['alliances', priceList, lpTokenPrices],
    queryFn: () => fetchAlliances(
      client, priceList, lpTokenPrices,
    ),
    enabled: Boolean(client) && Boolean(priceList) && Boolean(lpTokenPrices),
    refetchOnMount: true,
  })
  return { alliances }
}
