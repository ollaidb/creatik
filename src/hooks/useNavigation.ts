import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationState {
  from?: string;
  returnTo?: string;
}

export const useSmartNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateWithReturn = (to: string, returnTo?: string) => {
    const state: NavigationState = {
      from: location.pathname,
      returnTo: returnTo || location.pathname
    };
    navigate(to, { state });
  };

  const navigateBack = () => {
    const state = location.state as NavigationState;
    const returnTo = state?.returnTo || state?.from || '/';
    navigate(returnTo);
  };

  const getReturnPath = (): string => {
    const state = location.state as NavigationState;
    return state?.returnTo || state?.from || '/';
  };

  return {
    navigateWithReturn,
    navigateBack,
    getReturnPath
  };
};
