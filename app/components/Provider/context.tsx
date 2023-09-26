import React, { useMemo } from 'react';

export interface State {
  displaySidebar: boolean;
  displayNotPremiumModal: boolean;
  displayLoginModal: boolean;
  displayBackInStockModal: boolean;
  sidebarView: string;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  closeSidebarIfPresent: () => void;
  setSidebarView: (view: SIDEBAR_VIEWS) => void;
  openModalNotPremium: () => void;
  closeModalNotPremium: () => void;
  openModalLogin: () => void;
  closeModalLogin: () => void;
  openModalBackInStock: () => void;
  closeModalBackInStock: () => void;
}

const actionOutSideProvider = () => {
  throw new Error('Action called without provider');
};

const initialState = {
  displaySidebar: false,
  displayNotPremiumModal: false,
  displayLoginModal: false,
  displayBackInStockModal: false,
  sidebarView: 'CART_VIEW',
  openSidebar: actionOutSideProvider,
  closeSidebar: actionOutSideProvider,
  toggleSidebar: actionOutSideProvider,
  closeSidebarIfPresent: actionOutSideProvider,
  setSidebarView: actionOutSideProvider,
  openModalNotPremium: actionOutSideProvider,
  closeModalNotPremium: actionOutSideProvider,
  openModalLogin: actionOutSideProvider,
  closeModalLogin: actionOutSideProvider,
  openModalBackInStock: actionOutSideProvider,
  closeModalBackInStock: actionOutSideProvider,
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

export const UIContext = React.createContext<State>(initialState);

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

const UIProvider = (props: any) => {
  const [state, dispatch] = React.useReducer(uiReducer, initialState);

  const value = useMemo(
    () => ({
      ...state,
      openSidebar: () => dispatch({ type: 'OPEN_SIDEBAR' }),
      closeSidebar: () => dispatch({ type: 'CLOSE_SIDEBAR' }),
      toggleSidebar: () => {
        state.displaySidebar
          ? dispatch({ type: 'CLOSE_SIDEBAR' })
          : dispatch({ type: 'OPEN_SIDEBAR' });
      },
      closeSidebarIfPresent: () => {
        if (state.displaySidebar) {
          dispatch({ type: 'CLOSE_SIDEBAR' });
        }
      },
      setSidebarView: (view: SIDEBAR_VIEWS) =>
        dispatch({ type: 'SET_SIDEBAR_VIEW', view }),
      openModalNotPremium: () => dispatch({ type: 'OPEN_NOT_PREMIUM_MODAL' }),
      closeModalNotPremium: () => dispatch({ type: 'CLOSE_NOT_PREMIUM_MODAL' }),
      openModalLogin: () => dispatch({ type: 'OPEN_LOGIN_MODAL' }),
      closeModalLogin: () => dispatch({ type: 'CLOSE_LOGIN_MODAL' }),
      openModalBackInStock: () =>
        dispatch({ type: 'OPEN_BACK_IN_STOCK_MODAL' }),
      closeModalBackInStock: () =>
        dispatch({ type: 'CLOSE_BACK_IN_STOCK_MODAL' }),
    }),
    [state]
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
