import React, { FC, useState } from 'react'

import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Asset } from 'types/blockchain';

import AssetList from './AssetList';
import SearchInput from './SearchInput';

interface AssetSelectModalProps {
  children: any
  currentTokenSymbol: string;
  onChange: (asset: Asset, isTokenChange?: boolean) => void;
  disabled: boolean;
  amount?: number;
}

const AssetSelectModal: FC<AssetSelectModalProps> = ({
  children,
  onChange,
  currentTokenSymbol,
  disabled,
  amount,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState<string>('')

  const onAssetChange = (asset, isTokenChange) => {
    setSearch(asset?.asset)
    const newAsset = { ...asset,
      amount }
    onChange(newAsset, isTokenChange)
    onClose();
  }
  return (
    <>
      <HStack
        tabIndex={0}
        role="button"
        onClick={() => !disabled && onOpen()}
        justifyContent="space-between"
        width={['full', 'fit-content']}
      >
        {children}
      </HStack>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        size={{ base: 'full',
          md: '2xl' }}
      >
        <ModalOverlay />
        <ModalContent backgroundColor="#212121">
          <ModalHeader>Select Token</ModalHeader>
          <ModalBody
            as={VStack}
            gap={3}
            paddingX="unset"
            alignItems="flex-start"
          >
            <SearchInput onChange={setSearch} />
            <AssetList
              amount={amount}
              onChange={onAssetChange}
              search={search}
              currentTokenSymbol={currentTokenSymbol}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AssetSelectModal;
