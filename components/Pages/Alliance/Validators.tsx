import { useState } from 'react';

import { HStack, VStack, Button, Heading } from '@chakra-ui/react';
import ValidatorTable from 'components/Pages/Alliance/ValidatorTable';

const TopBar = ({ setSelectedStatus }) => {
  const [activeButton, setActiveButton] = useState('all')

  return (
    <HStack width="full" justifyContent="space-between">
      <Heading color="white" size="lg">
        Validators
      </Heading>
      <HStack
        margin="20px"
        backgroundColor="rgba(0, 0, 0, 0.25)"
        width="auto"
        px="20px"
        py="10px"
        borderRadius="75px"
        gap="20px"
      >
        {['all', 'active', 'inactive'].map((item) => (
          <Button
            key={item}
            minW="120px"
            variant={activeButton === item ? 'primary' : 'unstyled'}
            color="white"
            size="sm"
            onClick={() => {
              setActiveButton(item);
              setSelectedStatus(item === 'all' ? 'all' : item);
            }}
            textTransform="capitalize"
          >
            {/* The items here are '"all", "active", "inactive"' but these don't make descriptive labels for a user. Instead we want a tertiary operator which if item is 'all' its 'All Validators', if its 'active' we want 'Delegated To' and if 'inactive' we want 'Other Validators'*/}
            {item === 'all'
              ? 'All Validators'
              : item === 'active'
                ? 'Delegated To'
                : 'Other Validators'}
          </Button>
        ))}
      </HStack>
    </HStack>
  );
};

const Validators = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  return (
    <VStack width="full">
      <TopBar setSelectedStatus={setSelectedStatus} />
      <ValidatorTable selectedStatus={selectedStatus} />
    </VStack>
  );
};

export default Validators;
