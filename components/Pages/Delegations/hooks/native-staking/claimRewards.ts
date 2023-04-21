import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import { MsgWithdrawDelegatorReward, MsgClaimDelegationRewards} from '@terra-money/feather.js';

export const claimRewards = async (
    wallet: TerraStationWallet,
    delegations: any,
    address: string,
) => {
    const msgs = delegations.map(({ delegation }) => {
            if (delegation.denom == 'uwhale'){
                return new MsgWithdrawDelegatorReward(
                    delegation.delegator_address,
                    delegation.validator_address,
                )
            }
            else{
                return new MsgClaimDelegationRewards(
                    delegation.delegator_address,
                    delegation.validator_address,
                    delegation.denom
                )
            }
        });
            

    return await wallet.client.post({ chainID: 'migaloo-1', msgs: msgs });
};