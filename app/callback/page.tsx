'use client';
import Cookies from 'js-cookie';
import { useWixClient } from '@app/hooks/useWixClient';

export default async function CallbackPage() {
  const wixClient = useWixClient();
  const state = Cookies.get('oauthState');
  if (!state) {
    return <div>Invalid state</div>;
  }
  const oAuthState = JSON.parse(state);
  // Cookies.remove('oauthState');

  const tokens = await wixClient.auth.getMemberTokens(
    window.location.search,
    oAuthState
  );
  Cookies.set('wixMemberSession', JSON.stringify(tokens));

  window.location.href = oAuthState.origin;
}
