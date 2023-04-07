import { TerraStationWallet } from '../../../../util/wallet-adapters/terraStationWallet';
import { Coin, LCDClient,MsgClaimDelegationRewards } from '@terra-money/feather.js';

export const useClaimRewards = async (
    client: TerraStationWallet,
    destBlockchain: string,
    valAddress: string,
    allianceDenom: string
) => {
    const handleMsg = new MsgClaimDelegationRewards(
        client.client.addresses[destBlockchain],
        valAddress,
        allianceDenom 
    );

    return client.client.post({ chainID: destBlockchain, msgs: [handleMsg] });
};