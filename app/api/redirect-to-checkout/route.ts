import { NextRequest, NextResponse } from 'next/server';
import { getRequestUrl } from '@app/utils/server-utils';
import { getWixClient } from '@app/hooks/useWixClientServer';

export async function GET(request: NextRequest) {
  const requestUrl = getRequestUrl(request);
  const baseUrl = new URL('/', requestUrl).toString();
  const { searchParams } = new URL(requestUrl);
  const checkoutId = searchParams.get('checkoutId')!;
  const wixClient = await getWixClient();

  const { redirectSession } = await wixClient.redirects.createRedirectSession({
    ecomCheckout: { checkoutId },
    callbacks: {
      postFlowUrl: baseUrl,
      thankYouPageUrl: `${baseUrl}stores-success`,
      cartPageUrl: `${baseUrl}cart`,
    },
  });

  return NextResponse.redirect(redirectSession!.fullUrl!);
}
