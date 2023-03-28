import { createClient, OAuthStrategy } from '@wix/api-client';
import { collections, products } from '@wix/stores';
import { orders } from '@wix/ecom';
import { wixEvents, checkout, schedule } from '@wix/events';

export const getWixClient = async () => {
  const wixClient = createClient({
    modules: { products, collections, wixEvents, checkout, schedule, orders },
    auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID! }),
  });
  const tokens = await wixClient.auth.generateVisitorTokens();
  wixClient.auth.setTokens(tokens);
  return wixClient;
};
