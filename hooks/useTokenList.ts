import { useQuery } from 'react-query';

import { TokenInfo } from 'hooks/useTokenInfo';
import { useRecoilValue } from 'recoil';
import { chainState } from 'state/chainState';
import { tabState, TabType } from 'state/tabState';

export const useTokenList = () => {
  const { chainId, network } = useRecoilValue(chainState)
  const tabType = useRecoilValue(tabState)
  const fetchTokenInfo = async (url: string) => {
    const response = await fetch(url);
    return await response?.json();
  }

  // Determine the URL based on the tabType
  let url : string
  if (tabType === TabType.alliance) {
    url = `/${network}/white_listed_alliance_token_info.json`;
  } else if (tabType === TabType.ecosystem) {
    url = `/${network}/white_listed_ecosystem_token_info.json`;
  } 

  const { data: tokenInfoList, isLoading } = useQuery<TokenInfo[]>(
    ['tokenInfo', chainId, network, tabType], // The query key includes tabType to ensure uniqueness
    () => fetchTokenInfo(url),
    {
      enabled: Boolean(chainId) && Boolean(network) && Boolean(url),
      refetchOnMount: false,
    },
  )

  return { tokens: tokenInfoList,
    isLoading }
};
