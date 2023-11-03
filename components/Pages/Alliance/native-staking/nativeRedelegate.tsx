import { Coin, MsgBeginRedelegate } from '@terra-money/feather.js';
import {SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient";
export const nativeRedelegate = async (
  client: SigningCosmWasmClient,
  destBlockchain: string,
  validatorSrcAddress: string,
  validatorDstAddress: string,
  address: string,
  amount: number,
  allianceDenom: string,
) => {
  // wrong sig valDest => valSrc valSrc => valDest
  const handleMsg = new MsgBeginRedelegate(
    address,
    validatorSrcAddress,
    validatorDstAddress,
    new Coin(allianceDenom, amount),
  );

  return await wallet.client.post({
    chainID: destBlockchain,
    msgs: [handleMsg],
  });
};
