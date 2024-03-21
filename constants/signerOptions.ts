import { Chain } from '@chain-registry/types'
import { GasPrice } from '@cosmjs/stargate'

const getGasPrices = (chainName:string, chain:Chain) => {
  const activeChains = ['migaloo']
  if (activeChains.includes(chainName)) {
    const [feeTokens] = chain.fees.fee_tokens;
    let price = feeTokens
      ? feeTokens.average_gas_price || feeTokens.low_gas_price || feeTokens.fixed_min_gas_price || 0
      : 0;
    // Hardcoded until registry is updated
    if (chainName === 'migaloo') {
      price = 2;
    }

    return {
      gasPrice: GasPrice.fromString(String(price) + chain.fees.fee_tokens[0].denom),
    }
  }
  return null
}
export const signerOptions = {
  signingCosmwasm: (chain: Chain) => getGasPrices(chain.chain_name, chain),
  signingStargate: (chain: Chain) => getGasPrices(chain.chain_name, chain),
}
