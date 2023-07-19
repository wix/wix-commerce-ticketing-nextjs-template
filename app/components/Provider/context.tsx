import React, { useCallback, useMemo } from 'react';

export interface State {
  displaySidebar: boolean;
  displayNotPremiumModal: boolean;
  displayLoginModal: boolean;
  displayBackInStockModal: boolean;
  sidebarView: string;
}

const initialState = {
  displaySidebar: false,
  displayNotPremiumModal: false,
  displayLoginModal: false,
  displayBackInStockModal: false,
  sidebarView: 'CART_VIEW',
};

type Action =
  | { type: 'OPEN_SIDEBAR' }
  | { type: 'CLOSE_SIDEBAR' }
  | {
      type: 'SET_SIDEBAR_VIEW';
      view: SIDEBAR_VIEWS;
    }
  | { type: 'OPEN_NOT_PREMIUM_MODAL' }
  | { type: 'CLOSE_NOT_PREMIUM_MODAL' }
  | { type: 'OPEN_LOGIN_MODAL' }
  | { type: 'CLOSE_LOGIN_MODAL' }
  | { type: 'OPEN_BACK_IN_STOCK_MODAL' }
  | { type: 'CLOSE_BACK_IN_STOCK_MODAL' };

type SIDEBAR_VIEWS = 'CART_VIEW';

export const UIContext = React.createContext<State | any>(initialState);

UIContext.displayName = 'UIContext';

function uiReducer(state: State, action: Action) {
  switch (action.type) {
    case 'OPEN_SIDEBAR': {
      return {
        ...state,
        displaySidebar: true,
      };
    }
    case 'CLOSE_SIDEBAR': {
      return {
        ...state,
        displaySidebar: false,
      };
    }
    case 'SET_SIDEBAR_VIEW': {
      return {
        ...state,
        sidebarView: action.view,
      };
    }
    case 'OPEN_NOT_PREMIUM_MODAL': {
      return {
        ...state,
        displayNotPremiumModal: true,
      };
    }
    case 'CLOSE_NOT_PREMIUM_MODAL': {
      return {
        ...state,
        displayNotPremiumModal: false,
      };
    }
    case 'OPEN_LOGIN_MODAL': {
      return {
        ...state,
        displayLoginModal: true,
      };
    }
    case 'CLOSE_LOGIN_MODAL': {
      return {
        ...state,
        displayLoginModal: false,
      };
    }
    case 'OPEN_BACK_IN_STOCK_MODAL': {
      return {
        ...state,
        displayBackInStockModal: true,
      };
    }
    case 'CLOSE_BACK_IN_STOCK_MODAL': {
      return {
        ...state,
        displayBackInStockModal: false,
      };
    }
  }
}

export const UIProvider = (props: any) => {
  const [state, dispatch] = React.useReducer(uiReducer, initialState);

  const openSidebar = useCallback(
    () => dispatch({ type: 'OPEN_SIDEBAR' }),
    [dispatch]
  );
  const closeSidebar = useCallback(
    () => dispatch({ type: 'CLOSE_SIDEBAR' }),
    [dispatch]
  );
  const toggleSidebar = useCallback(
    () =>
      state.displaySidebar
        ? dispatch({ type: 'CLOSE_SIDEBAR' })
        : dispatch({ type: 'OPEN_SIDEBAR' }),
    [dispatch, state.displaySidebar]
  );
  const closeSidebarIfPresent = useCallback(
    () => state.displaySidebar && dispatch({ type: 'CLOSE_SIDEBAR' }),
    [dispatch, state.displaySidebar]
  );

  const setSidebarView = useCallback(
    (view: SIDEBAR_VIEWS) => dispatch({ type: 'SET_SIDEBAR_VIEW', view }),
    [dispatch]
  );

  const openModalNotPremium = useCallback(
    () => dispatch({ type: 'OPEN_NOT_PREMIUM_MODAL' }),
    [dispatch]
  );
  const closeModalNotPremium = useCallback(
    () => dispatch({ type: 'CLOSE_NOT_PREMIUM_MODAL' }),
    [dispatch]
  );

  const openModalLogin = useCallback(
    () => dispatch({ type: 'OPEN_LOGIN_MODAL' }),
    [dispatch]
  );
  const closeModalLogin = useCallback(
    () => dispatch({ type: 'CLOSE_LOGIN_MODAL' }),
    [dispatch]
  );

  const openModalBackInStock = useCallback(
    () => dispatch({ type: 'OPEN_BACK_IN_STOCK_MODAL' }),
    [dispatch]
  );
  const closeModalBackInStock = useCallback(
    () => dispatch({ type: 'CLOSE_BACK_IN_STOCK_MODAL' }),
    [dispatch]
  );

  const value = useMemo(
    () => ({
      ...state,
      openSidebar,
      closeSidebar,
      toggleSidebar,
      closeSidebarIfPresent,
      setSidebarView,
      openModalNotPremium,
      closeModalNotPremium,
      openModalLogin,
      closeModalLogin,
      openModalBackInStock,
      closeModalBackInStock,
    }),
    [
      closeModalBackInStock,
      closeModalLogin,
      closeModalNotPremium,
      closeSidebar,
      closeSidebarIfPresent,
      openModalBackInStock,
      openModalLogin,
      openModalNotPremium,
      openSidebar,
      setSidebarView,
      state,
      toggleSidebar,
    ]
  );

  return <UIContext.Provider value={value} {...props} />;
};

export const useUI = () => {
  const context = React.useContext(UIContext);
  if (context === undefined) {
    throw new Error(`useUI must be used within a UIProvider`);
  }
  return context;
};

export const ManagedUIContext = ({
  children,
}: {
  children: React.ReactNode;
}) => <UIProvider>{children}</UIProvider>;
