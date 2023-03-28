import { ProductSidebar } from '../../components/Product/ProductSidebar/ProductSidebar';
import { ImageGalleryClient } from '../../components/ImageGallery/ImageGallery.client';
import { getWixClient } from '../../hooks/useWixClientServer';
export default async function StoresCategoryPage({ params }: any) {
  if (!params.slug) {
    return;
  }
  const wixClient = await getWixClient();
  const { items } = await wixClient.products
    .queryProducts()
    .eq('slug', params.slug)
    .limit(1)
    .find();
  const product = items[0];
  return (
    <div className="mx-auto px-14 mt-12">
      {product ? (
        <div className="full-w overflow-hidden max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="box-border flex flex-col basis-1/2">
              <div>
                <ImageGalleryClient items={product.media!.items!} />
              </div>
            </div>
            <div className="flex flex-col w-full h-full basis-1/2 text-left">
              <ProductSidebar key={product._id} product={product} />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-3xl w-full text-center p-9 box-border">
          No product found
        </div>
      )}
    </div>
  );
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
