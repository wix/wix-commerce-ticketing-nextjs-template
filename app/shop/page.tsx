import Image from 'next/image';
import { getWixClient } from '../hooks/useWixClientServer';
import { products } from '@wix/stores';
import { PLACEHOLDER_IMAGE } from '@app/constants';

export default async function StoresCategoryPage() {
  const wixClient = await getWixClient();
  let items: products.Product[] = [];
  try {
    items = (await wixClient.products.queryProducts().limit(10).find()).items;
  } catch (err) {
    console.error(err);
  }
  return (
    <div className="mx-auto">
      <div className="bg-black text-custom-1 text-center py-4 sm:py-10 sm:py-20 h-[450px] sm:h-[520px]">
        <h1 className="uppercase text-3xl sm:text-6xl">Merch</h1>
        <p className="text-sm sm:text-base mx-auto px-8 sm:max-w-[50%] my-10">
          I’m a paragraph. I’m a great space to write about what makes the
          products special and explain how customers can benefit from these
          items.
        </p>
      </div>
      {items.length ? (
        <div className="full-w overflow-hidden mx-auto text-center mt-[-200px] sm:mt-[-130px] px-10">
          <ul className="grid sm:grid-cols-3 gap-4 grid-flow-row">
            {items.map((item) => (
              <li key={item._id} className="">
                <a href={`/product-page/${item.slug}`}>
                  <Image
                    src={item.media?.mainMedia?.image?.url || PLACEHOLDER_IMAGE}
                    width={566}
                    height={0}
                    alt={item.media?.mainMedia?.image?.altText || 'main image'}
                  />
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
        <div className="text-3xl w-full text-center p-9 box-border">
          No products found
        </div>
      )}
    </div>
  );
}
