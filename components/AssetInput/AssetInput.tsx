import React, { useMemo } from 'react';

import { VStack, forwardRef } from '@chakra-ui/react';
import { num } from 'libs/num';

import BalanceWithMaxNHalf from './BalanceWithMax';
import WhaleInput from './WhaleInput';

interface AssetInputProps {
  image?: boolean;
  token: any;
  value: any;
  onChange: (value: any, isTokenChange?: boolean) => void;
  showList?: boolean;
  onInputFocus?: () => void;
  balance?: number;
  tokenPrice?: number;
  disabled?: boolean;
  minMax?: boolean;
  isSingleInput?: boolean;
  hideToken?: string;
  edgeTokenList?: string[];
  ignoreSlack?: boolean;
  hideMax?: boolean;
  hideDollarValue?: boolean;
  showBalanceSlider?: boolean;
  hideLogo?: boolean;
}

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
const AssetInput = forwardRef((props: AssetInputProps, ref) => {
  const {
    balance,
    tokenPrice,
    token,
    onChange,
    hideMax,
    hideDollarValue,
  } = props

  const onMaxClick = () => {
    onChange({
      ...token,
      amount: num(balance === 0 ? 0 : balance).toFixed(token?.decimals || 6),
    })
  }
  const onHalfClick = () => {
    onChange({
      ...token,
      amount: num(balance === 0 ? 0 : balance / 2).toFixed(token?.decimals || 6),
    })
  }

  const numberOfTokens = useMemo(() => `${token?.amount} ${token?.tokenSymbol}`,
    [token])

  const dollarValue = useMemo(() => num(tokenPrice).times(token?.amount).
    dp(6).
    toString(), [tokenPrice, token?.amount])

  const balanceWithDecimals = useMemo(() => num(balance).
    dp(6).
    toString(),
  [balance, token?.decimals])

  return (
    <VStack width="full">
      <WhaleInput {...props} />
      <BalanceWithMaxNHalf
        balance={balanceWithDecimals}
        hideDollarValue={hideDollarValue}
        numberOfTokens={numberOfTokens}
        dollarValue={dollarValue}
        maxDisabled={false}
        hideMax={hideMax}
        onMaxClick={onMaxClick}
        onHalfClick={onHalfClick}
      />
    </VStack>
  )
})

export default AssetInput
