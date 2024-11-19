import { Box, HStack, Image } from '@chakra-ui/react'

export const WindWhaleLogo = () => <HStack spacing="0" ml={-2} mr={5}>
  <Box
    boxShadow="lg"
    borderRadius="full"
    position="absolute"
    zIndex={0}>
    <Image
      src={'/logos/wind.png'}
      width="auto"
      maxW="1.6rem"
      maxH="1.6rem"
      alt="token1-img"
    />
  </Box>
  <Box
    boxShadow="lg"
    borderRadius="full"
    position="absolute"
    pl={'8px'}
    zIndex={1}>
    <Image
      src={'/logos/whale.svg'}
      width="auto"
      maxW="1.6rem"
      maxH="1.6rem"
      alt="token2-img"
    />
  </Box>
</HStack>
