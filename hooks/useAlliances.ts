import useLCDClient from 'hooks/useLCDClient';
import usePrices from 'hooks/usePrices';
import { useQuery } from 'react-query';
import { LCDClient } from '@terra-money/feather.js';
import whiteListedTokens from 'public/mainnet/white_listed_alliance_token_info.json';
import { AllianceAsset } from '@terra-money/feather.js/dist/client/lcd/api/AllianceAPI';
import { convertMicroDenomToDenom } from 'util/conversion';

export interface Alliance {
  name: string;
  weight: number;
  totalDollarAmount: number;
  totalTokens: number;

  takeRate: number;
}
export const useAlliances = () => {
  const client = useLCDClient();
  const [priceList] = usePrices() || [];


  const { data: alliances } = useQuery({
    queryKey: ['alliances', priceList],
    queryFn: () => fetchAlliances(client, priceList),
    enabled: !!client && !!priceList,
    refetchOnMount: true,
  });
  return { alliances };
};

const fetchAlliances = async (client: LCDClient, priceList) => {
  // @ts-ignore
  const allianceAssets: AllianceAsset[] = (
    await client.alliance.alliances('migaloo-1')
  ).alliances;

  const alliances: Alliance[] = whiteListedTokens.map((token) => {
    const alliance = allianceAssets?.find(
      (asset) => asset.denom === token.denom,
    );

    return {
      name: token.symbol,
      weight: Number(alliance?.reward_weight),
      totalDollarAmount:
        convertMicroDenomToDenom(alliance?.total_tokens, token.decimals) *
        priceList[token.name],
      totalTokens: convertMicroDenomToDenom(
        alliance?.total_tokens,
        token.decimals,
      ),
      takeRate: Number(alliance?.take_rate),
    };
  });

  return { alliances };
};
