import { useEffect, useRef, useState, Fragment } from 'react';

import { Box, Divider, HStack, Text, VStack, Tooltip } from '@chakra-ui/react';
import { Token } from 'components/Pages/AssetOverview';
import { TokenData } from 'components/Pages/Dashboard';

export interface TooltipProps {
  data: TokenData[];
  label: string;
  isWalletConnected: boolean;
  labelColor?: string;
}

export const CustomTooltip = ({
  data,
  label,
  isWalletConnected,
  labelColor = 'whiteAlpha.600',
}: TooltipProps) => {
  const TokenDetail = ({ tokenType, value }) => (
    <HStack justify="space-between" direction="row" width="full" px={2}>
      <Text color="whiteAlpha.600" fontSize={14}>
        {Token[tokenType]}
      </Text>
      <Text fontSize={14}>
        {isWalletConnected ? `${value.toFixed(6)}` : '$0'}
      </Text>
    </HStack>
  );
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
          {data?.map((e, index) => (
            <Fragment key={e.token}>
              <TokenDetail tokenType={e.token} value={e.value} />
              {(index !== (data?.length || 0) - 1) && (
                <Divider
                  width="93%"
                  borderWidth="0.1px"
                  color="whiteAlpha.300"
                />
              )}
            </Fragment>
          ))}
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
          color={labelColor}
        >
          {label}
        </Text>
        <Box pb={1}>
          {label !== '$0' && (
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
  )
}
