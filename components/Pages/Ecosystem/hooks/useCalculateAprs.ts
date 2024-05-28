import { useEffect, useMemo, useState } from 'react';

import { useGetLPTokenPrices } from 'hooks/useGetLPTokenPrices';
import { useGetTotalStakedBalances } from 'hooks/useGetTotalStakedBalances';
import { useGetVTRewardShares } from 'hooks/useGetVTRewardShares';
import usePrices from 'hooks/usePrices';
import { useTotalYearlyWhaleEmission } from 'hooks/useWhaleInfo';
import { getTokenPrice } from 'util/getTokenPrice';

export interface Apr {
    tabType: any;
    name: string
    apr: number
    weight?: number
}
export const useCalculateAprs = () => {
  const [aprs, setAprs] = useState<Apr[]>([])
  const { totalStakedBalances } = useGetTotalStakedBalances()
  const { vtRewardShares } = useGetVTRewardShares()
  const { totalYearlyWhaleEmission } = useTotalYearlyWhaleEmission()
  const vtEmission = useMemo(() => 0.05 / 1.1 * totalYearlyWhaleEmission, [totalYearlyWhaleEmission])
  const [priceList] = usePrices() || []
  const lpTokenPrices = useGetLPTokenPrices()

  useEffect(() => {
    if (!totalStakedBalances || !vtRewardShares || !vtEmission || !priceList || !lpTokenPrices) {
      return
    }
    setAprs(vtRewardShares?.map((info) => {
      const stakedBalance = totalStakedBalances?.find((balance) => balance.denom === info.denom)
      const stakedTokenPrice = getTokenPrice(
        stakedBalance, priceList, lpTokenPrices,
      )
      return {
        tabType: "restaking",
        name: info.tokenSymbol,
        apr: (info.distribution * vtEmission * priceList.Whale / ((stakedBalance?.totalAmount || 0) * stakedTokenPrice)) * 100,
      } as Apr
    }))
  }, [vtEmission, totalStakedBalances, vtRewardShares, priceList, lpTokenPrices])

  return aprs
}
