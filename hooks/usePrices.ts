import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { getTokenPrice } from 'hooks/getPrice'

const usePrices = () => {
  const { data: priceList } = useQuery({
    queryKey: ['priceList'],
    queryFn: getTokenPrice,
    refetchInterval: 60_000,
  })

  return useMemo(() => priceList, [priceList])
}

export default usePrices
