import file from "public/mainnet/contract_addresses.json"
import {coin} from "@cosmjs/amino";
import {isNativeToken} from "util/isNative";
import {MsgExecuteContract} from "@terra-money/feather.js";
import {toBase64} from "util/toBase64";
import {SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient";
import {createExecuteMessage} from "util/createExecutionMessage";
export const delegate = async (
    client: SigningCosmWasmClient,
    address: string,
    amount: string,
    denom: string,
) => {
    const stakeMessage = {
        stake: {}
    }
    if (isNativeToken(denom)) {
        const msg = createExecuteMessage({senderAddress: address,contractAddress: file.alliance_contract,
        message:stakeMessage, funds: [coin(amount, denom)]})
        return await client.signAndBroadcast(address, [msg], 'auto', null)
    } else {
        const msgs = [
            {
                typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
                value: new MsgExecuteContract(
                    address,
                    denom,
                    {
                        increase_allowance: {
                            amount: amount,
                            spender: file.alliance_contract
                        }
                    }, []
                )
            },
            {
            typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
            value: new MsgExecuteContract(
                    address,
                    denom,
                    {
                        send: {
                            amount: amount,
                            contract: file.alliance_contract,
                            msg: toBase64(stakeMessage)
                        }
                    },
                    [],
                )
            }]

        return await client.signAndBroadcast(address, msgs, 'auto', null)
    }

}
