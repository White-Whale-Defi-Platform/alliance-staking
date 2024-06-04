import React, { useEffect, useState } from 'react'

import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'

const TokenBox = ({ symbol, color }) => (
  <HStack mr="10">
    <Box bg={color} w="4" h="4" borderRadius="50%" mr="2"></Box>
    <Text
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        maxWidth: '80%',
        fontWeight: 500,
      }}
    >
      {symbol}
    </Text>
  </HStack>
)

// Custom Tooltip component
const CustomTooltip = ({ active, payload, dashboardData }) => {
  if (active && payload && payload.length) {
    return (
      <Box style={{
        background: 'rgba(0, 0, 0, 0.75)',
        padding: '5px 10px',
      }}>
        <Text>{`${dashboardData[payload[0].name].symbol}: ${payload[0].payload.percentage}`}</Text>
      </Box>
    )
  }
  return null
}

export const DashboardPieChart = ({ dashboardData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const totalValue = dashboardData.reduce((acc, data) => acc + data.totalValueStaked, 0);
    const adjustedData = dashboardData.map((data) => ({
      tokenSymbol: data.symbol,
      value: data.totalValueStaked,
      color: data.color,
      percentage: `${((data.totalValueStaked / totalValue) * 100).toFixed(2)}%`,
    }));
    setData(adjustedData);
  }, [dashboardData]);

  return (
    <HStack
      alignItems="center"
      alignSelf={'center'}
      justify={'center'}
      pl={8}
      pt={3}
      spacing={35}
      width={'full'}
    >
      <VStack alignItems="start" alignSelf="center" w={240} paddingTop={100}>
        {data?.length > 0 && (
          <Text mt={-100}
            mb={19}
            as="h2"
            fontSize="24"
            fontWeight="900"
            style={{ textTransform: 'capitalize' }}>Total Values Staked</Text>
        )}
        {data?.map((e, index) => {
          if (e?.percentage.split('%')[0].valueOf() > 0.1) {
            return (
              <VStack key={`tokenBox-${e.tokenSymbol + index}`} alignItems={'flex-start'}>
                <TokenBox symbol={e.tokenSymbol} color={e.color} />
              </VStack>
            )
          }
          return null
        })}
      </VStack>
      <PieChart width={500} height={355}>
        <Pie
          data={data}
          cx="42%"
          cy="45%"
          innerRadius={80}
          outerRadius={150}
          dataKey="value"
          stroke="none"
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip dashboardData={dashboardData} />} />
      </PieChart>
    </HStack>
  )
}
