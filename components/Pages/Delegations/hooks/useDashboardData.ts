import { useQuery} from 'react-query';
import { useMemo, useState} from 'react';
import { debounce } from 'lodash';
import {LCDClient, Validator, Coins} from "@terra-money/feather.js";
import {AllianceDelegationResponse} from "@terra-money/feather.js/dist/client/lcd/api/AllianceAPI";
export interface ValidatorData {
    validator: Validator
    delegationResponse: any[]
}

const fetchValidators = async (client: LCDClient, chainId: string, address: string) => {
    const validators = await client.staking.validators(chainId);
    const allianceValidatorData = await Promise.all(validators[0].map(async v => ({
        validator: v,
        delegationResponse: (await fetchValidatorDelegations(client, address, v.operator_address)).delegations,
    })));
    return { allianceValidatorData };
};

const fetchValidatorDelegations = async (client: LCDClient, address: string, operatorAddress: string) => {
    const nativeStake = client.staking.delegations(address, operatorAddress);
    const allianceStake = client.alliance.alliancesDelegationByValidator(address, operatorAddress);
    const [nativeStakeResponse, allianceStakeResponse] = await Promise.all([nativeStake, allianceStake]);
    const delegations = [...nativeStakeResponse, ...allianceStakeResponse.delegations];
    return { delegations };
    // return client.alliance.alliancesDelegationByValidator(address, operatorAddress);


};

const fetchDelegations = async (client: LCDClient, chainId: string, address: string) => {
    const allianceDelegation = await client.alliance.alliancesDelegation(address);
    const nativeDelegate = await client.staking.delegations(address);
  
    // Convert Coin to Coins[]
    const nativeDelegateCoins = nativeDelegate.map((delegation) => {
        
      return { denom: delegation[0].amount.denom, amount: delegation[0].amount.amount };
    });
  
    // Add native delegation to the list of alliance delegations
    const allDelegations = allianceDelegation.delegations
      ? [...allianceDelegation.delegations, ...nativeDelegateCoins]
      : [...nativeDelegateCoins];
  
    return { delegation: allDelegations };
  };
  

const fetchRewards = async (client: LCDClient, chainId: string, address: string, validatorAddress: string, denom: string) => {
   
    // Combine both staking and alliance rewards
    const stakingRewards = await client.distribution.rewards(address);
    const allianceRewards = await client.alliance.delegatorRewards(address, validatorAddress, denom);
    // Add an entry to alliance rewards for each staking reward
    allianceRewards["uwhale"] = stakingRewards.total;

    return allianceRewards;

    
    // return client.alliance.delegatorRewards(address, validatorAddress, denom);
};

export const useDashboardData = (chainId: string, address: string) => {
    const debouncedRefetch = useMemo(() => debounce((refetchFunc) => refetchFunc(), 500), []);
    const client = useMemo(() => LCDClient.fromDefaultConfig("mainnet"), []);
    const [validators, setValidators] = useState<ValidatorData[]>([]);
    const [delegations, setDelegations] = useState<any[]>([]);
    const [rewards, setRewards] = useState<Record<string, string>>({});

    const validatorQuery = useQuery({
        queryKey: ['validators', chainId],
        queryFn: async () => {
            const data = await fetchValidators(client, chainId, address);
            setValidators(data.allianceValidatorData);
            return data;
        },
        enabled: !!client && !!chainId,
        refetchOnMount: 'always',
    });

    const delegationQuery = useQuery({
        queryKey: ['delegations', chainId],
        queryFn: async () => {
            const data = await fetchDelegations(client, chainId, address);
            setDelegations(data.delegation);
            return data;
        },
        enabled: !!client && !!chainId,
        refetchOnMount: 'always',
    });

    const rewardsQuery = useQuery({
        queryKey: ['rewards', chainId],
        queryFn: async () => {
            const data: Record<string, any> = {};
            await Promise.all(
                validators.map(async (v) => {
                    const reward = await fetchRewards(client, chainId, address, v.validator.operator_address, "uwhale");
                    data[v.validator.operator_address] = reward;
                })
            );
            setRewards(data);
            return data;
        },
        enabled: !!client && !!chainId,
        refetchOnMount: 'always',
    });

    const isLoading = useMemo(
        () => [validatorQuery, delegationQuery, rewardsQuery].some((query) => query.isLoading || query.data === null || query.data === undefined),
        [validatorQuery, delegationQuery, rewardsQuery]
    );

    const refetchAll = () => {
        [validatorQuery, delegationQuery, rewardsQuery].forEach((query) => {
            debouncedRefetch(query.refetch);
        });
    };

    const data = useMemo(() => {
        return {
            validators,
            delegations,
            rewards,
        };
    }, [validators, delegations, rewards]);

    return {...data, isLoading, refetch: refetchAll};
}
