import { useQuery } from 'react-query';

import { LCDClient } from '@terra-money/feather.js';
import { AllianceAsset } from '@terra-money/feather.js/dist/client/lcd/api/AllianceAPI';
import { MIGALOO_CHAIN_ID } from 'constants/common';
import useLCDClient from 'hooks/useLCDClient';
import usePrices from 'hooks/usePrices';
import whiteListedTokens from 'public/mainnet/white_listed_alliance_token_info.json';
import { convertMicroDenomToDenom } from 'util/conversion';

export interface Alliance {
  name: string;
  weight: number;
  totalDollarAmount: number;
  totalTokens: number;

  takeRate: number;
}

const fetchAlliances = async (client: LCDClient, priceList) => {
  const allianceAssets: AllianceAsset[] = (
    await client.alliance.alliances(MIGALOO_CHAIN_ID)
  ).alliances;
  const alliances: Alliance[] = whiteListedTokens.map((token) => {
    const alliance = allianceAssets?.find((asset) => String(asset.denom).toLowerCase() === String(token.denom).toLowerCase());
    return {
      name: token.symbol,
      weight: Number(alliance?.reward_weight),
      totalDollarAmount:
        convertMicroDenomToDenom(alliance?.total_tokens, token.decimals) *
        priceList[token.name],
      totalTokens: convertMicroDenomToDenom(alliance?.total_tokens,
        token.decimals),
      takeRate: Number(alliance?.take_rate) * 1e6,
    };
  });
  return { alliances }
}

export const useAlliances = () => {
  const client = useLCDClient();
  const [priceList] = usePrices() || []

  const { data: alliances } = useQuery({
    queryKey: ['alliances', priceList],
    queryFn: () => fetchAlliances(client, priceList),
    enabled: Boolean(client) && Boolean(priceList),
    refetchOnMount: true,
  });
  return { alliances }
}
