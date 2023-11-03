import { FC, ReactNode } from 'react';
import { isMobile } from 'react-device-detect';
import { Flex, useMediaQuery } from '@chakra-ui/react';
import MobileNotSupportedModal from '../Wallet/Modal/MobileNotSupportedModal';
import RadialGradient from './RadialGradient';
import Header from 'components/Header/Header';
import Status from 'components/Status';
import {MIGALOO_CHAIN_ID} from "constants/common";

interface Props {
  children: ReactNode;
}
const AppLayout: FC<Props> = ({ children }) => {
  const [isMobileView] = useMediaQuery('(max-width: 480px)');

  return (
    <>
      {(isMobile || isMobileView) && <MobileNotSupportedModal />}
      {!(isMobile || isMobileView) && (
        <Flex
          direction="column"
          backgroundColor="transparent"
          height="100vh"
          // paddingBottom={8}
        >
          <RadialGradient />
          <Header />
          <Flex
            key={MIGALOO_CHAIN_ID}
            justifyContent="center"
            mx="auto"
            maxWidth="container.xl"
            marginBottom={20}
            width="full"
            flex="1 1 auto "
          >
            {children}
          </Flex>
          <Flex paddingY={10} paddingX={6} alignSelf="flex-end">
            <Status />
          </Flex>
        </Flex>
      )}
    </>
  )
}

export default AppLayout
