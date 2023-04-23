import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import { MsgClaimDelegationRewards } from '@terra-money/feather.js';
// This is kept for the case where user is only using alliance but for the most part is superceded by the native staking claimRewards.ts which handles both alliance and native staking
export const claimRewards = async (
  wallet: TerraStationWallet,
  delegations: any,
  address: string,
) => {
  const msgs = delegations.map(({ delegation }) => {
    return new MsgClaimDelegationRewards(
      delegation.delegator_address,
      delegation.validator_address,
      delegation.denom,
    );
  });

  return await wallet.client.post({ chainID: 'migaloo-1', msgs: msgs });
};
