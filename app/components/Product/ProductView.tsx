import { ProductSidebar } from './ProductSidebar/ProductSidebar';
import { ImageGalleryClient } from '@app/components/ImageGallery/ImageGallery.client';
import testIds from '@app/utils/test-ids';
import { products } from '@wix/stores';

export function ProductView({ product }: { product: products.Product }) {
  return (
    <div className="mx-auto px-14 mt-12">
      {product ? (
        <div
          className="full-w overflow-hidden max-w-7xl mx-auto"
          data-testid={testIds.PRODUCT_DETAILS.CONTAINER}
        >
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
        <div className="text-3xl w-full text-center p-9 box-border max-w-4xl mx-auto">
          Product Not Found
        </div>
      )}
    </div>
  );
}
