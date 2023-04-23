import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import { Coin, Fee, MsgAllianceRedelegate } from '@terra-money/feather.js';
export const redelegate = async (
  wallet: TerraStationWallet,
  destBlockchain: string,
  validatorSrcAddress: string,
  validatorDstAddress: string,
  address: string,
  amount: number,
  validators: any,
  allianceDenom: string,
) => {
  // wrong sig valDest => valSrc valSrc => valDest
  const handleMsg = new MsgAllianceRedelegate(
    address,
    validatorDstAddress,
    validatorSrcAddress,
    new Coin(allianceDenom, amount),
  );

  return await wallet.client.post({
    chainID: destBlockchain,
    msgs: [handleMsg],
  });
};
