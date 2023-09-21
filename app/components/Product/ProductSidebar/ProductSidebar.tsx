'use client';
import { Accordion, Flowbite } from 'flowbite-react';
import { FC, useEffect, useMemo, useState } from 'react';
import { HiArrowDown } from 'react-icons/hi';
import { products } from '@wix/stores';
import { ProductOptions } from '@app/components/Product/ProductOptions/ProductOptions';
import { selectDefaultOptionFromProduct } from '@app/components/Product/ProductOptions/helpers';
import { ProductTag } from '@app/components/Product/ProductTag/ProductTag';
import { formatPrice } from '@app/utils/price-formatter';
import { useUI } from '@app/components/Provider/context';
import { useAddItemToCart } from '@app/hooks/useAddItemToCart';
import { Quantity } from '@app/components/Quantity/Quantity';
import testIds from '@app/utils/test-ids';
import { BackInStockFormModal } from '@app/components/BackInStockFormModal/BackInStockFormModal';
import { STORES_APP_ID } from '@app/constants';

interface ProductSidebarProps {
  product: products.Product;
  className?: string;
}

const createProductOptions = (
  selectedOptions?: any,
  selectedVariant?: products.Variant
) =>
  Object.keys(selectedOptions ?? {}).length
    ? {
        options: selectedVariant?._id
          ? { variantId: selectedVariant!._id }
          : { options: selectedOptions },
      }
    : undefined;

export const ProductSidebar: FC<ProductSidebarProps> = ({ product }) => {
  const addItem = useAddItemToCart();
  const { openSidebar, openModalBackInStock } = useUI();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<products.Variant>({});
  const [selectedOptions, setSelectedOptions] = useState<any>({});

  const price = formatPrice({
    amount: selectedVariant?.variant?.priceData?.price || product.price!.price!,
    currencyCode: product.price!.currency!,
  });

  useEffect(() => {
    if (
      product.manageVariants &&
      Object.keys(selectedOptions).length === product.productOptions?.length
    ) {
      const variant = product.variants?.find((variant) =>
        Object.keys(variant.choices!).every(
          (choice) => selectedOptions[choice] === variant.choices![choice]
        )
      );
      setSelectedVariant(variant!);
    }
    setQuantity(1);
  }, [
    selectedOptions,
    product.manageVariants,
    product.productOptions?.length,
    product.variants,
  ]);

  useEffect(() => {
    selectDefaultOptionFromProduct(product, setSelectedOptions);
  }, [product]);

  const isAvailableForPurchase = useMemo(() => {
    if (!product.manageVariants && product.stock?.inStock) {
      return true;
    }
    if (!product.manageVariants && !product.stock?.inStock) {
      return false;
    }

    return selectedVariant?.stock?.inStock;
  }, [selectedVariant, product]);

  const addToCart = async () => {
    setLoading(true);
    try {
      await addItem({
        quantity,
        catalogReference: {
          catalogItemId: product._id!,
          appId: STORES_APP_ID,
          ...createProductOptions(selectedOptions, selectedVariant),
        },
      });
      setLoading(false);
      openSidebar();
    } catch (err) {
      setLoading(false);
    }
  };

  const notifyWhenAvailable = async () => {
    openModalBackInStock();
  };

  const buyNowLink = useMemo(() => {
    const productOptions = createProductOptions(
      selectedOptions,
      selectedVariant
    );
    return `/api/quick-buy/${product._id}?quantity=${quantity}&productOptions=${
      productOptions
        ? decodeURIComponent(JSON.stringify(productOptions.options))
        : ''
    }`;
  }, [selectedOptions, selectedVariant, product._id, quantity]);

  return (
    <>
      <ProductTag
        name={product.name!}
        price={price}
        sku={product.sku ?? undefined}
      />
      <div className="mt-2">
        <ProductOptions
          options={product.productOptions!}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
      </div>
      <div className="mb-6">
        <span className="text-xs tracking-wide">Quantity</span>
        <div className="mt-2">
          <Quantity
            value={quantity}
            max={
              (selectedVariant?.stock?.trackQuantity
                ? selectedVariant?.stock?.quantity
                : product.stock?.quantity!) ?? 9999
            }
            handleChange={(e) => setQuantity(Number(e.target.value))}
            increase={() => setQuantity(1 + quantity)}
            decrease={() => setQuantity(quantity - 1)}
          />
        </div>
      </div>
      {isAvailableForPurchase ? (
        <div>
          <button
            data-testid={testIds.PRODUCT_DETAILS.ADD_TO_CART_CTA}
            aria-label="Add to Cart"
            className="btn-main w-full my-1 rounded-2xl"
            type="button"
            onClick={addToCart}
            disabled={loading}
          >
            Add to Cart
          </button>
          <div className="w-full pt-2">
            <a
              data-testid={testIds.PRODUCT_DETAILS.BUY_NOW_CTA}
              className="btn-main w-full my-1 rounded-2xl block text-center"
              href={buyNowLink}
            >
              Buy Now
            </a>
          </div>
        </div>
      ) : null}
      {!isAvailableForPurchase ? (
        <div>
          <BackInStockFormModal
            product={product}
            variantId={selectedVariant._id}
          />
          <button
            data-testid={testIds.PRODUCT_DETAILS.ADD_TO_CART_CTA}
            aria-label="Notify When Available"
            className="btn-main w-full my-1 rounded-2xl"
            type="button"
            onClick={notifyWhenAvailable}
            disabled={loading}
          >
            Notify When Available
          </button>
        </div>
      ) : null}
      <p
        className="pb-4 break-words w-full max-w-xl mt-6"
        dangerouslySetInnerHTML={{ __html: product.description ?? '' }}
      />
      <div className="mt-6">
        <Flowbite
          theme={{
            theme: {
              accordion: {
                content: { base: 'bg-transparent p-5' },
                title: {
                  heading: 'text-black',
                  arrow: {
                    base: 'text-black',
                  },
                },
              },
            },
          }}
        >
          <Accordion flush={true} arrowIcon={HiArrowDown}>
            {product.additionalInfoSections!.map((info) => (
              <Accordion.Panel key={info.title}>
                <Accordion.Title>
                  <span className="text-sm">{info.title}</span>
                </Accordion.Title>
                <Accordion.Content>
                  <span
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: info.description ?? '' }}
                  />
                </Accordion.Content>
              </Accordion.Panel>
            ))}
          </Accordion>
        </Flowbite>
      </div>
    </>
  );
};
