'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, ReactNode } from 'react';
import { ManagedUIContext } from './context';
import { createClient, OAuthStrategy } from '@wix/api-client';
import { collections, products } from '@wix/stores';
import { currentCart } from '@wix/ecom';
import { wixEvents, checkout } from '@wix/events';
import { redirects } from '@wix/redirects-api';
import Cookies from 'js-cookie';
import { WIX_REFRESH_TOKEN } from '@app/constants';
const queryClient = new QueryClient();

const wixClient = createClient({
  modules: {
    products,
    collections,
    currentCart,
    wixEvents,
    checkout,
    redirects,
  },
  auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID! }),
});

const refreshToken = JSON.parse(Cookies.get(WIX_REFRESH_TOKEN) || '{}');
wixClient.auth.setTokens({
  refreshToken,
  accessToken: { value: '', expiresAt: 0 },
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
