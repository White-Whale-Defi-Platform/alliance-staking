import { FC, useMemo } from 'react';

import { Box, Button, HStack, Text } from '@chakra-ui/react';
import useValidators from 'hooks/useValidators';

type ValidatorListProps = {
  // assetList?: Asset[];
  onChange: (validator) => void;
  search: string;
  address: string;
  currentValidator: string;
  validatorList: string[];
  amount?: number;
  delegatedOnly: boolean;
};

const ValidatorList: FC<ValidatorListProps> = ({
  onChange,
  search,
  delegatedOnly = false,
  address,
}) => {
  const { data: { validators = [] } = {} } = useValidators({ address });

  const validatorsWithDelegation = useMemo(() => {
    if (!validators?.length) return [];

    return validators
      ?.map((validator) => ({
        ...validator,
      }))
      .filter((v) => (delegatedOnly ? v.delegated : true));
  }, [validators]);

  const filteredValidators = useMemo(() => {
    if (!!!search) return validatorsWithDelegation;

    return validatorsWithDelegation.filter(({ description }) =>
      description?.moniker.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, validatorsWithDelegation]);

  //// useFilter<any>(tokensWithBalance, 'symbol', search)

  return (
    <Box
      borderY="1px solid rgba(0, 0, 0, 0.5)"
      paddingY={2}
      width="full"
      paddingX={6}
      height="full"
      flex={1}
      maxHeight={200}
      minHeight={200}
      overflowY="scroll"
      sx={{
        '&::-webkit-scrollbar': {
          width: '.4rem',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0,0,0,0.8)',
        },
      }}
    >
      {filteredValidators.map((validator, index) => (
        <HStack
          key={validator?.operator_address}
          as={Button}
          variant="unstyled"
          width="full"
          justifyContent="space-between"
          paddingY={4}
          paddingX={4}
          borderBottom={
            index == filteredValidators?.length - 1
              ? 'unset'
              : '1px solid rgba(0, 0, 0, 0.5)'
          }
          onClick={() => onChange(validator)}
        >
          <HStack>
            <Text fontSize="18" fontWeight="400">
              {validator?.description.moniker}
            </Text>
          </HStack>
          <Text fontSize="16" fontWeight="400">
            {`${Number(validator?.votingPower || 0)}%`}
          </Text>
        </HStack>
      ))}
      {!filteredValidators?.length && (
        <HStack
          as={Button}
          variant="unstyled"
          width="full"
          justifyContent="flex-start"
          paddingY={2}
          paddingX={4}
        >
          <Text fontSize="18" fontWeight="400">
            No validators found
          </Text>
        </HStack>
      )}
    </Box>
  );
};

export default ValidatorList;
