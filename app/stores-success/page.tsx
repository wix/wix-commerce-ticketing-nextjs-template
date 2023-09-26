import { getWixClient } from '@app/hooks/useWixClientServer';
import { OrderView } from '@app/components/Order/OrderView';

// opt out static rendering because of https://github.com/vercel/next.js/issues/43077
export const dynamic = 'force-dynamic';

export default async function Success({ searchParams }: any) {
  const wixClient = await getWixClient();

  if (!searchParams.orderId) {
    return null;
  }
  const order = await wixClient.orders.getOrder(searchParams.orderId);
  return <OrderView order={order} />;
}
