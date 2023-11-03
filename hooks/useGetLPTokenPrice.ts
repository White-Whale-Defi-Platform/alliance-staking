import {useQuery} from "react-query";
import {convertMicroDenomToDenom} from "util/conversion";
import usePrices from "hooks/usePrices";
import {useClients} from "hooks/useClients";
import {CosmWasmClient} from "@cosmjs/cosmwasm-stargate";
import {WHALE_USDC_MIGALOO_POOL_ADDRESS} from "constants/common";

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
export const fetchTotalPoolSupply = async (client: CosmWasmClient, whalePrice: number) => {
    if (!client) {
        return null
    }
    const poolInfo : PoolInfo = await client.queryContractSmart(WHALE_USDC_MIGALOO_POOL_ADDRESS, {
        pool: {},
    })
    const totalDollarAmount = poolInfo?.assets.map((asset) => {
        if(asset.info.native_token.denom === "uwhale") {
            return convertMicroDenomToDenom(asset.amount, 6) * whalePrice
        } else {
            return convertMicroDenomToDenom(asset.amount, 6)
        }
    }).reduce((a, b) => a + b, 0)

    return totalDollarAmount / convertMicroDenomToDenom(poolInfo.total_share, 6)
}
export const useGetLPTokenPrice = () => {
    const {cosmWasmClient: client} = useClients()
    const [priceList] = usePrices() || []
    const whalePrice = priceList?.['Whale']
    const {data: lpTokenPrice, isLoading} = useQuery(['getLPInfo', whalePrice],
        async () => fetchTotalPoolSupply(client, whalePrice),{enabled: !!client && !!whalePrice})

    return { lpTokenPrice, isLoading }
}
