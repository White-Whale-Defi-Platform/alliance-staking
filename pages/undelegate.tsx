import ActionsComponent from '../components/Pages/Delegations/ActionsComponent';
import { ActionType } from 'components/Pages/Delegations/Dashboard';
import { useRouter } from 'next/router';

const UndelegatePage = () => {
  const router = useRouter();
  const validatorSrcAddress = router.query.validatorSrcAddress;
  const tokenSymbol = router.query.tokenSymbol;

  // @ts-ignore
  return (
    <ActionsComponent
      globalAction={ActionType.undelegate}
      validatorSrcAddress={validatorSrcAddress}
      tokenSymbol={tokenSymbol}
    />
  );
};

export default UndelegatePage;
