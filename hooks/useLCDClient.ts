import { useMemo } from 'react';

import { LCDClient } from '@terra-money/feather.js';

const useLCDClient = (chainId: string = 'migaloo-1') => useMemo(() => {
  const configMap = {
    'migaloo-1': {
      lcd: 'https://migaloo-api.polkachu.com:443',
      chainID: 'migaloo-1',
      gasAdjustment: 1.75,
      gasPrices: { uwhale: 1 },
      prefix: 'migaloo',
    },
    'phoenix-1': {
      lcd: 'https://terra-rest.publicnode.com',
      chainID: 'phoenix-1',
      gasAdjustment: 0.01,
      gasPrices: { uluna: 1 },
      prefix: 'terra',
    },
  };

  const config = configMap[chainId];
  if (!config) {
    throw new Error(`Unsupported chainId: ${chainId}`);
  }

  // Pass only the configuration for the selected chain
  return chainId === 'migaloo-1' ? new LCDClient({ 'migaloo-1': {
    lcd: config.lcd,
    chainID: config.chainID,
    gasAdjustment: config.gasAdjustment,
    gasPrices: config.gasPrices,
    prefix: config.prefix,
  } }) : new LCDClient({ 'phoenix-1': {
    lcd: config.lcd,
    chainID: config.chainID,
    gasAdjustment: config.gasAdjustment,
    gasPrices: config.gasPrices,
    prefix: config.prefix,
  } });
}, [chainId]);

export default useLCDClient;
