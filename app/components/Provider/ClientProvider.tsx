'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, ReactNode } from 'react';
import { ManagedUIContext } from './context';
import { createClient, OAuthStrategy } from '@wix/sdk';
import { collections, products } from '@wix/stores';
import { currentCart, backInStockNotifications } from '@wix/ecom';
import { wixEventsV2 as wixEvents, orders as checkout } from '@wix/events';
import { redirects } from '@wix/redirects';
import Cookies from 'js-cookie';
import { WIX_REFRESH_TOKEN } from '@app/constants';
const queryClient = new QueryClient();

const refreshToken = JSON.parse(Cookies.get(WIX_REFRESH_TOKEN) || '{}');

const wixClient = createClient({
  modules: {
    products,
    collections,
    currentCart,
    backInStockNotifications,
    wixEvents,
    checkout,
    redirects,
  },
  auth: OAuthStrategy({
    clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
    tokens: { refreshToken, accessToken: { value: '', expiresAt: 0 } },
  }),
});

export type WixClient = typeof wixClient;

export const WixClientContext = createContext<WixClient>(wixClient);

export const ClientProvider = ({ children }: { children: ReactNode }) => (
  <WixClientContext.Provider value={wixClient}>
    <ManagedUIContext>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ManagedUIContext>
  </WixClientContext.Provider>
);
