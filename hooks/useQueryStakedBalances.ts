import {useQuery} from "react-query";
import file from "public/mainnet/contract_addresses.json"
import tokens from 'public/mainnet/tokens.json'
import {convertMicroDenomToDenom} from "util/conversion";
import {useChain} from "@cosmos-kit/react-lite";
import {MIGALOO_CHAIN_NAME} from "constants/common";
import {useClients} from "hooks/useClients";
import {CosmWasmClient} from "@cosmjs/cosmwasm-stargate";

export interface EnhancedStakeInfo {
    denom: string
    tokenSymbol: string
    name: string
    amount: number
    isNative: boolean
}
const getStakedBalances = async (contractAddress: string, address: string, client: CosmWasmClient): Promise<EnhancedStakeInfo[]> => {
    const msg = {
        all_staked_balances: {
            address: address
        }
    }
    const stakedInfos = await client.queryContractSmart(contractAddress, msg)

    return stakedInfos.map((info) => {
        const token = tokens?.find((token) => token.denom === (info?.asset?.native ?? info?.asset?.cw20))
            return {
                denom: token.denom,
                tokenSymbol: token.symbol,
                name: token.name,
                amount: convertMicroDenomToDenom(info?.balance, 6),
                isNative: Boolean(info?.asset?.native)
            }
    })
}
export const useQueryStakedBalances = () => {
    const { address} = useChain(MIGALOO_CHAIN_NAME)
    const { signingClient: client } = useClients()
    const {data, isLoading} = useQuery({
        queryKey: ['balances', file.alliance_contract, address],
        queryFn: () => getStakedBalances(file.alliance_contract, address, client),
        refetchInterval: 60000,
        refetchIntervalInBackground: true,
        enabled: Boolean(file.alliance_contract) && Boolean(client),
    })
    return {data, isLoading}
}
