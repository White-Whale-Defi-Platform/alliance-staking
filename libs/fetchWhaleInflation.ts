export const fetchInflation = async (): Promise<number> => {
  const response = await fetch(
    'https://ww-migaloo-rest.polkachu.com/cosmos/mint/v1beta1/inflation',
  );
  const data = await response.json();
  return Number(data.inflation);
};
