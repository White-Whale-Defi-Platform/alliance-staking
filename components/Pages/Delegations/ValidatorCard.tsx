import { Button, HStack, Text } from '@chakra-ui/react';
import Loader from 'components/Loader';
import React, { FC } from 'react';
import { ActionType } from 'components/Pages/Delegations/Dashboard';
import { useRouter } from 'next/router';

interface ValidatorCardProps {
  name: string;
  isLoading: boolean;
  voting_power: number;
  commission: number;
}
const ValidatorCard: FC<ValidatorCardProps> = ({
  name,
  isLoading,
  voting_power,
  commission,
}) => {
  const router = useRouter();

  const onClick = async (action: ActionType) => {
    await router.push(`/${ActionType[action]}`);
  };
  const hasFunds = true;
  const hasActiveDelegations = false;
  const hasActiveUndelegations = true;

  return (
    <HStack
      background={'#1C1C1C'}
      borderRadius={'30px'}
      px={5}
      alignItems="center"
      verticalAlign="center"
      minH={75}
      minW={800}
      spacing={20}
      justifyContent="space-between"
      width="100%"
      overflow="hidden"
      position="relative"
      display="flex"
    >
      {isLoading ? (
        <HStack
          minW={100}
          minH={100}
          width="full"
          alignContent="center"
          justifyContent="center"
          alignItems="center"
        >
          <Loader />
        </HStack>
      ) : (
        <>
          <Text>{name}</Text>
          <Text>{`${voting_power}%`}</Text>
          <Text>{`${commission}%`}</Text>
          <HStack spacing={5}>
            <Button
              alignSelf="center"
              borderRadius="full"
              width="100%"
              disabled={!hasFunds}
              minWidth={130}
              isLoading={false}
              onClick={() => onClick(ActionType.delegate)}
              bg="transparent"
              borderWidth="2px"
              borderColor="white"
              color="white"
              _hover={{
                borderColor: '#7CFB7D',
                color: '#7CFB7D',
              }}
            >
              Delegate
            </Button>
            <Button
              alignSelf="center"
              borderRadius="full"
              width="100%"
              disabled={true}
              minWidth={130}
              isLoading={false}
              onClick={() => onClick(ActionType.undelegate)}
              bg="transparent"
              borderWidth="2px"
              borderColor="white"
              color="white"
              _hover={{
                borderColor: '#7CFB7D',
                color: '#7CFB7D',
              }}
            >
              Redelegate
            </Button>
            <Button
              alignSelf="center"
              borderRadius="full"
              width="100%"
              disabled={true}
              minWidth={130}
              isLoading={false}
              onClick={() => onClick(ActionType.redelegate)}
              bg="transparent"
              borderWidth="2px"
              borderColor="white"
              color="white"
              _hover={{
                borderColor: '#7CFB7D',
                color: '#7CFB7D',
              }}
            >
              Undelegate
            </Button>
          </HStack>
        </>
      )}
    </HStack>
  );
};

export default ValidatorCard;
