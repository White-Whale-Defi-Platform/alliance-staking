import {useQuery} from "react-query"
import file from "public/mainnet/contract_addresses.json"
import tokens from 'public/mainnet/tokens.json'
import {LCDClient} from "@terra-money/feather.js/dist/client/lcd/LCDClient";
import useLCDClient from "hooks/useLCDClient";

interface AssetDistributionResponse {
    asset: {
        cw20?: string;
        native?: string;
    }
    distribution: number
}

export interface AssetDistribution {
    denom: string
    tokenSymbol: string
    distribution: number
}
const fetchVTRewardShares = async (client: LCDClient): Promise<AssetDistribution[]> => {
    if (!client) {
        return
    }
    const msg = {
        reward_distribution: {}
    }
    const res: AssetDistributionResponse[] = await client.wasm.contractQuery(file.alliance_contract, msg)
    return res.map((info) => {
        const token = tokens.find((token) => token.denom === (info?.asset?.native ?? info?.asset?.cw20))
        return {
            denom: token.denom,
            tokenSymbol: token.symbol,
            distribution: info.distribution,
        } as AssetDistribution
    })

}

export const useGetVTRewardShares = () => {
    const client = useLCDClient()
    const {data, isLoading} = useQuery(
        ['vtRewardShares'],
        async () => fetchVTRewardShares(client),
        {
            enabled: !!client,
        }
    )
    return {data, isLoading}
}
