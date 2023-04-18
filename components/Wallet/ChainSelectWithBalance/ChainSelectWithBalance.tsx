import React from 'react'

import {HStack, Text} from '@chakra-ui/react'
import DisplayBalance from 'components/Wallet/ChainSelectWithBalance/DisplayBalance'

function ChainSelectWithBalance() {
  return (
    <HStack spacing="3">
      <DisplayBalance />
        <Text fontWeight={"bold"}>WHALE</Text>
    </HStack>
  )
}

export default ChainSelectWithBalance
