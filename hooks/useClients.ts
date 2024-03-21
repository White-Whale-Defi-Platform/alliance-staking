import { useQueries } from 'react-query'

import { GeneratedType, Registry } from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';
import { AminoTypes } from '@cosmjs/stargate';
import { useChain } from '@cosmos-kit/react-lite'
import { MIGALOO_CHAIN_NAME } from 'constants/common';
import {
  cosmosAminoConverters,
  cosmosProtoRegistry,
  allianceAminoConverters,
  allianceProtoRegistry,
  cosmwasmAminoConverters,
  cosmwasmProtoRegistry
} from 'util/alliance_aminos';

export const useClients = () => {
  const {
    getCosmWasmClient,
    getSigningCosmWasmClient,
    getOfflineSigner,
    isWalletConnected,
    setDefaultSignOptions,
    wallet,
  } = useChain(MIGALOO_CHAIN_NAME)
  if (isWalletConnected && !wallet.name.includes('station')) {
    try {
      setDefaultSignOptions({
        preferNoSetFee: true,
        preferNoSetMemo: true,
        disableBalanceCheck: true,
      })
    } catch {
      console.error(`unable to set Default option for: ${wallet.name}`)
    }
  }
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
    {
      queryKey: ['offlineSignerDirect'],
      queryFn: async () => {
        const offlineSigner = await getOfflineSigner()

        const protoRegistry: ReadonlyArray<[string, GeneratedType]> = [
          ...cosmosProtoRegistry,
          ...allianceProtoRegistry,
          ...cosmwasmProtoRegistry,
        ];

        const aminoConverters = {
          ...cosmosAminoConverters,
          ...allianceAminoConverters,
          ...cosmwasmAminoConverters,
        };
        const registry = new Registry(protoRegistry);
        const aminoTypes = new AminoTypes(aminoConverters);

        const stargateClient = await SigningStargateClient.connectWithSigner(
          'https://migaloo-rpc.polkachu.com:443', offlineSigner, {
            registry,
            aminoTypes,
          },
        );
        return stargateClient
      },
      enabled: isWalletConnected,
    },
  ])

  // Check if both queries are in loading state
  const isLoading = queries.every((query) => query.isLoading)

  return {
    isLoading,
    cosmWasmClient: queries[0].data,
    signingClient: queries[1].data,
    allianceSigningClient: queries[2].data,
  }
}
