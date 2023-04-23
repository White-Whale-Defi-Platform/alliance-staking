import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import { Coin, Fee, MsgAllianceUndelegate } from '@terra-money/feather.js';

export const undelegate = async (
  wallet: TerraStationWallet,
  destBlockchain: string,
  valAddress: string,
  address: string,
  amount: number,
  allianceDenom: string,
) => {
  const handleMsg = new MsgAllianceUndelegate(
    address,
    valAddress,
    new Coin(allianceDenom, amount),
  );

  return await wallet.client.post({
    chainID: destBlockchain,
    msgs: [handleMsg],
  });
};
