import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { getTokenPrice } from 'hooks/getPrice';

const usePrice = () => {
  const { data: priceList } = useQuery({
    queryKey: ['priceList'],
    queryFn: getTokenPrice,
    refetchInterval: 1000 * 10,
    refetchIntervalInBackground: true,
  });

  return useMemo(() => priceList, [priceList]);
};

export default usePrice;
