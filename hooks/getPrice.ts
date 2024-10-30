import { LCDClient } from '@terra-money/feather.js'
import { num } from 'libs/num'
import tokens from 'public/mainnet/tokens.json'

type PoolInfo = {
  denom: string
  decimals: number
  contract: string
  base?: boolean
  basedOn?: string
  chainId: string
  name: string
  symbol: string
}

type TokenPrice = {
  [key: string]: number
}

const getLCDClient = () => new LCDClient({
  'migaloo-1': {
    lcd: 'https://migaloo-api.polkachu.com/',
    chainID: 'migaloo-1',
    gasAdjustment: 0.1,
    gasPrices: { uwhale: 0.05 },
    prefix: 'migaloo',
  },
  'phoenix-1': {
    lcd: 'https://terra-api.polkachu.com/',
    chainID: 'phoenix-1',
    gasAdjustment: 1.75,
    gasPrices: { uluna: 0.015 },
    prefix: 'terra',
  },
  'osmosis-1': {
    lcd: 'https://osmosis-api.polkachu.com/',
    chainID: 'osmosis-1',
    gasAdjustment: 1.75,
    gasPrices: { uosmo: 0.0025 },
    prefix: 'osmo',
  },
  'juno-1': {
    lcd: 'https://juno-api.lavenderfive.com/',
    chainID: 'juno-1',
    gasAdjustment: 0.1,
    gasPrices: { ujuno: 0.075 },
    prefix: 'juno',
  },
  'injective-1': {
    lcd: 'https://injective-api.polkachu.com/',
    chainID: 'injective-1',
    gasAdjustment: 0.1,
    gasPrices: { inj: 160_000_000 },
    prefix: 'inj',
  },
})

const getPriceFromPool = async (
  {
    denom,
    decimals,
    contract,
    base,
    basedOn,
  }: PoolInfo, prices: any, basePrice?: TokenPrice,
): Promise<number> => {
  const client = getLCDClient()
  if (base) {
    const token = tokens.find((token) => token.denom === denom)
    return prices?.[token?.coinGeckoId]?.usd ?? 1
  }
  if (!contract) {
    return 0
  }
  return client.wasm.
    contractQuery(contract, { pool: {} }).
    then((response: any) => {
      const [asset1, asset2] = response?.assets || []
      const asset1Denom =
        asset1.info.native_token?.denom || asset1.info.token?.contract_addr
      const token1 = tokens.find((token) => token.denom === (asset1.info.native_token?.denom ?? asset1.info.token?.contract_addr))
      const token2 = tokens.find((token) => token.denom === (asset2.info.native_token?.denom ?? asset2.info.token?.contract_addr))
      const isAB = tokens.some((t) => t.base && t.denom === asset1Denom)

      if (!basePrice || !basedOn) {
        return 0
      }
      if (isAB) {
        return num(asset1.amount / (10 ** (token1?.decimals || 6))).
          div(asset2.amount / (10 ** (token2?.decimals || 6))).
          times(basePrice[basedOn]).
          dp((10)).
          toNumber() || 0
      } else {
        return num(asset2?.amount / (10 ** (token2?.decimals || 6))).
          div(asset1?.amount / (10 ** (token1?.decimals || 6))).
          times(basePrice[basedOn]).
          dp(decimals).
          toNumber() || 0
      }
    })
}

const getPrice = async (tokens: PoolInfo[], basePrice?: TokenPrice) => {
  const apiPrices = await getPricesAPI()
  const promises = tokens.map((token) => getPriceFromPool(
    token, apiPrices, basePrice,
  ))
  const results = await Promise.all(promises).then((prices) => {
    const tokenPrice: TokenPrice = {}
    tokens.forEach((token, index) => {
      tokenPrice[token.name] = prices[index]
    })
    return tokenPrice
  })
  const missingTokens = []
  for (const res in results) {
    if (results[res] === 0 && !res.includes('-LP')) {
      missingTokens.push(tokens.find((token) => token.name === res))
    }
  }
  if (missingTokens.length > 0) {
    // Get missing prices from api
    const ids = new Set()
    missingTokens.forEach((token) => ids.add(token.chainId))

    for (const chain of [...ids]) {
      let data
      try {
        const response = await fetch(`https://9c0pbpbijhepr6ijm4lk85uiuc.ingress.europlots.com/api/prices/pools/${chain}`)
        data = await response.json()
      } catch (error) {
        console.error(`Error fetching data for chain ${chain}:`, error)
        continue;
      }

      const prices = data?.data;
      missingTokens.forEach((token) => {
        if (token.chainId == chain) {
          results[token.name] = prices?.[token.name]?.price || 0
        }
      });
    }
  }
  return results
}

export const getTokenPrice = async (): Promise<[TokenPrice, number]> => {
  // Group by base tokens to make sure we get base price before other tokens
  const baseTokens = tokens.filter((token) => token.base)
  const otherTokens = tokens.filter((token) => !token.base)
  const basePrice = await getPrice(baseTokens)
  const otherPrice = await getPrice(otherTokens, basePrice)
  return [{
    ...basePrice,
    ...otherPrice,
  }, new Date().getTime()]
}

export const getPricesAPI = async () => {
  const pricesResponse = await fetch('https://9c0pbpbijhepr6ijm4lk85uiuc.ingress.europlots.com/api/prices')

  const guppyWhalePoolResponse = await fetch('https://migaloo-api.polkachu.com/cosmwasm/wasm/v1/contract/migaloo14p3r422qp04p345mnqe5umjy3vqx75hpxf54f8enf59wf27fksvqltavjp/smart/eyJwb29sIjp7fX0=')

  if (!pricesResponse.ok) {
    throw new Error(`Failed to fetch prices: ${pricesResponse.status}`)
  }

  if (!guppyWhalePoolResponse.ok) {
    throw new Error(`Failed to fetch guppy whale pool: ${guppyWhalePoolResponse.status}`)
  }

  const guppyWhalePool = await guppyWhalePoolResponse.json()
  const [guppy, whale] = guppyWhalePool?.data?.assets || []
  const prices = (await pricesResponse.json()).data
  const whalePrice = prices['white-whale']?.usd ?? 0

  if (!guppy || !whale) {
    throw new Error('Guppy or whale data is missing')
  }

  prices.guppy = { usd: Number(((Number(whale?.amount ?? 0)) / (Number(guppy?.amount ?? 0))) * (Number(whalePrice) ?? 0)).toFixed(10) }
  return prices
}
