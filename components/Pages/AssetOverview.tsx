import {
  Box,
  HStack,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react'
import Loader from 'components/Loader'
import { Cell, Pie, PieChart } from 'recharts'

export enum Token {
  WHALE = 'WHALE',
  ampLUNA = 'ampLUNA',
  bLUNA = 'bLUNA',
  mUSDC = 'mUSDC',
  ASH = 'ASH',
  wBTC = 'wBTC',
  'USDC-WHALE-LP' = 'USDC-WHALE-LP',
  'WHALE-wBTC-LP' = 'WHALE-wBTC-LP',
  ampOSMO = 'ampOSMO',
  bOSMO = 'bOSMO',
  OPHIR = 'OPHIR',
  MOAR = 'MOAR',
  gASH = 'gASH',
  RAC = 'RAC',
  FROG = 'FROG',
  XUSK = 'xUSK',
  arbWHALE = 'arbWHALE',
  lsdSHARK = 'lsdSHARK',
  LAB = 'LAB',
  SAIL = 'SAIL',
}

export enum TokenType {
  liquid,
  delegated,
  undelegated,
  rewards,
}

const AssetOverview = ({
  isWalletConnected,
  isLoading,
  data,
  aprs,
}) => {
  const borderRadius = '30px';

  const aggregatedAssets = data?.reduce((acc, e) => acc + (e?.value ?? 0), 0);
  return (
    <VStack
      width="full"
      backgroundColor="rgba(0, 0, 0, 0.5)"
      borderRadius={borderRadius}
      alignItems="flex-start"
      verticalAlign="center"
      h={320}
      w={1500}
      as="form"
      overflow="hidden"
      position="relative"
      display="flex"
      justifyContent="center"
    >
      {isLoading ? (
        <HStack
          minW={100}
          minH={100}
          width="full"
          alignContent="center"
          justifyContent="center"
          alignItems="center"
        >
          <Loader/>
        </HStack>
      ) : (
        <HStack
          alignItems="center"
          justifyContent="space-between"
          pl={5}
          py={5}
          spacing={35}
        >
          <Box height={290} minW={100} overflowY="auto" backgroundColor="#1C1C1C"
            borderRadius="20px">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th borderBottomWidth="0"><Text color={'grey'}as="span"
                    minW="150px">{'Delegated Assets'}</Text></Th>
                  <Th borderBottomWidth="0"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((e) => {
                  const apr = aprs?.find((apr) => apr.name === e.tokenSymbol)
                  return (
                    <Tr key={`row-${e.token}`}>
                      <Td borderBottomWidth="0">
                        <VStack alignItems="start">
                          <HStack><Box bg={e.color} w="4" h="4" borderRadius="50%" mr="2"></Box><Text paddingBottom={2}>{e.token}</Text></HStack>
                          <Text color="gray">APR ≈ {apr?.apr.toFixed(1)}%</Text>
                        </VStack>
                      </Td>
                      <Td isNumeric borderBottomWidth="0">
                        <Text>{isWalletConnected ? `$${e.dollarValue?.toFixed(2)}` : '$0'}</Text>
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </Box>
          <PieChart style={{ pointerEvents: 'none' }} width={290} height={275}>
            <Pie
              data={
                isWalletConnected && aggregatedAssets !== 0
                  ? data
                  : [{ value: 1 }]
              }
              cx="42%"
              cy="50%"
              innerRadius={95}
              outerRadius={120}
              dataKey="value"
              stroke="none"
            >
              {isWalletConnected ? (
                data?.map((e, index: number) => (
                  <Cell key={`cell-${index}-${e.symbol}`} fill={data[index].color}/>
                ))
              ) : (
                <Cell fill="grey"/>
              )}
            </Pie>
          </PieChart>
        </HStack>
      )}
    </VStack>
  );
};
export default AssetOverview;
