import {useQuery} from "react-query";
import {DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL} from "util/constants";
import {convertMicroDenomToDenom} from "util/conversion";
import {useChain} from "@cosmos-kit/react-lite";
import {MIGALOO_CHAIN_ID, MIGALOO_CHAIN_NAME} from "constants/common";
import {useClients} from "hooks/useClients";


const fetchWhaleBalance = async ({client, address}) => {
    const coin = await client.getBalance(address, 'uwhale')
    const amount = coin ? Number(coin.amount) : 0
    return convertMicroDenomToDenom(amount, 6)
}
export const useGetWhaleBalance = () => {
    const {address} = useChain(MIGALOO_CHAIN_NAME)
    const {cosmWasmClient: client} = useClients()

    const {
        data: balance = 0,
        isLoading,
        refetch,
    } = useQuery(
        ['tokenBalance', address],
        async () => {
            return await fetchWhaleBalance({
                client,
                address
            });
        },
        {
            enabled: !!address && !!client,
            refetchOnMount: 'always',
            refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
            refetchIntervalInBackground: true,
        },
    )

    return {balance, isLoading, refetch}

}
