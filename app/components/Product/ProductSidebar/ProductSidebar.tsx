'use client';
import { FC, useCallback, useEffect, useState } from 'react';
import { products } from '@wix/stores';
import { ProductOptions } from '../ProductOptions/ProductOptions';
import { Accordion } from 'flowbite-react';
import { selectDefaultOptionFromProduct } from '../ProductOptions/helpers';
import { useUI } from '../../Provider/context';
import { useAddItemToCart } from '../../../hooks/useAddItemToCart';
import { HiArrowDown } from 'react-icons/hi';
import { Quantity } from '../../Quantity/Quantity';
import { ProductTag } from '../ProductTag/ProductTag';
import { usePrice } from '../../../hooks/use-price';

interface ProductSidebarProps {
  product: products.Product;
  className?: string;
}

export const ProductSidebar: FC<ProductSidebarProps> = ({ product }) => {
  const addItem = useAddItemToCart();
  const { openSidebar } = useUI();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<products.Variant>({});
  const [selectedOptions, setSelectedOptions] = useState<any>({});

  const price = usePrice({
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
  }, [selectedOptions]);

  useEffect(() => {
    selectDefaultOptionFromProduct(product, setSelectedOptions);
  }, [product]);

  const isButtonEnabled = useCallback(() => {
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
          appId: '1380b703-ce81-ff05-f115-39571d94dfcd',
          ...(Object.keys(selectedOptions).length && {
            options: selectedVariant._id
              ? { variantId: selectedVariant._id }
              : { options: selectedOptions },
          }),
        },
      });
      setLoading(false);
      openSidebar();
    } catch (err) {
      setLoading(false);
    }
  };

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
      <div>
        <button
          aria-label="Add to Cart"
          className="btn-main w-full my-1 rounded-2xl"
          type="button"
          onClick={addToCart}
          disabled={loading || !isButtonEnabled()}
        >
          {isButtonEnabled() ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
      <p
        className="pb-4 break-words w-full max-w-xl mt-6"
        dangerouslySetInnerHTML={{ __html: product.description ?? '' }}
      />
      <div className="mt-6">
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
      </div>
    </>
  );
};
