import { LCDClient } from '@cosmology/lcd';

import { setPaginationParams } from '../../helpers';
import { QueryParamsRequest, QueryParamsResponseSDKType, QueryAlliancesRequest, QueryAlliancesResponseSDKType, QueryIBCAllianceRequest, QueryAllianceResponseSDKType, QueryAllAlliancesDelegationsRequest, QueryAlliancesDelegationsResponseSDKType, QueryAllianceValidatorRequest, QueryAllianceValidatorResponseSDKType, QueryAllAllianceValidatorsRequest, QueryAllianceValidatorsResponseSDKType, QueryAlliancesDelegationsRequest, QueryAlliancesDelegationByValidatorRequest, QueryAllianceDelegationRequest, QueryAllianceDelegationResponseSDKType, QueryIBCAllianceDelegationRequest, QueryAllianceDelegationRewardsRequest, QueryAllianceDelegationRewardsResponseSDKType, QueryIBCAllianceDelegationRewardsRequest, QueryAllianceUnbondingsByDenomAndDelegatorRequest, QueryAllianceUnbondingsByDenomAndDelegatorResponseSDKType, QueryAllianceUnbondingsRequest, QueryAllianceUnbondingsResponseSDKType, QueryAllianceRedelegationsRequest, QueryAllianceRedelegationsResponseSDKType, QueryAllianceRequest } from './query';
export class LCDQueryClient {
  req: LCDClient;

