import React, { useMemo } from 'react';

import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useChain } from '@cosmos-kit/react-lite';
import CustomButton from 'components/CustomButton';
import Delegate, { TokenBalance } from 'components/Pages/Alliance/Delegate';
import useAllianceTransaction from 'components/Pages/Alliance/hooks/useAllianceTransaction';
import Redelegate from 'components/Pages/Alliance/Redelegate';
import Undelegate from 'components/Pages/Alliance/Undelegate';
import { ActionType } from 'components/Pages/Dashboard';
import useDelegations from 'hooks/useDelegations';
import { useAllianceTokenBalance } from 'hooks/useTokenBalance';
import { useRouter } from 'next/router';
import whiteListedTokens from 'public/mainnet/white_listed_alliance_token_info.json';
import { useRecoilState, useRecoilValue } from 'recoil';
import { chainState } from 'state/chainState';
import { delegationState, DelegationState } from 'state/delegationState';
import { TxStep } from 'types/blockchain';

interface ActionsComponentProps {
    globalAction: ActionType;
    validatorDestAddress?: string;
    validatorSrcAddress?: string;
    tokenSymbol?: string;
}

const ActionsComponent = ({
  globalAction,
  validatorDestAddress = null,
  validatorSrcAddress,
  tokenSymbol = 'WHALE-wBTC-LP',
}: ActionsComponentProps) => {
  const { walletChainName } = useRecoilValue(chainState)
  const { isWalletConnected, openView } = useChain(walletChainName)

  const router = useRouter()

  const [currentDelegationState, setCurrentDelegationState] =
    useRecoilState<DelegationState>(delegationState)

  const { submit, txStep } = useAllianceTransaction()

  const { data: { delegations = [] } = {} } = useDelegations()

  const { data: balances } = useAllianceTokenBalance()

  const liquidTokenPriceBalances: TokenBalance[] =
    whiteListedTokens?.map((tokenInfo, index) => ({
      balance: balances?.[index],
      tokenSymbol: tokenInfo.symbol,
    })) ?? []

  const buttonLabel = useMemo(() => {
    const valSrc =
      !currentDelegationState?.validatorSrcAddress
        ? null
        : currentDelegationState?.validatorSrcAddress;
    const valDest =
      !currentDelegationState?.validatorDestAddress
        ? null
        : currentDelegationState?.validatorDestAddress;

    if (!isWalletConnected) {
      return 'Connect Wallet';
    } else if (
      valSrc === null &&
      valDest === null &&
      globalAction === ActionType.redelegate
    ) {
      return 'Choose Validators'
    } else if (
      valSrc === null &&
      (globalAction === ActionType.undelegate ||
        globalAction === ActionType.redelegate)
    ) {
      return 'Choose Validator'
    } else if (valDest === null && globalAction !== ActionType.undelegate) {
      return 'Choose Validator'
    } else if (currentDelegationState?.amount === 0) {
      return 'Enter Amount'
    } else {
      return ActionType[globalAction]
    }
  }, [isWalletConnected, currentDelegationState, globalAction])

  const DelegationActionButton = ({ action }) => {
    const actionString = ActionType[action].toString()
    const onClick = async () => {
      setCurrentDelegationState({
        ...currentDelegationState,
        amount: 0,
        validatorSrcAddress: null,
        validatorDestAddress: null,
      });
      await router.push({
        pathname: actionString,
        query: { tokenSymbol: currentDelegationState.tokenSymbol },
      })
    }

    return (
      <Button
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#6ACA70',
          },
        }}
        color={globalAction === action ? 'white' : 'grey'}
        backgroundColor="rgba(0, 0, 0, 1)"
        fontSize={20}
        px={5}
        transform="translate(0%, -55%)"
        style={{ textTransform: 'capitalize' }}
        onClick={onClick}
      >
        {actionString}
      </Button>
    );
  };

  return (
    <VStack
      width={{ base: '100%',
        md: '650px' }}
      alignItems="flex-start"
      top={200}
      gap={4}
      position="absolute"
    >
      <HStack justifyContent="space-between" width="full" paddingY={5}>
        <IconButton
          variant="unstyled"
          color="white"
          fontSize="28px"
          aria-label="go back"
          icon={<ArrowBackIcon />}
          onClick={async () => {
            await router.push('/');
            setCurrentDelegationState({
              ...currentDelegationState,
              amount: 0,
              validatorDestName: '',
              validatorSrcName: '',
              validatorSrcAddress: '',
              validatorDestAddress: '',
            });
          }}
        />
        <Text
          as="h2"
          fontSize="24"
          fontWeight="900"
          style={{ textTransform: 'capitalize' }}
        >
          {ActionType[globalAction]}
        </Text>
      </HStack>
      <VStack
        width="full"
        backgroundColor="rgba(0, 0, 0, 0.5)"
        borderRadius={'30px'}
        alignItems="flex-start"
        verticalAlign="flex-start"
        top={70}
        maxH={660}
        gap={4}
        as="form"
        position="absolute"
        pb={7}
        left="50%"
        transform="translateX(-50%)"
        display="flex"
      >
        <Box
          border="0.5px solid grey"
          borderRadius="30px"
          minH={160}
          minW={570}
          alignSelf="center"
          mt={'50px'}
        >
          <HStack spacing={0} justify="center">
            <DelegationActionButton action={ActionType.delegate} />
            <DelegationActionButton action={ActionType.redelegate}/>
            <DelegationActionButton action={ActionType.undelegate} />
          </HStack>
          {(() => {
            switch (globalAction) {
              case ActionType.delegate:
                return (
                  <Delegate
                    balance={liquidTokenPriceBalances}
                    validatorDestAddress={validatorDestAddress}
                    tokenSymbol={tokenSymbol}
                  />
                );
              case ActionType.redelegate:
                return (
                  <Redelegate
                    validatorDestAddress={validatorDestAddress}
                    validatorSrcAddress={validatorSrcAddress}
                    delegations={delegations}
                    tokenSymbol={tokenSymbol}
                  />
                );
              case ActionType.undelegate:
                return (
                  <Undelegate
                    delegations={delegations}
                    validatorSrcAddress={validatorSrcAddress}
                    tokenSymbol={tokenSymbol}
                  />
                )
              default:
                return null
            }
          })()}
        </Box>
        <CustomButton
          buttonLabel={buttonLabel}
          onClick={ () => {
            if (isWalletConnected) {
              submit(
                globalAction,
                currentDelegationState.validatorDestAddress,
                currentDelegationState.validatorSrcAddress,
                currentDelegationState.amount,
                currentDelegationState.denom,
                currentDelegationState.decimals,
              );
            } else {
              openView()
            }
          }}
          disabled={
            txStep === TxStep.Estimating ||
              txStep === TxStep.Posting ||
              txStep === TxStep.Broadcasting ||
              (currentDelegationState.amount <= 0 && isWalletConnected) ||
              (currentDelegationState?.validatorDestAddress === null &&
                globalAction === ActionType.delegate) ||
              (currentDelegationState?.validatorSrcAddress === null &&
                (globalAction === ActionType.undelegate ||
                  globalAction === ActionType.redelegate))
          }
          loading={
            txStep === TxStep.Estimating ||
              txStep === TxStep.Posting ||
              txStep === TxStep.Broadcasting
          }
          height="57px"
          width="563px"
        />
      </VStack>
      )
    </VStack>
  );
};

export default ActionsComponent;
