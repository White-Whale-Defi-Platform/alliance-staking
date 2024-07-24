import { FC } from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { HStack, IconButton, Text } from '@chakra-ui/react';
import { useChain } from '@cosmos-kit/react-lite';
import ValidatorSelectModal from 'components/Pages/Alliance/ValidatorInput/ValidatorSelectModal';
import { useRecoilValue } from 'recoil';
import { chainState } from 'state/chainState';

interface ValidatorInputProps {
  image?: boolean;
  onChange: (value: any, isTokenChange?: boolean) => void;
  showList?: boolean;
  onInputFocus?: () => void;
  disabled?: boolean;
  delegatedOnly: boolean;
  ignoreSlack?: boolean;
  validatorName?: string;
  validatorList?: any[];
}

const ValidatorInput: FC<ValidatorInputProps> = (props) => {
  const { walletChainName } = useRecoilValue(chainState)
  const { address } = useChain(walletChainName)
  return (
    <HStack
      width={['full', '510px']}
      border="1px solid rgba(255, 255, 255, 0.1)"
      borderRadius="30px"
      height={12}
      paddingX={2}
      justifyContent={'flex-end'}
    >
      <HStack flex={1}>
        <ValidatorSelectModal
          onChange={props.onChange}
          address={address}
          delegatedOnly={props.delegatedOnly}
          currentValidator={'Validator'} // [tokenInfo?.symbol || hideToken]
          validatorList={props?.validatorList || []}
          disabled={false}
        >
          {props.showList && (
            <HStack>
              <Text pl="4">{props.validatorName ?? 'Choose Validator'}</Text>
              <IconButton
                disabled={props.disabled}
                variant="unstyled"
                color="white"
                aria-label="go back"
                icon={<ChevronDownIcon />}
              />
            </HStack>
          )}
        </ValidatorSelectModal>
      </HStack>
    </HStack>
  );
};

export default ValidatorInput;
