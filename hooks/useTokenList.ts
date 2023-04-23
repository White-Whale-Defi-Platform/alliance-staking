import { useRecoilValue } from 'recoil';
import { walletState } from 'state/atoms/walletAtoms';
import { useQuery } from 'react-query';
import { TokenInfo } from 'hooks/useTokenInfo';

export const useTokenList = () => {
  const { chainId, client, network } = useRecoilValue(walletState);

  const { data: tokenInfoList, isLoading } = useQuery<TokenInfo[]>(
    ['tokenInfo/list', chainId, network],
    async () => {
      const url = `/${network}/white_listed_token_info.json`;
      const response = await fetch(url);
      return await response?.json();
    },
    {
      enabled: !!chainId && !!client,
      refetchOnMount: false,
    },
  );

  return { tokens: tokenInfoList, isLoading };
};
