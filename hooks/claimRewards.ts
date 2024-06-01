import { SigningStargateClient } from '@cosmjs/stargate'
import file from 'public/mainnet/contract_addresses.json'
import { createExecuteMessage } from 'util/createExecutionMessage';
import { createGasFee } from 'util/createGasFees'
import { isNativeToken } from '../util/isNative';

export const claimRewards = async (
  client: SigningStargateClient,
  address: string,
  denom: string[] ,
) => {
  const messages = []
  for (const d of denom) {
    const nativeMsg = {
      claim_rewards: {
        native: d,
      },
    }
    const nonNativeMsg = {
      claim_rewards: {
        cw20: d,
      },
    }
    const isNative = isNativeToken(d)
      messages.push(createExecuteMessage({
        senderAddress: address,
        contractAddress: file.alliance_contract,
        message: isNative ? nativeMsg : nonNativeMsg,
        funds: [],
      }))
  }
  return await client.signAndBroadcast(
    address, messages, await createGasFee(
      client, address, messages,
    ), null,
  )
}
