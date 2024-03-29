import { useQuery } from 'react-query';

import { TokenInfo } from 'hooks/useTokenInfo';
import { useRecoilValue } from 'recoil';
import { chainState } from 'state/chainState';

export const useAllTokenList = () => {
  const { chainId, network } = useRecoilValue(chainState)

  const { data, isLoading } = useQuery<TokenInfo[]>(
    ['tokenInfo-alliance', chainId, network],
    async () => {
      const url = `/${network}/all_white_listed_tokens.json`;
      const response = await fetch(url);
      return await response?.json();
    },
    {
      enabled: Boolean(chainId) && Boolean(network),
      refetchOnMount: false,
    },
  )

  return { tokens: data,
    isLoading };
};
