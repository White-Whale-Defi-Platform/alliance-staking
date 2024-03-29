import ActionsComponent from 'components/Pages/Alliance/ActionsComponent';
import { ActionType } from 'components/Pages/Dashboard';
import { useRouter } from 'next/router';

const UndelegatePage = () => {
  const router = useRouter();
  const { validatorSrcAddress } = router.query;
  const { tokenSymbol } = router.query;

  return (
    <ActionsComponent
      globalAction={ActionType.undelegate}
      validatorSrcAddress={validatorSrcAddress as string}
      tokenSymbol={tokenSymbol as string}
    />
  );
};

export default UndelegatePage;
