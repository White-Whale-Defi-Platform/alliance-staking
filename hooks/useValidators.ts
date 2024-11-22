import { useQuery } from 'react-query';

import { LCDClient, Validator } from '@terra-money/feather.js';
import { Pagination } from '@terra-money/feather.js/dist/client/lcd/APIRequester';
import { ValidatorInfo } from 'components/Pages/Alliance/ValidatorInput/ValidatorList';
import useLCDClient from 'hooks/useLCDClient';
import { num } from 'libs/num';
import allianceTokens from 'public/mainnet/white_listed_alliance_token_info.json'
import { convertMicroDenomToDenom } from 'util/conversion';

import useDelegations from './useDelegations';

type GetValidatorsParams = {
  client: LCDClient | null;
  validatorInfo: [Validator[], Pagination] | undefined;
  delegations: any[]
};

const getValidators = ({
  client,
  validatorInfo,
  delegations,
}: GetValidatorsParams) => {
  const getIsDelegated = (validator: any) => {
    const delegation = delegations.find(({ delegation }) => delegation?.validator_address === validator?.validator_addr);
    return Boolean(delegation);
  }

  return client?.alliance.
    alliancesByValidators('migaloo-1').
    then((data) => {
      const [validators = [], pagination] = validatorInfo || [];

      // Sum of validator shares
      const totalShares = validators.reduce((acc, v) => acc.plus(v.delegator_shares.toString()),
        num(0));
      const delegatedValidators = data?.validators as any[];
      const validatorsTMP = validators?.
        map((validator) => {
          const delegatedValidator = delegatedValidators?.find((v) => v?.validator_addr === validator.operator_address);
          const delegated = getIsDelegated(delegatedValidator);
          const rate = validator?.commission?.commission_rates.rate.toString();
          const share = validator?.delegator_shares.toString();
          const votingPower = num(100).
            times(share!).
            div(totalShares).
            toFixed(2);
          const commission = num(rate).times(100).
            toFixed(0);

          return {
            ...validator,
            ...delegatedValidator,
            delegated,
            commission,
            votingPower,
          };
        })
      const validatorsWithInfo = validatorsTMP.
        filter((v: any) => v.status === 'BOND_STATUS_BONDED');

      const unbondedValidators = validatorsTMP.filter((v: any) => v.status === 'BOND_STATUS_UNBONDED');
      return {
        validators: validatorsWithInfo, allValidators: [...validatorsWithInfo, ...unbondedValidators],
        pagination,
      };
    }).
    catch((error) => {
      console.log({ error });
      return [[], {}];
    })
};
const getStakedWhale = async ({ validatorData }) => {
  let sum = 0
  validatorData.validators.forEach((validator) => {
    sum += Number(validator.tokens.toString());
  })
  return convertMicroDenomToDenom(sum, 6)
}

type UseValidatorsResult = {
  data: {
    validators: ValidatorInfo[]
    pagination: any;
    stakedWhale: number
    stakedWhaleWBtc: number
    delegations: any[]
    allValidators: ValidatorInfo[]
  }
  isFetching: boolean
}
const getStakedWhaleWBtc = async ({ validatorData }) => {
  const wBTC = allianceTokens.find((token) => token.symbol === 'WHALE-wBTC-LP')
  let totalWBtcAmount = 0
  validatorData.validators.forEach((v) => {
    const wBTCAmount = v.total_staked?.find((token) => token.denom === wBTC.denom)?.amount || 0
    totalWBtcAmount += convertMicroDenomToDenom(wBTCAmount, wBTC.decimals)
  })
  return { totalWBtcAmount }
}

const useValidators = (): UseValidatorsResult => {
  const client = useLCDClient()

  const { data: { delegations = [] } = {}, isFetched } = useDelegations()

  const { data: validatorInfo } = useQuery({
    queryKey: ['validatorInfo'],
    queryFn: async () => await client?.staking.validators('migaloo-1'),
    enabled: Boolean(client),
  })

  const { data: validatorData, isFetching } = useQuery({
    queryKey: ['validators', isFetched],
    queryFn: () => getValidators({
      client,
      validatorInfo,
      delegations,
    }),
    enabled: Boolean(client) && Boolean(validatorInfo) && Boolean(delegations),
  })

  const { data: stakedWhale } = useQuery({
    queryKey: ['stakedWhale'],
    queryFn: () => getStakedWhale({ validatorData }),
    enabled: Boolean(validatorData),
  })

  const { data: stakedWhaleWBtc } = useQuery({
    queryKey: ['stakedWhaleWBtc'],
    queryFn: () => getStakedWhaleWBtc({ validatorData }),
    enabled: Boolean(validatorData),
  })
  return {
    data: {
      validators: validatorData?.validators || [],
      pagination: validatorData?.pagination || {},
      stakedWhale: stakedWhale || 0,
      stakedWhaleWBtc: stakedWhaleWBtc?.totalWBtcAmount || 0,
      delegations: delegations || [],
      allValidators: validatorData?.allValidators || [],
    },
    isFetching,
  }
}
export default useValidators
