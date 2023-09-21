import { products } from '@wix/stores';
import testIds from '@app/utils/test-ids';
import { WixMediaImage } from '@app/components/Image/WixMediaImage';

export function Shop({ items }: { items: products.Product[] }) {
  return (
    <div className="mx-auto">
      <div
        className="bg-black text-custom-1 text-center py-4 sm:py-10 sm:py-20 h-[450px] sm:h-[520px]"
        data-testid={testIds.SHOP_PAGE.HEADER}
      >
        <h1 className="uppercase text-3xl sm:text-6xl">Merch</h1>
        <p className="text-sm sm:text-base mx-auto px-8 sm:max-w-[50%] my-10">
          I’m a paragraph. I’m a great space to write about what makes the
          products special and explain how customers can benefit from these
          items.
        </p>
      </div>
      {items.length ? (
        <div
          className="full-w overflow-hidden mx-auto text-center mt-[-200px] sm:mt-[-130px] px-10"
          data-testid={testIds.PRODUCT_LIST.CONTAINER}
        >
          <ul className="grid sm:grid-cols-3 gap-8 grid-flow-row">
            {items.map((item) => (
              <li
                key={item._id}
                className="relative"
                data-testid={testIds.PRODUCT_ITEM.CONTAINER}
              >
                <a
                  href={`/product-page/${item.slug}`}
                  data-testid={testIds.PRODUCT_ITEM.PRODUCT_DETAILS_CTA}
                >
                  <div className="h-auto max-w-full">
                    <WixMediaImage
                      media={item.media?.mainMedia?.image?.url}
                      height={560}
                      width={560}
                      alt={
                        item.media?.mainMedia?.image?.altText || 'main image'
                      }
                    />
                  </div>
                  {!item.manageVariants && item.stock?.inStock ? (
                    <a
                      data-testid={testIds.PRODUCT_ITEM.BUY_NOW_CTA}
                      className="btn-main absolute -mt-10 left-0 cursor-pointer"
                      href={`/api/quick-buy/${item._id}?quantity=1`}
                    >
                      Buy Now
                    </a>
                  ) : (
                    <button
                      className="btn-main absolute -mt-10 left-0 cursor-pointer"
                      disabled
                    >
                      Out of Stock
                    </button>
                  )}
                  <div className="p-2 text-left">
                    <span>{item.name}</span>
                    <br />
                    <span className="text-xs">
                      {item.price!.formatted!.price}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-3xl w-full text-center p-9 box-borderbox-border max-w-4xl mx-auto">
          No products found. Click{' '}
          <a
            href="https://manage.wix.com/account/site-selector?actionUrl=+https%3A%2F%2Fmanage.wix.com%2Fdashboard%2F%7BmetaSiteId%7D%2Fstore%2Fproducts%3FreferralInfo%3DHeadless"
            target="_blank"
            rel="noreferrer"
            className="text-purple-500"
          >
            here
          </a>{' '}
          to go to the business dashboard to add products. Once added, they will
          appear here.
        </div>
      )}
    </div>
  );
}
