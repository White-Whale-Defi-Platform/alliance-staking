import { Box, Divider, HStack, Text, VStack, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Token } from './AssetOverview';
import { TokenData } from 'components/Pages/Delegations/Dashboard';

export interface TooltipProps {
  data: TokenData[];
  label: string;
  isWalletConnected: boolean;
}

export const CustomTooltip = ({
  data,
  label,
  isWalletConnected,
}: TooltipProps) => {
  const TokenDetail = ({ tokenType, value }) => {
    return (
      <HStack justify="space-between" direction="row" width="full" px={2}>
        <Text color="whiteAlpha.600" fontSize={14}>
          {Token[tokenType]}
        </Text>
        <Text fontSize={14}>
          {isWalletConnected ? `${value.toLocaleString()}` : 'n/a'}
        </Text>
      </HStack>
    );
  };
  const textRef = useRef(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    setTextWidth(textRef.current.offsetWidth);
  }, [label]);

  return (
    <Tooltip
      sx={{ boxShadow: 'none' }}
      label={
        <VStack
          minW="250px"
          minH="50px"
          borderRadius="10px"
          bg="blackAlpha.900"
          px="4"
          py="4"
          position="relative"
          border="none"
          justifyContent="center"
          alignItems="center"
        >
          {data?.map((e, index) => {
            return (
              <React.Fragment key={e.token}>
                <TokenDetail tokenType={e.token} value={e.value} />
                {index !== data.length - 1 && (
                  <Divider
                    width="93%"
                    borderWidth="0.1px"
                    color="whiteAlpha.300"
                  />
                )}
              </React.Fragment>
            );
          })}
        </VStack>
      }
      bg="transparent"
    >
      <VStack alignItems="flex-start" minW={100}>
        <Text
          fontSize={27}
          fontWeight={'bold'}
          ref={textRef}
          mb="-0.3rem"
          color="white"
        >
          {label}
        </Text>
        <Box pb={1}>
          {label !== 'n/a' && (
            <div
              style={{
                width: `${textWidth}px`,
                height: '1px',
                background: `repeating-linear-gradient(
            to right,
            white,
            white 1px,
            transparent 1px,
            transparent 5px
          )`,
              }}
            />
          )}
        </Box>
      </VStack>
    </Tooltip>
  );
};
