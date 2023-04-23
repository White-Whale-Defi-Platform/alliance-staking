import { LCDClient, Validator } from '@terra-money/feather.js';
import { Pagination } from '@terra-money/feather.js/dist/client/lcd/APIRequester';
import useDelegations from './useDelegations';
import useClient from 'hooks/useClient';
import { num } from 'libs/num';
import { useQuery } from 'react-query';

type GetValidatorsParams = {
  client: LCDClient | null;
  validatorInfo: [Validator[], Pagination] | undefined;
  delegations: any[];
};

const getValidators = ({
  client,
  validatorInfo,
  delegations,
}: GetValidatorsParams) => {
  const getIsDelegated = (validator: any) => {
    const delegation = delegations.find(
      ({ delegation }) =>
        delegation?.validator_address === validator?.validator_addr,
    );
    return !!delegation;
  };

  // const getCommistion = (validators: Validator[]) => {
  //     return validators.map((validator: Validator) => {
  //         const rate = validator?.commission?.commission_rates.rate.toString()
  //         const commission = num(rate).times(100).toFixed(2)
  //         return {
  //             ...validator,
  //             commission: commission
  //         }
  //
  //     })
  // }

  // client?.alliance.alliancesValidators("migaloo-1")
  return client?.alliance
    .alliancesValidators('migaloo-1')
    .then((data) => {
      const [validators = [], pagination] = validatorInfo || [];

      // sum of validator shares
      const totalShares = validators.reduce(
        (acc, v) => acc.plus(v.delegator_shares.toString()),
        num(0),
      );
      const delegatedValidators = data?.validators as any[];

      const validatorsWithInfo = validators
        ?.map((validator) => {
          const delegatedValidator = delegatedValidators?.find((v) => {
            return v?.validator_addr === validator.operator_address;
          });
          const delegated = getIsDelegated(delegatedValidator);
          const rate = validator?.commission?.commission_rates.rate.toString();
          const share = validator?.delegator_shares.toString();
          const votingPower = num(100)
            .times(share!)
            .div(totalShares)
            .toFixed(2);
          const commission = num(rate).times(100).toFixed(0);

          return {
            ...validator,
            ...delegatedValidator,
            delegated,
            commission: commission,
            votingPower,
          };
        })
        .filter((v: any) => v.status === 'BOND_STATUS_BONDED');

      return { validators: validatorsWithInfo, pagination };
    })
    .catch((error) => {
      console.log({ error });
      return [[], {}];
    });
};

type UseValidatorsResult = {
  data: {
    validators: Validator[];
    pagination: any;
  };
  isFetching: boolean;
};

const useValidators = ({ address }): UseValidatorsResult => {
  const client = useClient();

  const { data: { delegations = [] } = {}, isFetched } = useDelegations({
    address,
  });

  const { data: validatorInfo } = useQuery({
    queryKey: ['validatorInfo'],
    queryFn: () => client?.staking.validators('migaloo-1'),
    enabled: !!client,
  });
  const { data, isFetching } = useQuery({
    queryKey: ['validators', isFetched],
    queryFn: () => getValidators({ client, validatorInfo, delegations }),
    enabled: !!client && !!validatorInfo,
  });
  return {
    data: {
      validators: data?.validators || [],
      pagination: data?.pagination || {},
    },
    isFetching,
  };
};
export default useValidators;
