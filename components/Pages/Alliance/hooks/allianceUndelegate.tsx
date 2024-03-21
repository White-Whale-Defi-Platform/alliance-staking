import { SigningStargateClient } from '@cosmjs/stargate';
import { alliance } from 'util/alliance_aminos';
import { createGasFee } from 'util/createGasFees'

export const allianceUndelegate = async (
  client: SigningStargateClient,
  valAddress: string,
  address: string,
  amount: string,
  allianceDenom: string,
) => { 
  const undelegate = alliance.alliance.MessageComposer.fromPartial.undelegate
  const message = undelegate({delegatorAddress: address, validatorAddress:valAddress, amount: {denom: allianceDenom, amount}})
  return await client.signAndBroadcast(
  address, [message], await createGasFee(client, address, [message]))
}
