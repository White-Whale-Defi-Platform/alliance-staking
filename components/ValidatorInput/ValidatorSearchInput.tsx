import React, { FC, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { HStack, Input } from '@chakra-ui/react';

interface Props {
  onChange?: (value: string) => void;
}

const ValidatorSearchInput: FC<Props> = ({ onChange }) => {
  const [search, setSearch] = useState<string>('');

  return (
    <HStack paddingX={6} width="full">
      <HStack
        borderRadius="100px"
        border="1px solid rgba(255, 255, 255, 0.1)"
        width="full"
        paddingY={3}
        paddingX={6}
      >
        <Input
          placeholder="Search Validator"
          variant="unstyled"
          color="brand.500"
          onChange={({ target: { value } }) => {
            console.log(value);
            setSearch(value);
          }}
        />
        <SearchIcon color="green.500" />
      </HStack>
    </HStack>
  );
};

export default ValidatorSearchInput;
