import { getWixClient } from '@app/hooks/useWixClientServer';
import { ProductView } from '@app/components/Product/ProductView';

export default async function StoresCategoryPage({ params }: any) {
  if (!params.slug) {
    return;
  }
  const wixClient = await getWixClient();
  const { items } = await wixClient.products
    .queryProducts()
    .eq('slug', decodeURIComponent(params.slug))
    .limit(1)
    .find();
  const product = items[0];
  return <ProductView product={product} />;
}

export async function generateStaticParams(): Promise<{ slug?: string }[]> {
  const wixClient = await getWixClient();
  return wixClient.products
    .queryProducts()
    .limit(10)
    .find()
    .then(({ items }) => {
      return items.map((product) => ({
        slug: product.slug,
      }));
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}
