import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import {
  MsgWithdrawDelegatorReward,
  MsgClaimDelegationRewards,
} from '@terra-money/feather.js';
import {SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient";

export const claimAllRewards = async (
  client: SigningCosmWasmClient,
  delegations: any,
) => {
  const msgs = delegations.map(({ delegation }) => {
    if (delegation.denom == 'uwhale') {
      return new MsgWithdrawDelegatorReward(
        delegation.delegator_address,
        delegation.validator_address,
      );
    } else {
      return new MsgClaimDelegationRewards(
        delegation.delegator_address,
        delegation.validator_address,
        delegation.denom,
      );
    }
  })

  return await client.signAndBroadcast()
};
