import React, { useCallback, useMemo } from 'react';

export interface State {
  displaySidebar: boolean;
  displayNotPremiumModal: boolean;
  sidebarView: string;
}

const initialState = {
  displaySidebar: false,
  displayNotPremiumModal: false,
  sidebarView: 'CART_VIEW',
};

type Action =
  | {
      type: 'OPEN_SIDEBAR';
    }
  | {
      type: 'CLOSE_SIDEBAR';
    }
  | {
      type: 'SET_SIDEBAR_VIEW';
      view: SIDEBAR_VIEWS;
    }
  | { type: 'OPEN_NOT_PREMIUM_MODAL' }
  | { type: 'CLOSE_NOT_PREMIUM_MODAL' };

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
