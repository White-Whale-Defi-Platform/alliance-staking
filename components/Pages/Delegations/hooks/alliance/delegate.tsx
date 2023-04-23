import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import { Coin, Fee, MsgAllianceDelegate } from '@terra-money/feather.js';

export const delegate = async (
  wallet: TerraStationWallet,
  destBlockchain: string,
  valAddress: string,
  address: string,
  amount: number,
  allianceDenom: string,
) => {
  const handleMsg = new MsgAllianceDelegate(
    address,
    valAddress,
    new Coin(allianceDenom, amount),
  );

  return await wallet.client.post({
    chainID: destBlockchain,
    msgs: [handleMsg],
  });
};
