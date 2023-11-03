import file from "public/mainnet/contract_addresses.json"
import {SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient"

export const updateRewards = async (
    client: SigningCosmWasmClient,
    address: string,
) => {
    const msg = {
        update_rewards: {}
    }
    return await client.execute(address, file.alliance_contract, msg, null)
}
