import { QueryClient, createProtobufRpcClient } from '@cosmjs/stargate';

import { BinaryReader } from '../../binary';
import { Rpc } from '../../helpers';
import { QueryParamsRequest, QueryParamsResponse, QueryAlliancesRequest, QueryAlliancesResponse, QueryIBCAllianceRequest, QueryAllianceResponse, QueryAllAlliancesDelegationsRequest, QueryAlliancesDelegationsResponse, QueryAllianceValidatorRequest, QueryAllianceValidatorResponse, QueryAllAllianceValidatorsRequest, QueryAllianceValidatorsResponse, QueryAlliancesDelegationsRequest, QueryAlliancesDelegationByValidatorRequest, QueryAllianceDelegationRequest, QueryAllianceDelegationResponse, QueryIBCAllianceDelegationRequest, QueryAllianceDelegationRewardsRequest, QueryAllianceDelegationRewardsResponse, QueryIBCAllianceDelegationRewardsRequest, QueryAllianceUnbondingsByDenomAndDelegatorRequest, QueryAllianceUnbondingsByDenomAndDelegatorResponse, QueryAllianceUnbondingsRequest, QueryAllianceUnbondingsResponse, QueryAllianceRedelegationsRequest, QueryAllianceRedelegationsResponse, QueryAllianceRequest } from './query';
export interface Query {
  params(request?: QueryParamsRequest): Promise<QueryParamsResponse>;
  /** Query paginated alliances */
  alliances(request?: QueryAlliancesRequest): Promise<QueryAlliancesResponse>;
  /**
   * Query a specific alliance by ibc hash
   * @deprecated: this endpoint will be replaced for by the encoded version
   * of the denom e.g.: GET:/terra/alliances/ibc%2Falliance
   */
  iBCAlliance(request: QueryIBCAllianceRequest): Promise<QueryAllianceResponse>;
  /** Query all paginated alliance delegations */
  allAlliancesDelegations(request?: QueryAllAlliancesDelegationsRequest): Promise<QueryAlliancesDelegationsResponse>;
  /** Query alliance validator */
  allianceValidator(request: QueryAllianceValidatorRequest): Promise<QueryAllianceValidatorResponse>;
  /** Query all paginated alliance validators */
  allAllianceValidators(request?: QueryAllAllianceValidatorsRequest): Promise<QueryAllianceValidatorsResponse>;
  /** Query all paginated alliance delegations for a delegator addr */
  alliancesDelegation(request: QueryAlliancesDelegationsRequest): Promise<QueryAlliancesDelegationsResponse>;
  /** Query all paginated alliance delegations for a delegator addr and validator_addr */
  alliancesDelegationByValidator(request: QueryAlliancesDelegationByValidatorRequest): Promise<QueryAlliancesDelegationsResponse>;
  /** Query a delegation to an alliance by delegator addr, validator_addr and denom */
  allianceDelegation(request: QueryAllianceDelegationRequest): Promise<QueryAllianceDelegationResponse>;
  /**
   * Query a delegation to an alliance by delegator addr, validator_addr and denom
   * @deprecated: this endpoint will be replaced for by the encoded version
   * of the denom e.g.: GET:/terra/alliances/terradr1231/terravaloper41234/ibc%2Falliance
   */
  iBCAllianceDelegation(request: QueryIBCAllianceDelegationRequest): Promise<QueryAllianceDelegationResponse>;
  /** Query for rewards by delegator addr, validator_addr and denom */
  allianceDelegationRewards(request: QueryAllianceDelegationRewardsRequest): Promise<QueryAllianceDelegationRewardsResponse>;
  /**
   * Query for rewards by delegator addr, validator_addr and denom
   * @deprecated: this endpoint will be replaced for by the encoded version
   * of the denom e.g.: GET:/terra/alliances/terradr1231/terravaloper41234/ibc%2Falliance
   */
  iBCAllianceDelegationRewards(request: QueryIBCAllianceDelegationRewardsRequest): Promise<QueryAllianceDelegationRewardsResponse>;
  /** Query for rewards by delegator addr, validator_addr and denom */
  allianceUnbondingsByDenomAndDelegator(request: QueryAllianceUnbondingsByDenomAndDelegatorRequest): Promise<QueryAllianceUnbondingsByDenomAndDelegatorResponse>;
  /** Query for rewards by delegator addr, validator_addr and denom */
  allianceUnbondings(request: QueryAllianceUnbondingsRequest): Promise<QueryAllianceUnbondingsResponse>;
  /** Query redelegations by denom and delegator address */
  allianceRedelegations(request: QueryAllianceRedelegationsRequest): Promise<QueryAllianceRedelegationsResponse>;
  /** Query a specific alliance by denom */
  alliance(request: QueryAllianceRequest): Promise<QueryAllianceResponse>;
}
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }

  /* Params */
  params = async (request: QueryParamsRequest = {}): Promise<QueryParamsResponse> => {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request(
      'alliance.alliance.Query', 'Params', data,
    );
    return promise.then((data) => QueryParamsResponse.decode(new BinaryReader(data)));
  };

  /* Query paginated alliances */
  alliances = async (request: QueryAlliancesRequest = {
    pagination: undefined,
  }): Promise<QueryAlliancesResponse> => {
    const data = QueryAlliancesRequest.encode(request).finish();
    const promise = this.rpc.request(
      'alliance.alliance.Query', 'Alliances', data,
    );
    return promise.then((data) => QueryAlliancesResponse.decode(new BinaryReader(data)));
  };

  /*
   * Query a specific alliance by ibc hash
   * @deprecated: this endpoint will be replaced for by the encoded version
   * of the denom e.g.: GET:/terra/alliances/ibc%2Falliance
   */
  iBCAlliance = async (request: QueryIBCAllianceRequest): Promise<QueryAllianceResponse> => {
    const data = QueryIBCAllianceRequest.encode(request).finish();
    const promise = this.rpc.request(
      'alliance.alliance.Query', 'IBCAlliance', data,
    );
    return promise.then((data) => QueryAllianceResponse.decode(new BinaryReader(data)));
  };

  /* Query all paginated alliance delegations */
  allAlliancesDelegations = async (request: QueryAllAlliancesDelegationsRequest = {
    pagination: undefined,
  }): Promise<QueryAlliancesDelegationsResponse> => {
    const data = QueryAllAlliancesDelegationsRequest.encode(request).finish();
    const promise = this.rpc.request(
      'alliance.alliance.Query', 'AllAlliancesDelegations', data,
    );
    return promise.then((data) => QueryAlliancesDelegationsResponse.decode(new BinaryReader(data)));
  };

  /* Query alliance validator */
  allianceValidator = async (request: QueryAllianceValidatorRequest): Promise<QueryAllianceValidatorResponse> => {
    const data = QueryAllianceValidatorRequest.encode(request).finish();
    const promise = this.rpc.request(
      'alliance.alliance.Query', 'AllianceValidator', data,
    );
    return promise.then((data) => QueryAllianceValidatorResponse.decode(new BinaryReader(data)));
  };

  /* Query all paginated alliance validators */
  allAllianceValidators = async (request: QueryAllAllianceValidatorsRequest = {
    pagination: undefined,
  }): Promise<QueryAllianceValidatorsResponse> => {
    const data = QueryAllAllianceValidatorsRequest.encode(request).finish();
    const promise = this.rpc.request(
      'alliance.alliance.Query', 'AllAllianceValidators', data,
    );
    return promise.then((data) => QueryAllianceValidatorsResponse.decode(new BinaryReader(data)));
  };

  /* Query all paginated alliance delegations for a delegator addr */
  alliancesDelegation = async (request: QueryAlliancesDelegationsRequest): Promise<QueryAlliancesDelegationsResponse> => {
    const data = QueryAlliancesDelegationsRequest.encode(request).finish();
    const promise = this.rpc.request(
      'alliance.alliance.Query', 'AlliancesDelegation', data,
    );
    return promise.then((data) => QueryAlliancesDelegationsResponse.decode(new BinaryReader(data)));
  };

  /* Query all paginated alliance delegations for a delegator addr and validator_addr */
  alliancesDelegationByValidator = async (request: QueryAlliancesDelegationByValidatorRequest): Promise<QueryAlliancesDelegationsResponse> => {
    const data = QueryAlliancesDelegationByValidatorRequest.encode(request).finish();
    const promise = this.rpc.request(
      'alliance.alliance.Query', 'AlliancesDelegationByValidator', data,
    );
    return promise.then((data) => QueryAlliancesDelegationsResponse.decode(new BinaryReader(data)));
  };

  /* Query a delegation to an alliance by delegator addr, validator_addr and denom */
  allianceDelegation = async (request: QueryAllianceDelegationRequest): Promise<QueryAllianceDelegationResponse> => {
    const data = QueryAllianceDelegationRequest.encode(request).finish();
    const promise = this.rpc.request(
      'alliance.alliance.Query', 'AllianceDelegation', data,
    );
    return promise.then((data) => QueryAllianceDelegationResponse.decode(new BinaryReader(data)));
  };

  /*
   * Query a delegation to an alliance by delegator addr, validator_addr and denom
   * @deprecated: this endpoint will be replaced for by the encoded version
   * of the denom e.g.: GET:/terra/alliances/terradr1231/terravaloper41234/ibc%2Falliance
   */
  iBCAllianceDelegation = async (request: QueryIBCAllianceDelegationRequest): Promise<QueryAllianceDelegationResponse> => {
    const data = QueryIBCAllianceDelegationRequest.encode(request).finish();
    const promise = this.rpc.request(
      'alliance.alliance.Query', 'IBCAllianceDelegation', data,
    );
    return promise.then((data) => QueryAllianceDelegationResponse.decode(new BinaryReader(data)));
  };

  /* Query for rewards by delegator addr, validator_addr and denom */
  allianceDelegationRewards = async (request: QueryAllianceDelegationRewardsRequest): Promise<QueryAllianceDelegationRewardsResponse> => {
    const data = QueryAllianceDelegationRewardsRequest.encode(request).finish();
    const promise = this.rpc.request(
      'alliance.alliance.Query', 'AllianceDelegationRewards', data,
    );
    return promise.then((data) => QueryAllianceDelegationRewardsResponse.decode(new BinaryReader(data)));
  };

  /*
   * Query for rewards by delegator addr, validator_addr and denom
   * @deprecated: this endpoint will be replaced for by the encoded version
   * of the denom e.g.: GET:/terra/alliances/terradr1231/terravaloper41234/ibc%2Falliance
   */
  iBCAllianceDelegationRewards = async (request: QueryIBCAllianceDelegationRewardsRequest): Promise<QueryAllianceDelegationRewardsResponse> => {
    const data = QueryIBCAllianceDelegationRewardsRequest.encode(request).finish();
    const promise = this.rpc.request(
      'alliance.alliance.Query', 'IBCAllianceDelegationRewards', data,
    );
    return promise.then((data) => QueryAllianceDelegationRewardsResponse.decode(new BinaryReader(data)));
  };

  /* Query for rewards by delegator addr, validator_addr and denom */
  allianceUnbondingsByDenomAndDelegator = async (request: QueryAllianceUnbondingsByDenomAndDelegatorRequest): Promise<QueryAllianceUnbondingsByDenomAndDelegatorResponse> => {
    const data = QueryAllianceUnbondingsByDenomAndDelegatorRequest.encode(request).finish();
    const promise = this.rpc.request(
      'alliance.alliance.Query', 'AllianceUnbondingsByDenomAndDelegator', data,
    );
    return promise.then((data) => QueryAllianceUnbondingsByDenomAndDelegatorResponse.decode(new BinaryReader(data)));
  };

  /* Query for rewards by delegator addr, validator_addr and denom */
  allianceUnbondings = async (request: QueryAllianceUnbondingsRequest): Promise<QueryAllianceUnbondingsResponse> => {
    const data = QueryAllianceUnbondingsRequest.encode(request).finish();
    const promise = this.rpc.request(
      'alliance.alliance.Query', 'AllianceUnbondings', data,
    );
    return promise.then((data) => QueryAllianceUnbondingsResponse.decode(new BinaryReader(data)));
  };

  /* Query redelegations by denom and delegator address */
  allianceRedelegations = async (request: QueryAllianceRedelegationsRequest): Promise<QueryAllianceRedelegationsResponse> => {
    const data = QueryAllianceRedelegationsRequest.encode(request).finish();
    const promise = this.rpc.request(
      'alliance.alliance.Query', 'AllianceRedelegations', data,
    );
    return promise.then((data) => QueryAllianceRedelegationsResponse.decode(new BinaryReader(data)));
  };

  /* Query a specific alliance by denom */
  alliance = async (request: QueryAllianceRequest): Promise<QueryAllianceResponse> => {
    const data = QueryAllianceRequest.encode(request).finish();
    const promise = this.rpc.request(
      'alliance.alliance.Query', 'Alliance', data,
    );
    return promise.then((data) => QueryAllianceResponse.decode(new BinaryReader(data)));
  };
}
export const createRpcQueryExtension = (base: QueryClient) => {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);
  return {
    params(request?: QueryParamsRequest): Promise<QueryParamsResponse> {
      return queryService.params(request);
    },
    alliances(request?: QueryAlliancesRequest): Promise<QueryAlliancesResponse> {
      return queryService.alliances(request);
    },
    iBCAlliance(request: QueryIBCAllianceRequest): Promise<QueryAllianceResponse> {
      return queryService.iBCAlliance(request);
    },
    allAlliancesDelegations(request?: QueryAllAlliancesDelegationsRequest): Promise<QueryAlliancesDelegationsResponse> {
      return queryService.allAlliancesDelegations(request);
    },
    allianceValidator(request: QueryAllianceValidatorRequest): Promise<QueryAllianceValidatorResponse> {
      return queryService.allianceValidator(request);
    },
    allAllianceValidators(request?: QueryAllAllianceValidatorsRequest): Promise<QueryAllianceValidatorsResponse> {
      return queryService.allAllianceValidators(request);
    },
    alliancesDelegation(request: QueryAlliancesDelegationsRequest): Promise<QueryAlliancesDelegationsResponse> {
      return queryService.alliancesDelegation(request);
    },
    alliancesDelegationByValidator(request: QueryAlliancesDelegationByValidatorRequest): Promise<QueryAlliancesDelegationsResponse> {
      return queryService.alliancesDelegationByValidator(request);
    },
    allianceDelegation(request: QueryAllianceDelegationRequest): Promise<QueryAllianceDelegationResponse> {
      return queryService.allianceDelegation(request);
    },
    iBCAllianceDelegation(request: QueryIBCAllianceDelegationRequest): Promise<QueryAllianceDelegationResponse> {
      return queryService.iBCAllianceDelegation(request);
    },
    allianceDelegationRewards(request: QueryAllianceDelegationRewardsRequest): Promise<QueryAllianceDelegationRewardsResponse> {
      return queryService.allianceDelegationRewards(request);
    },
    iBCAllianceDelegationRewards(request: QueryIBCAllianceDelegationRewardsRequest): Promise<QueryAllianceDelegationRewardsResponse> {
      return queryService.iBCAllianceDelegationRewards(request);
    },
    allianceUnbondingsByDenomAndDelegator(request: QueryAllianceUnbondingsByDenomAndDelegatorRequest): Promise<QueryAllianceUnbondingsByDenomAndDelegatorResponse> {
      return queryService.allianceUnbondingsByDenomAndDelegator(request);
    },
    allianceUnbondings(request: QueryAllianceUnbondingsRequest): Promise<QueryAllianceUnbondingsResponse> {
      return queryService.allianceUnbondings(request);
    },
    allianceRedelegations(request: QueryAllianceRedelegationsRequest): Promise<QueryAllianceRedelegationsResponse> {
      return queryService.allianceRedelegations(request);
    },
    alliance(request: QueryAllianceRequest): Promise<QueryAllianceResponse> {
      return queryService.alliance(request);
    },
  };
};
