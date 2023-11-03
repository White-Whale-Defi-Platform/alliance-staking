import { Coins, LCDClient } from '@terra-money/feather.js';
import useLCDClient from 'hooks/useLCDClient';
import tokens from 'public/mainnet/white_listed_alliance_token_info.json';
import usePrices from 'hooks/usePrices';
import { num } from 'libs/num';
import { useQuery } from 'react-query';

const getDelegation = async (
  client: LCDClient | null,
  priceList: any,
  delegatorAddress: string,
): Promise<any> => {
  if (!client) return Promise.resolve([]);

  // This needs to be reworked such that if denom is whale we use client.distribution.rewards instead
  const getRewards = (delegations: any) => {
    return Promise.all(
      delegations?.map(async (item: any) => {
        const { delegator_address, validator_address, denom } = item.delegation;

        return item.type === 'native'
          ? await client?.distribution
              .getReqFromAddress(delegatorAddress)
              .get<{ rewards?: any }>(
                `/cosmos/distribution/v1beta1/delegators/${delegator_address}/rewards/${validator_address}`,
                {},
              )
              .then(({ rewards }) => {
                // Rewards result must look like this
                // [
                //     {
                //         "denom": "ibc/05238E98A143496C8AF2B6067BABC84503909ECE9E45FBCBAC2CBA5C889FD82A",
                //         "amount": "144"
                //     },
                //     {
                //         "denom": "ibc/40C29143BF4153B365089E40E437B7AA819672646C45BB0A5F1E10915A0B6708",
                //         "amount": "108"
                //     },
                //     {
                //         "denom": "uwhale",
                //         "amount": "5384038"
                //     }
                // ]
                return {
                  ...item,
                  rewards: rewards,
                };
              })
              .catch((e) => {
                return {
                  ...item,
                  rewards: null,
                };
              })
          : await client?.alliance
              .getReqFromAddress(delegatorAddress)
              .get<{ rewards?: Coins }>(
                `/terra/alliances/rewards/${delegator_address}/${validator_address}/${denom}`,
                {},
              )
              .then(({ rewards }) => {
                return {
                  ...item,
                  rewards,
                };
              })
              .catch((e) => {
                return {
                  ...item,
                  rewards: null,
                };
              });
      }),
    );
  };

  const allianceDelegation = await client?.alliance.alliancesDelegation(
    delegatorAddress,
  );
  const nativeStake = await client.staking.delegations(delegatorAddress);
  const [nativeStakeResponse, allianceStakeResponse] = await Promise.all([
    nativeStake[0],
    allianceDelegation.delegations,
  ]);

  const delegations = [
    ...nativeStakeResponse.map((item: any) => {
      return {
        type: 'native',
        delegation: {
          delegator_address: item.delegator_address || 0,
          validator_address: item.validator_address || 0,
          denom: item.balance.denom || '',
        },
        balance: {
          denom: item.balance.denom || '',
          amount: `${String(item.balance.amount)}` || 0,
        },
      };
    }),
    ...allianceStakeResponse?.map((item: any) => {
      return {
        type: 'alliance',
        delegation: item.delegation,
        balance: item.balance,
      };
    }),
  ];

  // This needs to be reworked such that we are working on a list of delegations from both modules
  return getRewards(delegations)
    .then((data) => {
      return data?.map((item) => {
        const delegatedToken = tokens.find(
          (token) => token.denom === item.delegation?.denom,
        );
        // If item type is native we need to return the uwhale token with 0 amount
        const rewardTokens = item.rewards.map((r) => {
          const token = tokens.find((t) => t.denom === r.denom);
          return {
            amount: r?.amount,
            name: token.name,
            decimals: token.decimals,
            denom: token.denom,
          };
        });

        //delegation amount
        const amount = delegatedToken
          ? num(item.balance?.amount)
              .div(10 ** delegatedToken.decimals)
              .toNumber()
          : 0;
        const dollarValue = delegatedToken
          ? num(amount).times(priceList[delegatedToken.name]).dp(2).toNumber()
          : 0;
        // console.log(`amount: ${amount} dollarValue: ${dollarValue} for ${delegatedToken.name}`)
        //rewards amount
        const rewards = rewardTokens.map((rt) => {
          const amount = num(rt.amount)
            .div(10 ** rt.decimals)
            .dp(rt.decimals)
            .toNumber();
          return {
            amount: amount,
            dollarValue: num(amount).times(priceList[rt.name]).dp(3).toNumber(),
            denom: rt.denom,
          };
        });
        return {
          ...item,
          rewards: rewards,
          token: {
            ...delegatedToken,
            amount,
            dollarValue,
          },
        };
      });
    })
    .then((data) => {
      // sum to total delegation
      const totalDelegation = data.reduce(
        (acc, item) => {
          const { dollarValue } = item.token;
          return {
            dollarValue: acc.dollarValue + dollarValue,
          };
        },
        { dollarValue: 0 },
      );
      return {
        delegations: data,
        totalDelegation: totalDelegation?.dollarValue?.toFixed(2),
      };
    });
};

const useDelegations = ({ address }) => {
  const client = useLCDClient();
  const [priceList] = usePrices() || [];
  return useQuery({
    queryKey: ['delegations', priceList, address],
    queryFn: () => getDelegation(client, priceList, address),
    enabled: !!client && !!address && !!priceList,
  });
};

export default useDelegations;
