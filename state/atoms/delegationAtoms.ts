import { atom } from 'recoil';
export interface DelegationState {
  tokenSymbol: string;
  amount: number;
  decimals: number;
  validatorDestAddress: string;
  validatorSrcAddress: string | null;
  denom: string;
  validatorDestName?: string;
  validatorSrcName?: string;
}
export const delegationAtom = atom<DelegationState>({
  key: 'delegationAtom',
  default: {
    tokenSymbol: null,
    amount: 0,
    validatorDestAddress: null,
    validatorSrcAddress: null,
    decimals: 6,
    denom: null,
  },
  effects_UNSTABLE: [],
});
