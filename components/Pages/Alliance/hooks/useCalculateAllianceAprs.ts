import { useMemo } from 'react';

import { Token } from 'components/Pages/AssetOverview';
import { Apr } from 'components/Pages/Ecosystem/hooks/useCalculateAprs';
import { useAlliances } from 'hooks/useAlliances';
import usePrices from 'hooks/usePrices';
import useValidators from 'hooks/useValidators';
import { useTotalYearlyWhaleEmission } from 'hooks/useWhaleInfo';

export const useCalculateAllianceAprs = ({ address }) => {
  const { totalYearlyWhaleEmission } = useTotalYearlyWhaleEmission()
  const { alliances: allianceData } = useAlliances()

  const { data: validatorData } = useValidators({ address });
  const [priceList] = usePrices() || []
  const whalePrice = priceList?.Whale

  const alliances = useMemo(() => allianceData?.alliances || [],
    [allianceData?.alliances])

  const summedAllianceWeights = useMemo(() => (alliances?.
    map((alliance) => Number(alliance?.weight))?.
    reduce((acc, e) => acc + (isNaN(e) ? 0 : e), 0) ?? 0) + 0.05, // 5% for VT,
  [alliances])

  const allianceAPRs : Apr[] = useMemo(() => alliances?.map((alliance) => {
    if (alliance.name === Token.WHALE) {
      const apr = Number(((totalYearlyWhaleEmission * (1 - summedAllianceWeights)) /
                        (validatorData?.stakedWhale || 0)) *
                    100)
      return {
        tabType: 'native',
        name: Token.WHALE,
        apr,
        weight: 1 - summedAllianceWeights || 1,
      };
    } else {
      const apr = !isNaN(alliance.totalDollarAmount)
        ? ((totalYearlyWhaleEmission * whalePrice * (alliance?.weight || 0)) /
                        (alliance?.totalDollarAmount || 1)) *
                    100
        : 0;
      return {
        tabType: 'alliance',
        name: alliance.name,
        apr,
        weight: alliance?.weight,
      }
    }
  }), [alliances, totalYearlyWhaleEmission, whalePrice])

  return allianceAPRs || []
}
