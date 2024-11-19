import { useQuery } from 'react-query';

import { LCDClient } from '@terra-money/feather.js/dist/client/lcd/LCDClient';
import useLCDClient from 'hooks/useLCDClient';
import usePrices from 'hooks/usePrices';
import { convertMicroDenomToDenom } from 'util/conversion';

interface Asset {
    amount: string;
    info: {
        native_token: {
            denom: string;
        }
    }
}

interface PoolInfo {
    assets: Asset[]
    total_share: number
}
export const fetchTotalPoolSuppliesAndCalculatePrice = async (client: LCDClient, whalePrice: number) => {
  if (!client) {
    return null
  }
  const whaleUsdcPoolInfo : PoolInfo = await client.wasm.contractQuery('migaloo1xv4ql6t6r8zawlqn2tyxqsrvjpmjfm6kvdfvytaueqe3qvcwyr7shtx0hj', {
    pool: {},
  })

  const whaleBtcPoolInfo : PoolInfo = await client.wasm.contractQuery('migaloo1axtz4y7jyvdkkrflknv9dcut94xr5k8m6wete4rdrw4fuptk896su44x2z', {
    pool: {},
  })
  const windWhalePoolInfo : PoolInfo = await client.wasm.contractQuery('migaloo1sp6jxvrkym8j2zf5uszmmp0huwae43j5hlhagrn38pprazqnzxuqtufyh', {
    pool: {},
  })

  const totalWhaleUsdcDollarAmount = (whaleUsdcPoolInfo?.assets.map((asset) => {
    if (asset.info.native_token.denom === 'uwhale') {
      return convertMicroDenomToDenom(asset.amount, 6) * whalePrice
    } else {
      return convertMicroDenomToDenom(asset.amount, 6)
    }
  }).reduce((a, b) => a + b, 0) || 0) / convertMicroDenomToDenom(whaleUsdcPoolInfo.total_share, 6)

  const totalWhaleBtcDollarAmount = (whaleBtcPoolInfo?.assets.map((asset) => {
    if (asset.info.native_token.denom === 'uwhale') {
      return convertMicroDenomToDenom(asset.amount, 6) * whalePrice * 2
    }
    return 0
  }).reduce((a, b) => a + b, 0) || 0) / convertMicroDenomToDenom(whaleBtcPoolInfo.total_share, 6)

  const totalWindWhaleDollarAmount = (windWhalePoolInfo?.assets.map((asset) => {
    if (asset.info.native_token.denom === 'uwhale') {
      return convertMicroDenomToDenom(asset.amount, 6) * whalePrice * 2
    }
    return 0
  }).reduce((a, b) => a + b, 0) || 0) / convertMicroDenomToDenom(windWhalePoolInfo.total_share, 6)

  return {
    'USDC-WHALE-LP': totalWhaleUsdcDollarAmount,
    'WHALE-wBTC-LP': totalWhaleBtcDollarAmount,
    'WIND-WHALE-LP': totalWindWhaleDollarAmount,
  }
}

export const useGetLPTokenPrices = () => {
  const client = useLCDClient()
  const [priceList] = usePrices() || []
  const whalePrice = priceList?.Whale
  const { data: lpTokenPrices } = useQuery(
    ['getLPInfo', whalePrice],
    async () => await fetchTotalPoolSuppliesAndCalculatePrice(client, whalePrice), { enabled: Boolean(client) && Boolean(whalePrice) },
  )

  return lpTokenPrices
}
