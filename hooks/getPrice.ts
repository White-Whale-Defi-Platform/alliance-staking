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
    lcd: 'https://ww-migaloo-rest.polkachu.com/',
    chainID: 'migaloo-1',
    gasAdjustment: 0.1,
    gasPrices: { uwhale: 0.05 },
    prefix: 'migaloo',
  },
  'phoenix-1': {
    lcd: 'https://ww-terra-rest.polkachu.com/',
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
    lcd: 'https://ww-juno-rest.polkachu.com',
    chainID: 'juno-1',
    gasAdjustment: 0.1,
    gasPrices: { ujuno: 0.075 },
    prefix: 'juno',
  },
})

const getPriceFromPool = async ({
  denom,
  decimals,
  contract,
  base,
  basedOn,
}: PoolInfo, basePrice?: TokenPrice): Promise<number> => {
  const client = getLCDClient()
  if (base) {
    const token = tokens.find((token) => token.denom === denom)
    const priceData = await fetch('/api/coingecko')
    const prices = (await priceData.json()).data
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
  const promises = tokens.map((token) => getPriceFromPool(token, basePrice))
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
    // get missing prices from api
    const ids = new Set() 
    missingTokens.forEach((token) => ids.add(token.chainId))
    const url = "https://9c0pbpbijhepr6ijm4lk85uiuc.ingress.europlots.com/api/prices/pools/"
    for (const chain of [...ids]) {
      const response = await fetch(url + chain)
      const data = await response.json()
      const prices = data?.data
      missingTokens.map((token) => {
        if (token.chainId == chain) {
        results[token.name] = prices[token.name].price
        }
      })
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
    ...otherPrice
  }, new Date().getTime()]
}