  constructor({
    requestClient,
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
  }

  /* Params */
  params = async (_params: QueryParamsRequest = {}): Promise<QueryParamsResponseSDKType> => {
    const endpoint = 'terra/alliances/params';
    return await this.req.get<QueryParamsResponseSDKType>(endpoint);
  };

  /* Query paginated alliances */
  alliances = async (params: QueryAlliancesRequest = {
    pagination: undefined,
  }): Promise<QueryAlliancesResponseSDKType> => {
    const options: any = {
      params: {},
    };
    if (typeof params?.pagination !== 'undefined') {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = 'terra/alliances';
    return await this.req.get<QueryAlliancesResponseSDKType>(endpoint, options);
  };

  /*
   * Query a specific alliance by ibc hash
   * @deprecated: this endpoint will be replaced for by the encoded version
   * of the denom e.g.: GET:/terra/alliances/ibc%2Falliance
   */
  iBCAlliance = async (params: QueryIBCAllianceRequest): Promise<QueryAllianceResponseSDKType> => {
    const endpoint = `terra/alliances/ibc/${params.hash}`;
    return await this.req.get<QueryAllianceResponseSDKType>(endpoint);
  };

  /* Query all paginated alliance delegations */
  allAlliancesDelegations = async (params: QueryAllAlliancesDelegationsRequest = {
    pagination: undefined,
  }): Promise<QueryAlliancesDelegationsResponseSDKType> => {
    const options: any = {
      params: {},
    };
    if (typeof params?.pagination !== 'undefined') {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = 'terra/alliances/delegations';
    return await this.req.get<QueryAlliancesDelegationsResponseSDKType>(endpoint, options);
  };

  /* Query alliance validator */
  allianceValidator = async (params: QueryAllianceValidatorRequest): Promise<QueryAllianceValidatorResponseSDKType> => {
    const endpoint = `terra/alliances/validators/${params.validatorAddr}`;
    return await this.req.get<QueryAllianceValidatorResponseSDKType>(endpoint);
  };

  /* Query all paginated alliance validators */
  allAllianceValidators = async (params: QueryAllAllianceValidatorsRequest = {
    pagination: undefined,
  }): Promise<QueryAllianceValidatorsResponseSDKType> => {
    const options: any = {
      params: {},
    };
    if (typeof params?.pagination !== 'undefined') {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = 'terra/alliances/validators';
    return await this.req.get<QueryAllianceValidatorsResponseSDKType>(endpoint, options);
  };

  /* Query all paginated alliance delegations for a delegator addr */
  alliancesDelegation = async (params: QueryAlliancesDelegationsRequest): Promise<QueryAlliancesDelegationsResponseSDKType> => {
    const options: any = {
      params: {},
    };
    if (typeof params?.pagination !== 'undefined') {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `terra/alliances/delegations/${params.delegatorAddr}`;
    return await this.req.get<QueryAlliancesDelegationsResponseSDKType>(endpoint, options);
  };

  /* Query all paginated alliance delegations for a delegator addr and validator_addr */
  alliancesDelegationByValidator = async (params: QueryAlliancesDelegationByValidatorRequest): Promise<QueryAlliancesDelegationsResponseSDKType> => {
    const options: any = {
      params: {},
    };
    if (typeof params?.pagination !== 'undefined') {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `terra/alliances/delegations/${params.delegatorAddr}/${params.validatorAddr}`;
    return await this.req.get<QueryAlliancesDelegationsResponseSDKType>(endpoint, options);
  };

  /* Query a delegation to an alliance by delegator addr, validator_addr and denom */
  allianceDelegation = async (params: QueryAllianceDelegationRequest): Promise<QueryAllianceDelegationResponseSDKType> => {
    const options: any = {
      params: {},
    };
    if (typeof params?.pagination !== 'undefined') {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `terra/alliances/delegations/${params.delegatorAddr}/${params.validatorAddr}/${params.denom}`;
    return await this.req.get<QueryAllianceDelegationResponseSDKType>(endpoint, options);
  };

  /*
   * Query a delegation to an alliance by delegator addr, validator_addr and denom
   * @deprecated: this endpoint will be replaced for by the encoded version
   * of the denom e.g.: GET:/terra/alliances/terradr1231/terravaloper41234/ibc%2Falliance
   */
  iBCAllianceDelegation = async (params: QueryIBCAllianceDelegationRequest): Promise<QueryAllianceDelegationResponseSDKType> => {
    const options: any = {
      params: {},
    };
    if (typeof params?.pagination !== 'undefined') {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `terra/alliances/delegations/${params.delegatorAddr}/${params.validatorAddr}/ibc/${params.hash}`;
    return await this.req.get<QueryAllianceDelegationResponseSDKType>(endpoint, options);
  };

  /* Query for rewards by delegator addr, validator_addr and denom */
  allianceDelegationRewards = async (params: QueryAllianceDelegationRewardsRequest): Promise<QueryAllianceDelegationRewardsResponseSDKType> => {
    const options: any = {
      params: {},
    };
    if (typeof params?.pagination !== 'undefined') {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `terra/alliances/rewards/${params.delegatorAddr}/${params.validatorAddr}/${params.denom}`;
    return await this.req.get<QueryAllianceDelegationRewardsResponseSDKType>(endpoint, options);
  };

  /*
   * Query for rewards by delegator addr, validator_addr and denom
   * @deprecated: this endpoint will be replaced for by the encoded version
   * of the denom e.g.: GET:/terra/alliances/terradr1231/terravaloper41234/ibc%2Falliance
   */
  iBCAllianceDelegationRewards = async (params: QueryIBCAllianceDelegationRewardsRequest): Promise<QueryAllianceDelegationRewardsResponseSDKType> => {
    const options: any = {
      params: {},
    };
    if (typeof params?.pagination !== 'undefined') {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `terra/alliances/rewards/${params.delegatorAddr}/${params.validatorAddr}/ibc/${params.hash}`;
    return await this.req.get<QueryAllianceDelegationRewardsResponseSDKType>(endpoint, options);
  };

  /* Query for rewards by delegator addr, validator_addr and denom */
  allianceUnbondingsByDenomAndDelegator = async (params: QueryAllianceUnbondingsByDenomAndDelegatorRequest): Promise<QueryAllianceUnbondingsByDenomAndDelegatorResponseSDKType> => {
    const options: any = {
      params: {},
    };
    if (typeof params?.pagination !== 'undefined') {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `terra/alliances/unbondings/${params.denom}/${params.delegatorAddr}`;
    return await this.req.get<QueryAllianceUnbondingsByDenomAndDelegatorResponseSDKType>(endpoint, options);
  };

  /* Query for rewards by delegator addr, validator_addr and denom */
  allianceUnbondings = async (params: QueryAllianceUnbondingsRequest): Promise<QueryAllianceUnbondingsResponseSDKType> => {
    const options: any = {
      params: {},
    };
    if (typeof params?.pagination !== 'undefined') {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `terra/alliances/unbondings/${params.denom}/${params.delegatorAddr}/${params.validatorAddr}`;
    return await this.req.get<QueryAllianceUnbondingsResponseSDKType>(endpoint, options);
  };

  /* Query redelegations by denom and delegator address */
  allianceRedelegations = async (params: QueryAllianceRedelegationsRequest): Promise<QueryAllianceRedelegationsResponseSDKType> => {
    const options: any = {
      params: {},
    };
    if (typeof params?.pagination !== 'undefined') {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `terra/alliances/redelegations/${params.denom}/${params.delegatorAddr}`;
    return await this.req.get<QueryAllianceRedelegationsResponseSDKType>(endpoint, options);
  };

  /* Query a specific alliance by denom */
  alliance = async (params: QueryAllianceRequest): Promise<QueryAllianceResponseSDKType> => {
    const endpoint = `terra/alliances/${params.denom}`;
    return await this.req.get<QueryAllianceResponseSDKType>(endpoint);
  };
}
