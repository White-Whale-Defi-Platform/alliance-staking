import { Token } from 'components/Pages/AssetOverview';

export const getColorByTokenSymbol = (symbol: string): string => {
  switch (symbol) {
    case Token.WHALE:
      return '#13B55A'
    case Token.ASH:
      return 'lightgreen'
    case Token.ampLUNA:
      return '#ADD8FD'
    case Token.bLUNA:
      return 'orange'
    case Token.mUSDC:
      return '#189AE9'
    case Token['USDC-WHALE-LP']:
      return 'yellow'
    case Token['WHALE-wBTC-LP']:
      return 'red'
    case Token.wBTC:
      return 'darkorange'
    case Token.ampOSMO:
      return '#BAA8FD'
    case Token.bOSMO:
      return 'purple'
    case Token.OPHIR:
      return 'lightgreen'
    case Token.MOAR:
      return 'lightgreen'
    case Token.gASH:
      return 'blue'
    case Token.RAC:
      return '#009076'
    case Token.FROG:
      return 'green'
    case Token.XUSK:
      return '#BAAAAD'
    case Token.arbWHALE:
      return 'green'
    case Token.lsdSHARK:
      return '#AFD700'
    case Token.LAB:
      return '#FFD700'
    case Token.SAIL:
      return '#FFA700'
    case Token.WIND:
      return '#00ffff'
    case Token.ampKUJI:
      return 'red'
    default:
      return 'grey'
  }
}
