import { LCDClient } from '@terra-money/feather.js';
import { useMemo } from 'react';
import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import { useConnectedWallet } from '@terra-money/wallet-provider';
export const useClient = () => {
  const connectedWallet = useConnectedWallet();

  const lcdClient = useMemo(() => {
    return new LCDClient({
      'migaloo-1': {
        lcd: 'https://ww-migaloo-rest.polkachu.com/',
        chainID: 'migaloo-1',
        gasAdjustment: 1.75,
        gasPrices: { uwhale: 0.25 },
        prefix: 'migaloo',
      },
    });
  }, []);

  return useMemo(() => {
    return new TerraStationWallet(
      connectedWallet,
      lcdClient,
      'mainnet',
      'migaloo-1',
    );
  }, [lcdClient, connectedWallet]);
};

export default useClient;
