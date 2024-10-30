export const fetchInflation = async (): Promise<number> => {
  const response = await fetch('https://migaloo-api.polkachu.com/cosmos/mint/v1beta1/inflation');
  const data = await response.json();
  return Number(data.inflation);
};
