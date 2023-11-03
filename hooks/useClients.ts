import { useQueries } from 'react-query'

import { useChain } from '@cosmos-kit/react-lite'
import {MIGALOO_CHAIN_NAME} from "constants/common";

export const useClients = () => {
    const {
        getCosmWasmClient,
        getSigningCosmWasmClient,
        isWalletConnected,
    } = useChain(MIGALOO_CHAIN_NAME)

    const queries = useQueries([
        {
            queryKey: ['cosmWasmClient'],
            queryFn: async () => await getCosmWasmClient(),
        },
        {
            queryKey: ['signingClient'],
            queryFn: async () => await getSigningCosmWasmClient(),
            enabled: isWalletConnected,
        },
    ])

    // Check if both queries are in loading state
    const isLoading = queries.every((query) => query.isLoading)

    return {
        isLoading,
        cosmWasmClient: queries[0].data,
        signingClient: queries[1].data,
    }
}
