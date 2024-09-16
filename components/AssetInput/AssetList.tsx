import { FC, useMemo } from 'react';

import { Box, Button, HStack, Image, Text } from '@chakra-ui/react'
import FallbackImage from 'components/FallbackImage'
import { ActionType } from 'components/Pages/Dashboard'
import useDelegations from 'hooks/useDelegations';
import useFilter from 'hooks/useFilter'
import { useQueryStakedBalances } from 'hooks/useQueryStakedBalances';
import { useMultipleTokenBalanceAssetlist } from 'hooks/useTokenBalance'
import { useTokenList } from 'hooks/useTokenList'
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { tabState } from 'state/tabState';

type AssetListProps = {
  onChange: (token: any, isTokenChange?: boolean) => void;
  search: string;
  currentTokenSymbol: string;
  amount?: number
  actionType?: ActionType
};

const AssetList: FC<AssetListProps> = ({
  onChange,
  search,
  currentTokenSymbol,
  amount,
}) => {
  const tabType = useRecoilValue(tabState)
  const { tokens } = useTokenList()
  const router = useRouter()
  const { data: restakedBalances } = useQueryStakedBalances()
  const { data: delegations } = useDelegations()

  const tokenBalance = useMultipleTokenBalanceAssetlist(
    tabType, router, delegations, restakedBalances,
  )

  const tokensWithBalance = useMemo(() => {
    if (tokenBalance?.length === 0) {
      return tokens?.filter(({ symbol }) => currentTokenSymbol !== symbol)
    }
    return tokens?.
      map((token, index) => ({
        ...token,
        balance: tokenBalance?.[index],
      })).
      filter(({ symbol }) => currentTokenSymbol !== symbol)
  }, [tokens, tokenBalance, currentTokenSymbol])

  const filterAssets = useFilter<any>(
    'symbol',
    !search ? '' : search,
    tokensWithBalance,
  )

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
      {filterAssets?.map((item, index) => (
        <HStack
          key={item?.name}
          as={Button}
          variant="unstyled"
          width="full"
          justifyContent="space-between"
          paddingY={4}
          paddingX={4}
          borderBottom={
            index === ((filterAssets?.length || 0) - 1)
              ? 'unset'
              : '1px solid rgba(0, 0, 0, 0.5)'
          }
          onClick={() => onChange({
            tokenSymbol: item?.symbol,
            amount,
          }, true)
          }
        >
          <HStack>
            <Image
              src={item?.logoURI}
              alt="logo-small"
              width="auto"
              maxW="1.5rem"
              maxH="1.5rem"
              fallback={<FallbackImage />}
            />
            <Text fontSize="18" fontWeight="400">
              {item?.symbol}
            </Text>
          </HStack>
          <Text fontSize="16" fontWeight="400">
            {Number(item?.balance || 0).toFixed(2)}
          </Text>
        </HStack>
      ))}
      {!filterAssets?.length && (
        <HStack
          as={Button}
          variant="unstyled"
          width="full"
          justifyContent="flex-start"
          paddingY={2}
          paddingX={4}
        >
          <Text fontSize="18" fontWeight="400">
            No asset found
          </Text>
        </HStack>
      )}
    </Box>
  )
}

export default AssetList;
