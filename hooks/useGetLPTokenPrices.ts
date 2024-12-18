import { useQuery } from 'react-query';

import { LCDClient } from '@terra-money/feather.js/dist/client/lcd/LCDClient';
import useLCDClient from 'hooks/useLCDClient';
import usePrices from 'hooks/usePrices';
import { convertMicroDenomToDenom } from 'util/conversion';

interface Asset {
    amount: string;
    info: {
        native_token?: {
            denom: string;
        }
        token?: {
          contract_addr: string
        }
    }
}

interface PoolInfo {
    assets: Asset[]
    total_share: number
}
export const fetchTotalPoolSuppliesAndCalculatePrice = async (
  migalooClient: LCDClient, terraClient: LCDClient, priceList,
) => {
  if (!migalooClient) {
    return null
  }
  const whaleUsdcPoolInfo : PoolInfo = await migalooClient.wasm.contractQuery('migaloo1xv4ql6t6r8zawlqn2tyxqsrvjpmjfm6kvdfvytaueqe3qvcwyr7shtx0hj', {
    pool: {},
  })

  const whaleBtcPoolInfo : PoolInfo = await migalooClient.wasm.contractQuery('migaloo1axtz4y7jyvdkkrflknv9dcut94xr5k8m6wete4rdrw4fuptk896su44x2z', {
    pool: {},
  })
  const windWhalePoolInfo : PoolInfo = await migalooClient.wasm.contractQuery('migaloo1sp6jxvrkym8j2zf5uszmmp0huwae43j5hlhagrn38pprazqnzxuqtufyha', {
    pool: {},
  })
  const ampRoarRoarPoolInfo : PoolInfo = await terraClient.wasm.contractQuery('terra1d8ap3zyd6tfnruuuwvs0t927lr4zwptruhulfwnxjpqzudvyn8usfgl8ze', {
    pool: {},
  })
  const frogWhalePoolInfo : PoolInfo = await migalooClient.wasm.contractQuery('migaloo1qu9fdl00ager68lyeh8e2vv3lpgylqryug468vuvy0ujk4tyq9zsnw5qdz', {
    pool: {},
  })
  const ophirWhalePoolInfo : PoolInfo = await migalooClient.wasm.contractQuery('migaloo1p5adwk3nl9pfmjjx6fu9mzn4xfjry4l2x086yq8u8sahfv6cmuyspryvyu', {
    pool: {},
  })

  const totalWhaleUsdcDollarAmount = (whaleUsdcPoolInfo?.assets.map((asset) => {
    if (asset.info.native_token.denom === 'uwhale') {
      return convertMicroDenomToDenom(asset.amount, 6) * priceList.Whale
    } else {
      return convertMicroDenomToDenom(asset.amount, 6)
    }
  }).reduce((a, b) => a + b, 0) || 0) / convertMicroDenomToDenom(whaleUsdcPoolInfo.total_share, 6)

  const totalWhaleBtcDollarAmount = (whaleBtcPoolInfo?.assets.map((asset) => {
    if (asset.info.native_token.denom === 'uwhale') {
      return convertMicroDenomToDenom(asset.amount, 6) * priceList.Whale * 2
    }
    return 0
  }).reduce((a, b) => a + b, 0) || 0) / convertMicroDenomToDenom(whaleBtcPoolInfo.total_share, 6)

  const totalWindWhaleDollarAmount = (windWhalePoolInfo?.assets.map((asset) => {
    if (asset.info.native_token.denom === 'uwhale') {
      return convertMicroDenomToDenom(asset.amount, 6) * priceList.Whale * 2
    }
    return 0
  }).reduce((a, b) => a + b, 0) || 0) / convertMicroDenomToDenom(windWhalePoolInfo.total_share, 6)

  const totalAmpRoarRoarDollarAmount = (ampRoarRoarPoolInfo?.assets.map((asset) => {
    if (asset.info?.token?.contract_addr === 'terra1lxx40s29qvkrcj8fsa3yzyehy7w50umdvvnls2r830rys6lu2zns63eelv') {
      return convertMicroDenomToDenom(asset.amount, 6) * priceList.Roar * 2
    }
    return 0
  }).reduce((a, b) => a + b, 0) || 0) / convertMicroDenomToDenom(ampRoarRoarPoolInfo.total_share, 6)

  const totalFrogWhaleDollarAmount = (frogWhalePoolInfo?.assets.map((asset) => {
    if (asset.info.native_token.denom === 'uwhale') {
      return convertMicroDenomToDenom(asset.amount, 6) * priceList.Whale * 2
    }
    return 0
  }).reduce((a, b) => a + b, 0) || 0) / convertMicroDenomToDenom(frogWhalePoolInfo.total_share, 6)

  const totalOphirWhaleDollarAmount = (ophirWhalePoolInfo?.assets.map((asset) => {
    if (asset.info.native_token.denom === 'uwhale') {
      return convertMicroDenomToDenom(asset.amount, 6) * priceList.Whale * 2
    }
    return 0
  }).reduce((a, b) => a + b, 0) || 0) / convertMicroDenomToDenom(ophirWhalePoolInfo.total_share, 6)

  return {
    'USDC-WHALE-LP': totalWhaleUsdcDollarAmount,
    'WHALE-wBTC-LP': totalWhaleBtcDollarAmount,
    'WIND-WHALE-LP': totalWindWhaleDollarAmount,
    'ROAR-AMPROAR-LP': totalAmpRoarRoarDollarAmount,
    'FROG-WHALE-LP': totalFrogWhaleDollarAmount,
    'OPHIR-WHALE-LP': totalOphirWhaleDollarAmount,
  }
}

export const useGetLPTokenPrices = () => {
  const migalooClient = useLCDClient()
  const terraClient = useLCDClient('phoenix-1')
  const [priceList] = usePrices() || []
  const { data: lpTokenPrices } = useQuery(
    ['getLPInfo', priceList],
    async () => await fetchTotalPoolSuppliesAndCalculatePrice(
      migalooClient, terraClient, priceList,
    ), { enabled: Boolean(migalooClient) && Boolean(terraClient) && Boolean(priceList) },
  )

  return lpTokenPrices
}
