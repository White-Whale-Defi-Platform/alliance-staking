import React, { FC } from 'react';

import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';

interface IProps {
  statusCode: number;
}

const IndexPageComponent: FC<IProps> = ({ statusCode }) => {
  const heightOfNavbar = '74px';
  const containerPadding = '1rem';

  return (
    <Stack>
      <Flex
        minH={`calc(100vh - ${heightOfNavbar} - ${containerPadding}*2)`}
        justifyContent="center"
        alignItems="center"
      >
        <Stack spacing={4} maxW="xl" mx="auto" color="white">
          <Heading textAlign="center">Oups...</Heading>
          <Text fontSize="xl" lineHeight="tall" textAlign="center">
            {statusCode
              ? `An error ${statusCode} occurred on server`
              : 'An error occurred on client'}
          </Text>
          <Box>
            <Stack isInline align="center" justifyContent="center">
              <Box>
                <Link href="/" passHref>
                  <Button as="a" variant="primary">
                    Return to the home page
                  </Button>
                </Link>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Stack>
  );
};

export default IndexPageComponent;
