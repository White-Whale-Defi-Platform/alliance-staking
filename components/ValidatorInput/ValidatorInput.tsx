import { HStack, IconButton, Text } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import ValidatorSelectModal from 'components/ValidatorInput/ValidatorSelectModal';
import { FC } from 'react';
import { useRecoilState } from 'recoil';
import { walletState } from 'state/atoms/walletAtoms';

interface ValidatorInputProps {
  image?: boolean;
  onChange: (value: any, isTokenChange?: boolean) => void;
  showList?: boolean;
  onInputFocus?: () => void;
  disabled?: boolean;
  delegatedOnly: boolean;
  ignoreSlack?: boolean;
  validatorName?: string;
}

const ValidatorInput: FC<ValidatorInputProps> = (props) => {
  const [{ address }, _] = useRecoilState(walletState);
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
          currentValidator={'Validator'} //[tokenInfo?.symbol || hideToken]
          validatorList={[]}
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
