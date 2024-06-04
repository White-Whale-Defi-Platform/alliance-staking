import { useQuery } from 'react-query';

import { TokenInfo } from 'hooks/useTokenInfo';
import { useRecoilValue } from 'recoil';
import { chainState } from 'state/chainState';

export const useAllTokenList = () => {
  const { chainId, network } = useRecoilValue(chainState)

  const { data, isLoading } = useQuery<TokenInfo[]>(
    ['tokenInfo-alliance', chainId, network],
    async () => {
      const url = `/${network}/white_listed_alliance_token_info.json`;
      const response =  await (await fetch(url))?.json();
      const url2 = `/${network}/white_listed_ecosystem_token_info.json`;
      const response2 = await (await fetch(url2))?.json();
      const out = [...response, ...response2];
      return out;
    },
    {
      enabled: Boolean(chainId) && Boolean(network),
      refetchOnMount: false,
    },
  )

  return { tokensList: data,
    isLoading };
};
