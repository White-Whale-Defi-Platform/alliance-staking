import {useQueries} from 'react-query';
import {fetchTotalSupply} from "libs/fetchTotalWhaleSupply";
import {fetchInflation} from "libs/fetchWhaleInflation";

export const useTotalYearlyWhaleEmission = () => {
    const queries = useQueries([
        {
            queryKey: 'totalSupply',
            queryFn: fetchTotalSupply,
            refetchOnMount: true,
        },
        {
            queryKey: 'inflation',
            queryFn: fetchInflation,
        },
    ]);

    const [totalSupplyData, inflationData] = queries;
    // 10% into community pool
    const totalYearlyWhaleEmission = (totalSupplyData?.data ?? 0) * (inflationData?.data ?? 0) * 0.9
    return {
        totalYearlyWhaleEmission
    };
};





