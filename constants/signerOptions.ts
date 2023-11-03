import { Chain } from '@chain-registry/types'
import { GasPrice } from '@cosmjs/stargate'

const getGasPrices = (chain:Chain) => {
    return {
      gasPrice: GasPrice.fromString(String(2) + 'uwhale'),
    }
}
export const signerOptions = {
  signingCosmwasm: (chain: Chain) => getGasPrices(chain),
  signingStargate: (chain: Chain) => getGasPrices(chain),
}
