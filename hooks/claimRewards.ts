import file from "public/mainnet/contract_addresses.json"
import {SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient";

export const claimRewards = async (
    client: SigningCosmWasmClient,
    address: string,
    denom: string,
    isNative: boolean,
) => {
    const nativeMsg = {
        claim_rewards: {
            native: denom
        }
    }
    const nonNativeMsg = {
        claim_rewards: {
            cw20: denom
        }
    }

    return await client.execute(address, file.alliance_contract,isNative ? nativeMsg: nonNativeMsg, null)
};
