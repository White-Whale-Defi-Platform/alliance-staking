import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import { Msg } from '@terra-money/feather.js';

export const estimateFee = async (
  wallet: TerraStationWallet,
  address: string,
  msgs: Msg[],
) =>
  await wallet.lcdClient.auth.accountInfo(address).then((result) => {
    return wallet.lcdClient.tx.estimateFee(
      [
        {
          publicKey: result.getPublicKey(),
          sequenceNumber: result.getSequenceNumber(),
        },
      ],
      { chainID: 'migaloo-1', msgs: msgs },
    );
  });
