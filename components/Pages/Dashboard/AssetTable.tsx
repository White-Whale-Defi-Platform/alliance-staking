import React, { useState } from 'react'

import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import {
  ColumnDef,
  createColumnHelper, flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Loader from 'components/Loader'

export type DashboardData = {
  logo: any
  symbol: string
  category: string
  totalStaked: number
  totalValueStaked: number
  rewardWeight: number
  takeRate: number
  apr: number
}

const columnHelper = createColumnHelper<DashboardData>()

const columns: ColumnDef<DashboardData, any>[] = [
  columnHelper.accessor('logo', {
    header: () => null,
    cell: (info) => (
      info.getValue()
    ),
  }),
  columnHelper.accessor('symbol', {
    header: () => (
      <Text
        as="span"
        color="brand.50"
        fontSize="sm"
        textTransform="capitalize">
        Symbol
      </Text>
    ),
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('category', {
    header: () => (
      <Text
        as="span"
        color="brand.50"
        fontSize="sm">
        Category
      </Text>
    ),
    cell: (info) => (info.row.original.symbol === 'WHALE' ? 'Native' : info.getValue().charAt(0).
      toUpperCase() + info.getValue().slice(1)),
  }),
  columnHelper.accessor('totalStaked', {
    enableSorting: true,
    header: () => (
      <Text
        as="span"
        color="brand.50"
        minW="150px"
        fontSize="sm"
      >
        Total Staked
      </Text>
    ),
    cell: (info) => (info.row.original.symbol === 'wBTC' ? info.getValue()?.toLocaleString('en-US', {
      minimumFractionDigits: 8,
      maximumFractionDigits: 8,
    }) : info.getValue()?.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })),
  }),
  columnHelper.accessor('totalValueStaked', {
    enableSorting: true,
    header: () => (
      <Text
        as="span"
        color="brand.50"
        minW="150px"
        fontSize="sm"
      >
        Total Value Staked
      </Text>
    ),
    cell: (info) => `$${info.getValue()?.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
  }),
  columnHelper.accessor('rewardWeight', {
    enableSorting: true,
    header: () => (
      <Text
        as="span"
        color="brand.50"
        flex={1}
        fontSize="sm">
        Reward Weight
      </Text>
    ),
    cell: (info) => `${info.getValue()?.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}%`,
  }),
  columnHelper.accessor('takeRate', {
    enableSorting: true,
    header: () => (
      <Text
        as="span"
        color="brand.50"
        flex={1}
        fontSize="sm">
        Take Rate
      </Text>
    ),
    cell: (info) => `${info.getValue()?.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}%`,
  }),
  columnHelper.accessor('apr', {
    enableSorting: true,
    header: () => (
      <Text
        as="span"
        color="brand.50"
        flex={1}
        fontSize="sm"
        textTransform="capitalize">
        APR
      </Text>
    ),
    cell: (info) => `${info.getValue()?.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}%`,
  }),
]

const AssetTable = ({ dashboardData, initialized }) => {
  const [sorting, setSorting] = useState<any>([
    {
      desc: true,
      id: 'totalValueStaked',
    },
  ])

  const columnMinWidths = [
    '15px', // Logo
    '180px', // Symbol
    '145px', // Category
    '145px', // Total Staked
    '180px', // Total Value Staked
    '150px', // Reward Weight
    '150px', // Take Rate
    '150px', // APR
  ];

  const rewardAssets = dashboardData.filter((asset: any) => asset.rewardWeight !== 0)
  const inactiveAssets = dashboardData.filter((asset: any) => asset.rewardWeight === 0)

  const table = useReactTable({
    data: dashboardData,
    columns,
    state: {
      sorting,
      columnVisibility: {
        duration: true,
        value: true,
        weight: true,
        action: true,
        status: false,
      },
      rowSelection: { enabled: false },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <VStack width="full" minW="1270px" borderRadius={'30px'} pr={5} pb={5}>
      {initialized && (
        <>
          {table.getHeaderGroups()?.map((headerGroup) => (
            <HStack
              key={headerGroup.id}
              width="full"
              py="4"
              px="8"
              position="relative"
            >
              {headerGroup.headers.map((header, index) => (
                <Box
                  key={header.id}
                  minW={index === 0 ? '15px' : index === 1 ? '180px' : index === 2 ? '145px' : index === 3 ? '145px' : index === 4 ? '180px' : index === 5 ? '150px' : index === 6 ? '150px' : 'unset'}
                  cursor={header.column.getCanSort() ? 'pointer' : 'default'}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <HStack>
                    <Box>
                      {flexRender(header.column.columnDef.header,
                        header.getContext())}
                    </Box>
                    {header?.column?.columnDef?.enableSorting && (
                      <VStack width="fit-content" p="0" m="0" spacing="0">
                        <TriangleUpIcon
                          fontSize="8px"
                          color={
                            header.column.getIsSorted() === 'asc' ? 'white' : 'gray'
                          }
                        />
                        <TriangleDownIcon
                          fontSize="8px"
                          color={
                            header.column.getIsSorted() === 'desc'
                              ? 'white'
                              : 'gray'
                          }
                        />
                      </VStack>
                    )}
                  </HStack>
                </Box>
              ))}
            </HStack>
          ))}
          {table.getRowModel().rows.filter((row: any) => rewardAssets.includes(row.original)).map((row) => {
            const visibleCells = row.getVisibleCells();
            const noRewards = visibleCells[5].getContext().getValue() === 0;
            return (
              <HStack
                key={row.id + row.index}
                width="full"
                borderRadius="30px"
                backgroundColor="rgba(0, 0, 0, 0.5)"
                py="5"
                px="8"
              >
                {visibleCells.map((cell, index) => (
                  <Text
                    color={noRewards ? 'brand.50' : 'white'}
                    key={cell.id + row.id}
                    minW={columnMinWidths[index] || 'unset'}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Text>
                ))}
              </HStack>
            );
          })}

          <HStack width={'full'} justifyContent={'space-between'} py={8}> {/* Added padding on the y-axis */}
            <Text as="h2"
              fontSize="30"
              fontWeight="700">
              Inactive Assets
            </Text>
          </HStack>
          {table.getHeaderGroups()?.map((headerGroup) => (
            <HStack
              key={headerGroup.id}
              width="full"
              py="4"
              px="8"
              position="relative"
            >
              {headerGroup.headers.map((header, index) => (
                <Box
                  key={header.id}
                  minW={index === 0 ? '15px' : index === 1 ? '180px' : index === 2 ? '145px' : index === 3 ? '145px' : index === 4 ? '180px' : index === 5 ? '150px' : index === 6 ? '150px' : 'unset'}
                  cursor={header.column.getCanSort() ? 'pointer' : 'default'}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <HStack>
                    <Box>
                      {flexRender(header.column.columnDef.header,
                        header.getContext())}
                    </Box>
                    {header?.column?.columnDef?.enableSorting && (
                      <VStack width="fit-content" p="0" m="0" spacing="0">
                        <TriangleUpIcon
                          fontSize="8px"
                          color={
                            header.column.getIsSorted() === 'asc' ? 'white' : 'gray'
                          }
                        />
                        <TriangleDownIcon
                          fontSize="8px"
                          color={
                            header.column.getIsSorted() === 'desc'
                              ? 'white'
                              : 'gray'
                          }
                        />
                      </VStack>
                    )}
                  </HStack>
                </Box>
              ))}
            </HStack>
          ))}
          {table.getRowModel().rows.filter((row: any) => inactiveAssets.includes(row.original)).map((row) => {
            const visibleCells = row.getVisibleCells();
            const noRewards = visibleCells[5].getContext().getValue() === 0;
            return (
              <HStack
                key={row.id + row.index}
                width="full"
                borderRadius="30px"
                backgroundColor="rgba(0, 0, 0, 0.5)"
                py="5"
                px="8"
              >
                {visibleCells.map((cell, index) => (
                  <Text
                    color={noRewards ? 'brand.50' : 'white'}
                    key={cell.id + row.id}
                    minW={columnMinWidths[index] || 'unset'}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Text>
                ))}
              </HStack>
            );
          })}
        </>
      )}
      {!initialized && <Loader height={'7rem'} width={'7rem'} />}
      {(dashboardData?.length === 0 && initialized) && (
        <Text color="brand.50" fontSize="sm" textTransform="capitalize">
          No whitelisted assets found
        </Text>
      )}
    </VStack>
  )
}

export default AssetTable
