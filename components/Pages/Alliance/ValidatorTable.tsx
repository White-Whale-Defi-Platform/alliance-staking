import React, { useEffect, useMemo, useState } from 'react';

import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Validator } from '@terra-money/feather.js';
import { ActionType } from 'components/Pages/Dashboard';
import useDelegations from 'hooks/useDelegations';
import useValidators from 'hooks/useValidators';
import { useRouter } from 'next/router';
import Commission = Validator.Commission;

type Props = {
  selectedStatus: any;
  address: string;
};
type TableProps = {
  name: string;
  votingPower: any;
  commission: Commission;
  status: string;
  actionButtons: any
};

const columnHelper = createColumnHelper<TableProps>();

const columns: ColumnDef<TableProps, any>[] = [
  columnHelper.accessor('name', {
    header: () => (
      <Text
        as="span"
        color="brand.50"
        flex={1}
        fontSize="sm"
        textTransform="capitalize"
      >
        Name
      </Text>
    ),
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('votingPower', {
    enableSorting: true,
    header: () => (
      <Text
        as="span"
        color="brand.50"
        minW="200px"
        fontSize="sm"
        textTransform="capitalize"
      >
        Voting Power
      </Text>
    ),
    cell: (info) => `${info.getValue()}%`,
  }),
  columnHelper.accessor('commission', {
    enableSorting: true,
    header: () => (
      <Text
        as="span"
        color="brand.50"
        minW="200px"
        fontSize="sm"
        textTransform="capitalize"
      >
        Commission
      </Text>
    ),
    cell: (info) => `${info.getValue()}%`,
  }),
  columnHelper.accessor('actionButtons', {
    header: () => (
      <Text
        as="span"
        color="brand.50"
        flex={1}
        fontSize="sm"
        textTransform="capitalize"
      >
        Action
      </Text>
    ),
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {}),
];

const ValidatorTable = ({ selectedStatus, address }: Props) => {
  const [sorting, setSorting] = useState<any>([
    {
      desc: false,
      id: 'status',
    },
  ]);
  const router = useRouter();

  const { data: { validators = [] } = {} } = useValidators({ address });

  const { data: { delegations = [] } = {} } = useDelegations();

  const tableData = useMemo(() => {
    if (!validators?.length) {
      return [];
    }
    const onClick = async (action: ActionType, validatorAddress: string) => {
      const tokenSymbol = 'ampLUNA'
      if (action === ActionType.delegate) {
        const validatorDestAddress = validatorAddress;
        await router.push({
          pathname: `/alliance/${ActionType[action]}`,
          query: { validatorDestAddress,
            tokenSymbol },
        });
      } else if (action === ActionType.undelegate) {
        const validatorSrcAddress = validatorAddress;
        await router.push({
          pathname: `/alliance/${ActionType[action]}`,
          query: { validatorSrcAddress,
            tokenSymbol },
        });
      } else if (action === ActionType.redelegate) {
        const validatorSrcAddress = validatorAddress;
        await router.push({
          pathname: `/alliance/${ActionType[action]}`,
          query: { validatorSrcAddress,
            tokenSymbol },
        });
      }
    };
    const getIsActive = (validator) => {
      const delegation = delegations.find(({ delegation }) => delegation.validator_address === validator.validator_addr);
      return delegation ? 'active' : 'inactive';
    };
    // Shuffle the validators before returning
    return validators?.
      sort(() => Math.random() - 0.5)?.
      map((validator) => ({
        name: validator?.description?.moniker,
        votingPower: validator.votingPower,
        commission: validator.commission,
        status: getIsActive(validator),
        actionButtons: (
          <HStack spacing={5}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onClick(ActionType.delegate, validator.operator_address)
              }
            >
              Delegate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onClick(ActionType.redelegate, validator.operator_address)
              }
            >
              Redelegate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onClick(ActionType.undelegate, validator.operator_address)
              }
            >
              Undelegate
            </Button>
          </HStack>
        ),
      }));
  }, [validators]);

  const dataRows = useMemo(() => {
    if (selectedStatus === 'all') {
      return tableData;
    }
    return tableData.filter((item) => item.status === selectedStatus);
  }, [selectedStatus, tableData]);

  const table = useReactTable({
    data: dataRows,
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
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  useEffect(() => {
    table.setColumnFilters(selectedStatus !== 'all' ? [{ id: 'status',
      value: selectedStatus }] : []);
  }, [selectedStatus, table]);

  return (
    <VStack width="full" minW="800px" overflowX="auto">
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
              flex={index === 0 || index === 3 ? 1 : 'unset'}
              minW={index === 1 || index === 2 ? '200px' : 'unset'}
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
      {table.getRowModel().rows?.map((row) => (
        <HStack
          key={row.id}
          width="full"
          borderRadius="30px"
          backgroundColor="rgba(0, 0, 0, 0.5)"
          py="5"
          px="8"
        >
          {row.getVisibleCells().map((cell, index) => (
            <Text
              key={cell.id}
              as={index === 3 ? HStack : 'span'}
              flex={index === 0 || index === 3 ? 1 : 'unset'}
              minW={index === 1 || index === 2 ? '200px' : 'unset'}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Text>
          ))}
        </HStack>
      ))}
      {!tableData?.length && (
        <Text color="brand.50" fontSize="sm" textTransform="capitalize">
          No validators found
        </Text>
      )}
      {Boolean(tableData?.length) && (
        <HStack w="full" justifyContent="space-between" pt="3">
          <Text>
            Showing {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()} pages
          </Text>
          <HStack gap="2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              isDisabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              isDisabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </HStack>
        </HStack>
      )}
    </VStack>
  );
};

export default ValidatorTable;
