import { chains } from "chain-registry"

export const getGasFees = async (
    gas: number, price: number, denom: string,
  ) => ({
    amount: [
      {
        denom,
        amount: String(Math.ceil(Number(gas * price))),
      },
    ],
    gas: String(gas),
  })

export async function createGasFee(
    client: any , address: string, msgs: Array<any>,
  ) {
    const chainId = 'migaloo-1'
    const migaloo_fee = chains.filter((chain:any)=> chain.chain_id == chainId)[0].fees.fee_tokens[0]
    let sim = await client.simulate(
      address, msgs, '',
    ) * 1.3
    sim = Math.ceil(sim)
    return getGasFees(
      sim, migaloo_fee.fixed_min_gas_price, migaloo_fee.denom,
    )
  }