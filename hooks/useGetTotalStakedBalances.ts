import useLCDClient from "hooks/useLCDClient";
import {useQuery} from "react-query";
import file from "public/mainnet/contract_addresses.json"
import tokens from 'public/mainnet/tokens.json'
import {convertMicroDenomToDenom} from "util/conversion"
import {LCDClient} from "@terra-money/feather.js/dist/client/lcd/LCDClient";

interface Response {
    asset : {
        cw20?: string
        native?: string
    }
    balance: string
}

export interface TotalStakedBalance {
    denom: string
    tokenSymbol: string
    name: string
    totalAmount: number
}

const fetchTotalStakedBalances = async (client: LCDClient) => {
    if (!client) return null
    const msg = {
        total_staked_balances: {}
    }
    const res: Response[] = await client.wasm.contractQuery(file.alliance_contract, msg)

    return res.map((info) => {
        const token = tokens.find((token) => token.denom === (info?.asset?.native ?? info?.asset?.cw20))
        return {
            denom: token.denom,
            name: token.name,
            tokenSymbol: token.symbol,
            totalAmount: convertMicroDenomToDenom(info.balance, 6)
        } as TotalStakedBalance
    })
}
export const useGetTotalStakedBalances = () => {
    const client = useLCDClient()
    const {data, isLoading} = useQuery({
        queryKey: 'totalStakeBalances',
        queryFn: () => fetchTotalStakedBalances(client),
        enabled: !!client,
    })
    return {data, isLoading}
}
