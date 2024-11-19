import React, { useEffect, useMemo, useState } from 'react';

import { HStack, Image, Text, VStack } from '@chakra-ui/react'
import { useChain } from '@cosmos-kit/react-lite';
import { useCalculateAllianceAprs } from 'components/Pages/Alliance/hooks/useCalculateAllianceAprs';
import AssetTable, { DashboardData } from 'components/Pages/Dashboard/AssetTable';
import { DashboardPieChart } from 'components/Pages/Dashboard/DashboardPieChart';
import { useAssetsData } from 'components/Pages/Dashboard/hooks/useAssetsData';
import { USDCWhaleLogo } from 'components/Pages/Dashboard/USDCWhaleLogo';
import { WhaleBtcLogo } from 'components/Pages/Dashboard/WhaleBtcLogo';
import { WindWhaleLogo } from 'components/Pages/Dashboard/WindWhaleLogo';
import { Apr, useCalculateAprs } from 'components/Pages/Ecosystem/hooks/useCalculateAprs';
import { useAlliances } from 'hooks/useAlliances';
import { useAllTokenList } from 'hooks/useAllTokenList';
import { useGetLPTokenPrices } from 'hooks/useGetLPTokenPrices';
import useValidators from 'hooks/useValidators';
import tokens from 'public/mainnet/tokens.json';
import { useRecoilValue } from 'recoil';
import { chainState } from 'state/chainState';

export const DashboardTab = ({ priceList }) => {
  const { tokensList } = useAllTokenList()
  const { walletChainName } = useRecoilValue(chainState)
  const { address } = useChain(walletChainName)
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([])
  const lpTokenPrices = useGetLPTokenPrices()
  const { alliances: allianceData } = useAlliances()
  const [initialized, setInitialized] = useState<boolean>(false)

  const dashboardTokenSymbols = useMemo(() => [...new Set(tokensList?.map((tok) => tok.symbol))], [tokensList])

  const { vtRewardShares, totalStakedBalances } = useAssetsData()

  const { data: { stakedAmpLuna, stakedBLuna, stakedWhale, stakedWBtc, stakedAmpOSMO, stakedbOsmo } } = useValidators({ address })
  const [aprs, setAprs] = useState<Apr[]>([])
  const allianceAPRs = useCalculateAllianceAprs({ address })
  const otherAprs = useCalculateAprs()

  useEffect(() => {
    if (allianceAPRs?.length === 0 || otherAprs.length === 0 || allianceData?.alliances.length === 0 || !vtRewardShares) {
      return
    }
    const aprs = [...allianceAPRs, ...otherAprs].map((apr) => {
      const vtRewardShare = vtRewardShares.find((info) => info.tokenSymbol === apr.name)
      return {
        ...apr,
        weight: apr?.weight ?? ((vtRewardShare?.distribution || 0) * (allianceData?.alliances.find((alliance) => alliance.name === 'restaking')?.weight || 0)),
      }
    })
    setAprs(aprs)
  }, [vtRewardShares, allianceAPRs, otherAprs])

  useEffect(() => {
    if (!totalStakedBalances || !stakedAmpLuna || !stakedBLuna || !stakedWhale || !stakedWBtc || !stakedAmpOSMO || !stakedbOsmo || !priceList || !lpTokenPrices || aprs.length === 0) {
      return
    }
    const dashboardData = []
    dashboardTokenSymbols.map((symbol) => {
      const assets = tokens.filter((token) => token.symbol === symbol)
      return assets.forEach((asset: any) => {
        const totalStakedBalance = totalStakedBalances.find((balance) => balance.tokenSymbol === symbol)
        const color = tokensList.find((token) => token.symbol === symbol)?.color
        let totalAmount = 0
        let takeRate = 0
        if (asset.tabType === 'alliance') {
          switch (asset.symbol) {
            case 'bLUNA':
              totalAmount = stakedBLuna
              break
            case 'ampLUNA':
              totalAmount = stakedAmpLuna
              break
            case 'WHALE':
              totalAmount = stakedWhale;
              break
            case 'wBTC':
              totalAmount = stakedWBtc
              break
            case 'ampOSMO':
              totalAmount = stakedAmpOSMO
              break
            case 'bOSMO':
              totalAmount = stakedbOsmo
              break
            default:
              totalAmount = totalStakedBalance?.totalAmount || 0
              break
          }
          takeRate = allianceData?.alliances?.find((alliance) => alliance.name === symbol)?.takeRate
        } else {
          totalAmount = totalStakedBalance?.totalAmount || 0
        }

        const apr = aprs?.find((apr) => (apr.name === symbol && (apr.tabType === asset.tabType || asset.symbol === 'WHALE')))
        dashboardData.push({
          logo: symbol === 'USDC-WHALE-LP' ? <USDCWhaleLogo /> : symbol === 'WHALE-wBTC-LP' ? <WhaleBtcLogo /> : symbol === 'WIND-WHALE-LP' ? <WindWhaleLogo /> :
            <Image
              src={asset.logoURI}
              alt="logo-small"
              width="auto"
              maxW="1.5rem"
              maxH="1.5rem"
            />,
          symbol,
          category: asset.tabType,
          totalStaked: totalAmount,
          totalValueStaked: (symbol?.includes('-LP') ? lpTokenPrices?.[symbol] || 0 : symbol === 'mUSDC' ? 1 : priceList[asset.name]) * totalAmount,
          rewardWeight: (apr?.weight || 0) * 100,
          takeRate: takeRate || 0,
          apr: apr?.apr || 0,
          color,
        })
      })
    })
    setDashboardData(dashboardData)
    setInitialized(true)
  }, [vtRewardShares, totalStakedBalances, stakedAmpLuna, stakedBLuna, stakedWhale, stakedWBtc, stakedAmpOSMO, stakedbOsmo, priceList, lpTokenPrices, aprs])
  return <VStack
    pt={12}
    alignItems={'flex-start'}
    spacing={6}>
    <HStack width={'full'} justifyContent={'space-between'}>
      <Text as="h1"
        fontSize="37"
        fontWeight="700">
        Dashboard
      </Text>
    </HStack>
    <AssetTable dashboardData={dashboardData} initialized={initialized} />
    <DashboardPieChart dashboardData={dashboardData} />
  </VStack>
}
