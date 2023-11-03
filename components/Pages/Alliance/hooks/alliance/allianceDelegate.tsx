import {Coin, LCDClient, TxAPI} from '@terra-money/feather.js';
import {SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient";
import { MsgDelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx'
import { MsgDelegate as AllianceMsgDelegate} from '@terra-money/feather.js/dist/core/alliance/msgs';

export const allianceDelegate = async (

client: SigningCosmWasmClient,
  valAddress: string,
  address: string,
  amount: string,
  allianceDenom: string,
) => {
    const handleMsg = new AllianceMsgDelegate(
        address,
        valAddress,
        new Coin(allianceDenom, amount),
    )
    console.log(handleMsg)
    const msgDelegate = MsgDelegate.fromJSON({
        delegatorAddress: address,
        validatorAddress: valAddress,
        '@type':'/alliance.alliance.MsgDelegate',
        amount: {
            denom: allianceDenom,
            amount: amount,
        }
    })

    const anyMsgDelegate = {
        typeUrl:"/cosmos.staking.v1beta1.MsgDelegate",
        value: msgDelegate,
    };

  return await client.signAndBroadcast(address, [anyMsgDelegate], 'auto', null)
};
