export type TokenInfo = {
  id: string;
  chain_id: string;
  token_address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  tags: string[];
  denom: string;
  native: boolean;
};
/* token selector functions */
export const getBaseTokenFromTokenList = (tokenList): TokenInfo | undefined =>
  tokenList?.base_token;

export const getTokenInfoFromTokenList = (
  tokenSymbol: string,
  tokensList: any,
): TokenInfo | undefined => tokensList?.find((x) => x.symbol === tokenSymbol);
/* /token selector functions */

/* returns a selector for getting multiple tokens info at once */
// export const useGetMultipleTokenInfo = () => {
//   const [tokenList] = useTokenList()
//   return useCallback(
//     (tokenSymbols: Array<string>) =>
//       tokenSymbols?.map((tokenSymbol) =>
//         getTokenInfoFromTokenList(tokenSymbol, tokenList?.tokens)
//       ),
//     [tokenList]
//   )
// }

/* hook for token info retrieval based on multiple `tokenSymbol` */
// export const useMultipleTokenInfo = (tokenSymbols: Array<string>) => {
//   const getMultipleTokenInfo = useGetMultipleTokenInfo()
//   return useMemo(
//     () => getMultipleTokenInfo(tokenSymbols),
//     [tokenSymbols, getMultipleTokenInfo]
//   )
// }
