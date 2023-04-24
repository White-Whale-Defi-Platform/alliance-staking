import { HStack, VStack, Text, Box, Tooltip } from '@chakra-ui/react';
import Loader from 'components/Loader';
import React, { FC, useMemo } from 'react';
import { CustomTooltip } from 'components/Pages/Delegations/CustomTooltip';
import { TokenData } from 'components/Pages/Delegations/Dashboard';
import InfoIcon from 'components/icons/InfoIcon';

interface CardComponentProps {
  title: string;
  tokenData: TokenData[];
  isLoading: boolean;
  isWalletConnected: boolean;
  isUndelegations?: boolean;
}

const CardComponent: FC<CardComponentProps> = ({
  title,
  tokenData,
  isLoading,
  isWalletConnected,
  isUndelegations = false,
}) => {
  const sumAndMultiplyValues = useMemo(() => {
    return isLoading
      ? 0
      : tokenData?.reduce((total, item) => {
          return (
            total +
            (item?.dollarValue !== undefined ? item?.dollarValue ?? 0 : 0)
          );
        }, 0);
  }, [tokenData, isLoading]);

    const summedAndMultipliedValues = useMemo(() => {
        return isWalletConnected ? `$${sumAndMultiplyValues.toFixed(2).toString()}` : "n/a";
    }, [isWalletConnected, sumAndMultiplyValues]);

  return (
    <VStack
      width="full"
      background={'#1C1C1C'}
      pl={7}
      spacing={1}
      borderRadius={'20px'}
      alignItems="flex-start"
      verticalAlign="center"
      minH={130}
      minW={300}
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
          <Loader height={'7rem'} width={'7rem'} />
        </HStack>
      ) : (
        <>
          <HStack>
            <Text color="gray">{title}</Text>
            {isUndelegations && (
              <Tooltip
                label={
                  <Box
                    width="230px"
                    height="50px"
                    borderRadius="10px"
                    bg="black"
                    color="white"
                    fontSize={14}
                    p={4}
                  >
                    Unbonding period of 21 days
                  </Box>
                }
                bg="transparent"
                hasArrow={false}
                placement="bottom"
                closeOnClick={false}
                arrowSize={0}
              >
                <Box>
                  <InfoIcon color={'white'} cursor="pointer" />
                </Box>
              </Tooltip>
            )}
          </HStack>
          <CustomTooltip
            isWalletConnected={isWalletConnected}
            data={tokenData}
            label={`${summedAndMultipliedValues}`}
          />
        </>
      )}
    </VStack>
  );
};

export default CardComponent;
