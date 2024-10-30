import { convertMicroDenomToDenom } from 'util/conversion';

type Token = {
  denom: string;
  amount: string;
};

export const fetchTotalSupply = async (): Promise<number> => {
  try {
    const response = await fetch('https://migaloo-api.polkachu.com/cosmos/bank/v1beta1/supply?pagination.key=dXdoYWxl')
    const data = await response.json()

    const uwhale = data.supply.find((item: Token) => item.denom === 'uwhale');
    return uwhale ? convertMicroDenomToDenom(uwhale.amount, 6) : null;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}
