import file from "public/mainnet/contract_addresses.json"
import {SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient";

export const undelegate = async (
    client: SigningCosmWasmClient,
    address: string,
    amount: string,
    denom: string,
    isNative: boolean,
) => {
    const nativeMsg = {
       unstake: {
           info: {
               native: denom
           },
              amount: amount
       }
    }

    const nonNativeMsg = {
       unstake: {
           info: {
               cw20: denom
           },
           amount: amount
       }
    }

    return await client.execute(address, file.alliance_contract, isNative ? nativeMsg: nonNativeMsg, null)
}
