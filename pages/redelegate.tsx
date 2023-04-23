import ActionsComponent from 'components/Pages/Delegations/ActionsComponent';
import { ActionType } from 'components/Pages/Delegations/Dashboard';
import { useRouter } from 'next/router';

const RedelegatePage = () => {
  const router = useRouter();
  const validatorDestAddress = router.query.validatorDestAddress;
  const validatorSrcAddress = router.query.validatorSrcAddress;
  const tokenSymbol = router.query.tokenSymbol;

  // @ts-ignore
  return (
    <ActionsComponent
      globalAction={ActionType.redelegate}
      validatorDestAddress={validatorDestAddress}
      validatorSrcAddress={validatorSrcAddress}
      tokenSymbol={tokenSymbol}
    />
  );
};

export default RedelegatePage;
