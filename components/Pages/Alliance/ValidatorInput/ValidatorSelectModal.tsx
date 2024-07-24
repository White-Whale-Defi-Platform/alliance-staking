import React, { FC, ReactNode, useState } from 'react';

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
import ValidatorList, { ValidatorInfo } from 'components/Pages/Alliance/ValidatorInput/ValidatorList';
import ValidatorSearchInput from 'components/Pages/Alliance/ValidatorInput/ValidatorSearchInput';

interface ValidatorSelectModalProps {
  children: ReactNode;
  currentValidator: string;
  address: string;
  validatorList: ValidatorInfo[];
  onChange: (validator: any) => void;
  disabled: boolean;
  delegatedOnly: boolean;
  amount?: number;
}

const ValidatorSelectModal: FC<ValidatorSelectModalProps> = ({
  children,
  onChange,
  delegatedOnly,
  address,
  validatorList,
  disabled,
  amount,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState<string>('');

  const onValidatorChange = (validator) => {
    onChange(validator);
    onClose();
  };

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
          <ModalHeader>Validator</ModalHeader>
          <ModalBody
            as={VStack}
            gap={3}
            paddingX="unset"
            alignItems="flex-start"
          >
            <ValidatorSearchInput onChange={setSearch} />
            <ValidatorList
              delegatedOnly={delegatedOnly}
              amount={amount}
              onChange={onValidatorChange}
              search={search}
              validatorList={validatorList}
              currentValidator={''}
              address={address}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ValidatorSelectModal;
