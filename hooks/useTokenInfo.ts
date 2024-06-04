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
  color: string;
}

export const getTokenInfoFromTokenList = (tokenSymbol: string,
  tokensList: any): TokenInfo | undefined => tokensList?.find((x) => x.symbol === tokenSymbol)
