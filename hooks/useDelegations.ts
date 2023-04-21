import {Coins, LCDClient} from "@terra-money/feather.js"
import useClient from "hooks/useClient"
import tokens from "public/mainnet/white_listed_token_info.json"
import usePrice from "./usePrice"
import {num} from "libs/num";
import {useQuery} from "react-query";
import { isTemplateExpression } from "typescript";
import { it } from "node:test";

const getDelegation = async (client: LCDClient | null, priceList: any, delegatorAddress: string): Promise<any> => {

    if (!client) return Promise.resolve([])

    // This needs to be reworked such that if denom is whale we use client.distribution.rewards instead
    const getRewards = (delegations: any) => {
        return Promise.all(delegations?.map(async (item: any) => {
            const {delegator_address, validator_address, denom} = item.delegation

            return item.type==='native' ? await client?.distribution.getReqFromAddress(delegatorAddress)
            .get<{ rewards?: any }>(
                `/cosmos/distribution/v1beta1/delegators/${delegator_address}/rewards/${validator_address}`,
                {}
            ).then(({rewards}) => {
               
                    // We now have {reward: [{denom: "uwhale", amount: "1000000000000000000"}, {denom: "uwhale", amount: "1000000000000000000"}, {denom: "uwhale", amount: "1000000000000000000"}]}
                    // but we need to find duplicates and sum them providing only unique entries

                   
                    // const reward = rewards.reduce((acc: any, item: any) => {
                    //     const {denom, amount} = item
                    //     const index = acc.findIndex((item: any) => item.denom === denom)
                    //     if (index === -1) {
                    //         acc.push({denom, amount})
                    //     } else {

                    //         acc[index].amount = num(acc[index].amount).plus(amount).toString()
                    //     }
                    //     return acc
                    // }, [])

                    console.log(rewards);
                    // console.log(reward)
                    // Rewards looks like this 

                    // [
                    //     {
                    //         "validator_address": "migaloovaloper1rqvctgdpafvc0k9fx4ng8ckt94x723zmp3g0jv",
                    //         "reward": [
                    //             {
                    //                 "denom": "ibc/05238E98A143496C8AF2B6067BABC84503909ECE9E45FBCBAC2CBA5C889FD82A",
                    //                 "amount": "13.675545114000000000"
                    //             },
                    //             {
                    //                 "denom": "ibc/40C29143BF4153B365089E40E437B7AA819672646C45BB0A5F1E10915A0B6708",
                    //                 "amount": "11.115956009000000000"
                    //             },
                    //             {
                    //                 "denom": "uwhale",
                    //                 "amount": "508302.847720519000000000"
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         "validator_address": "migaloovaloper1y5jq37hlz0rf5rqce3f4fdhax48gnn9nkjfqqc",
                    //         "reward": [
                    //             {
                    //                 "denom": "ibc/05238E98A143496C8AF2B6067BABC84503909ECE9E45FBCBAC2CBA5C889FD82A",
                    //                 "amount": "2.711810655000000000"
                    //             },
                    //             {
                    //                 "denom": "ibc/40C29143BF4153B365089E40E437B7AA819672646C45BB0A5F1E10915A0B6708",
                    //                 "amount": "2.204630936700000000"
                    //             },
                    //             {
                    //                 "denom": "uwhale",
                    //                 "amount": "102640.868437078600000000"
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         "validator_address": "migaloovaloper1m9s6jkkt3fnt3qzx5htrsaxd6xhufyvtq4l7ps",
                    //         "reward": [
                    //             {
                    //                 "denom": "ibc/05238E98A143496C8AF2B6067BABC84503909ECE9E45FBCBAC2CBA5C889FD82A",
                    //                 "amount": "2.731074978600000000"
                    //             },
                    //             {
                    //                 "denom": "ibc/40C29143BF4153B365089E40E437B7AA819672646C45BB0A5F1E10915A0B6708",
                    //                 "amount": "2.220227985000000000"
                    //             },
                    //             {
                    //                 "denom": "uwhale",
                    //                 "amount": "101865.327020174100000000"
                    //             }
                    //         ]
                    //     }
                    // ]
                    // const rewardsMap = {};
    // rewards.forEach(({ reward }) => {
    //     reward.forEach(({ denom, amount }) => {
    //         if (denom in rewardsMap) {
    //             rewardsMap[denom] = num(rewardsMap[denom]).plus(amount).toString();
    //         } else {
    //             rewardsMap[denom] = amount;
    //         }
    //     });
    // });
    // const rewardsArray = Object.entries(rewardsMap).map(([denom, amount]) => ({
    //     denom,
    //     amount,
    // }));
    //                 console.log(rewardsArray);
                    // Rewards end result must look like this 
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
                }
            ).catch((e) => {
                return {
                    ...item,
                    rewards: null
                }
            }) 
            : await client?.alliance
                .getReqFromAddress(delegatorAddress)
                .get<{ rewards?: Coins }>(
                    `/terra/alliances/rewards/${delegator_address}/${validator_address}/${denom}`,
                    {}
                ).then(({rewards}) => {
                    return {
                        ...item,
                        rewards,
                    }
                })
                .catch((e) => {
                    return {
                        ...item,
                        rewards: null
                    }
                })
        }))
    }
    // TODO: This needs to be reworked such that we have a generic array with only the details we need 
    const allianceDelegation = await client?.alliance.alliancesDelegation(delegatorAddress)
    const nativeStake = await client.staking.delegations(delegatorAddress);
    const [nativeStakeResponse, allianceStakeResponse] = await Promise.all([nativeStake[0], allianceDelegation]);
    console.log(nativeStakeResponse);
    // End type needs to have balance and rewards and type as native or alliance 
    const delegations = [
        ...nativeStakeResponse.map((item: any) => {
            console.log(item);
            return {
                type: "native",
                delegation: {
                    delegator_address: item.delegator_address || 0,
                    validator_address: item.validator_address || 0,
                    balance: item.balance || 0,
                    denom: item.balance.denom || "",
                }
            }
        }),
        ...allianceStakeResponse?.delegations.map((item: any) => {
            return {
                type: "alliance",
                delegation: item.delegation
            }
        })
    ]

    // This needs to be reworked such that we are working on a list of delegations from both modules 
    return getRewards(allianceDelegation.delegations)
        .then((data) => {
            console.log(data)
            return data?.map((item) => {

                const delegatedToken = tokens.find((token) => token.denom === item.delegation.balance?.denom || token.denom === item.balance?.denom)
                console.log(delegatedToken);
                console.log(item)
                // If item type is native we need to return the uwhale token with 0 amount 
                const rewardTokens =  item.rewards.map((r)=> {
                    
                    const token = tokens.find(t=>t.denom===r.denom)
                    return {
                        amount: r?.amount,
                        name: token.name,
                        decimals: token.decimals,
                        denom: token.denom
                    }
                })


                //delegation amount
                const amount = delegatedToken ? num(item.balance?.amount).div(10 ** delegatedToken.decimals).toNumber() : 0
                const dollarValue = delegatedToken ? num(amount).times(priceList[delegatedToken.name]).dp(2).toNumber() : 0
                //rewards amount
                const rewards = rewardTokens.map((rt)=> {
                    const amount = num(rt.amount).div(10 ** rt.decimals).dp(rt.decimals).toNumber()
                    return {
                        amount: amount,
                        dollarValue: num(amount).times(priceList[rt.name]).dp(3).toNumber(),
                        denom: rt.denom
                    }
                })
                return {
                    ...item,
                    rewards: rewards,
                    token: {
                        ...delegatedToken,
                        amount,
                        dollarValue
                    }
                }
            })
        })
        .then((data) => {
            console.log({totalDelegation: data})
            // sum to total delegation
            const totalDelegation = data.reduce((acc, item) => {
                const { dollarValue } = item.token
                return {
                    dollarValue: acc.dollarValue + dollarValue
                }
            }, { dollarValue: 0 })
            return {
                delegations: data,
                totalDelegation: totalDelegation?.dollarValue?.toFixed(2),
            }

        })

}

const useDelegations = ({address}) => {
    const client = useClient()
    const [priceList] = usePrice() || []
    return useQuery({
        queryKey: ['delegations', priceList, address],
        queryFn: () => getDelegation(client, priceList,address),
        enabled: !!client && !!address && !!priceList,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: 5000
    })

}

export default useDelegations;