import { useQuery } from 'react-query';

import { LCDClient } from '@terra-money/feather.js';
import useLCDClient from 'hooks/useLCDClient';
import usePrices from 'hooks/usePrices';
import tokens from 'public/mainnet/white_listed_alliance_token_info.json';
import { convertMicroDenomToDenom } from 'util/conversion';

export interface Undelegation {
  amount: number
  dollarValue: number
  symbol: string
  validatorAddress: string
  delegatorAddress: string
}
const getUndelegations = async (
  client: LCDClient | null,
  priceList: any,
  delegatorAddress: string,
): Promise<any> => {
  const undelegations: Undelegation[] = []
  let url: string = `${client.config['migaloo-1'].lcd}/cosmos/tx/v1beta1/txs?events=message.action=%27/alliance.alliance.MsgUndelegate%27&events=message.sender=%27${delegatorAddress}%27`
  const resAlliance: any = await (await fetch(url)).json()
  for (const txs of resAlliance.tx_responses) {
    const event = txs.events.find((e) => e.type === 'alliance.alliance.UndelegateAllianceEvent')
    if (event) {
      const completion = Date.parse(event.attributes.find((attr) => attr.key === "completionTime")?.value.replace("\"", "").replace("\"", ""))
      if (completion > Date.now()) {
        const coin = JSON.parse(event.attributes.find((attr) => attr.key === "coin")?.value)
        const token = tokens.find((t) => t.denom === coin.denom)
        const validator_address = JSON.parse(event.attributes.find((attr) => attr.key === "validator")?.value)
        const amount = convertMicroDenomToDenom(coin.amount,
          token.decimals)
        const dollarValue = priceList[token.name] * amount;
        undelegations.push({
          validatorAddress: validator_address,
          delegatorAddress,
          amount,
          dollarValue,
          symbol: token.symbol,
        })
      }
    }
  }
  const stakingToken = 'Whale'
  const nativeRes = await client?.staking.unbondingDelegations(delegatorAddress);
  const nativeUndelegations = nativeRes[0].map((undelegation) => {
    const undelegationJson = undelegation.toProto()
    const amount = convertMicroDenomToDenom(undelegationJson.entries[0].balance,
      6)
    const dollarValue = priceList[stakingToken] * amount
    return {
      validatorAddress: undelegation.validator_address,
      delegatorAddress: undelegation.delegator_address,
      amount,
      dollarValue,
      symbol: 'WHALE',
    }
  })
  // And finally merge them up and return
  const allUndelegations = undelegations.concat(nativeUndelegations)

  return { allUndelegations }
}

const useUndelegations = ({ address }) => {
  const client = useLCDClient()
  const [priceList] = usePrices() || []

  return useQuery({
    queryKey: ['undelegations', address],
    queryFn: () => getUndelegations(
      client, priceList, address,
    ),
    enabled: Boolean(address) && Boolean(priceList),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export default useUndelegations
