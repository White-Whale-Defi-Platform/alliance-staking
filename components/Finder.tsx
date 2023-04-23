import { ReactNode } from 'react';

import { Link } from '@chakra-ui/react';

import { truncate } from 'libs/text';

type Props = {
  chainId: string;
  txHash: string;
  children?: ReactNode;
};

const getUrl = (chainId, txHash) => {
  switch (chainId) {
    case 'migaloo-1':
      return `https://explorer.silknodes.io/migaloo/tx/${txHash}`;
    case 'narwhal-1':
    default:
      return null;
  }
};

const Finder = ({ children, txHash, chainId }: Props) => {
  return (
    <Link isExternal href={getUrl(chainId, txHash)}>
      {children} TxHash: {truncate(txHash, [4, 4])}
    </Link>
  );
};

export default Finder;
