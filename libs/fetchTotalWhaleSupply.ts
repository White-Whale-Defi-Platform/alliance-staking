import { convertMicroDenomToDenom } from 'util/conversion';

type Token = {
  denom: string;
  amount: string;
};

export async function fetchTotalSupply(): Promise<number> {
  try {
    const response = await fetch(
      'https://ww-migaloo-rest.polkachu.com/cosmos/bank/v1beta1/supply',
    );
    const data = await response.json();

    const uwhale = data.supply.find((item: Token) => item.denom === 'uwhale');
    return uwhale ? convertMicroDenomToDenom(uwhale.amount, 6) : null;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}
