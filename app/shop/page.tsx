import { getWixClient } from '@app/hooks/useWixClientServer';
import { products } from '@wix/stores';
import { Shop } from '@app/components/Shop/Shop';

export default async function StoresCategoryPage() {
  const wixClient = await getWixClient();
  let items: products.Product[] = [];
  try {
    items = (await wixClient.products.queryProducts().limit(20).find()).items;
  } catch (err) {
    console.error(err);
  }
  return <Shop items={items} />;
}
