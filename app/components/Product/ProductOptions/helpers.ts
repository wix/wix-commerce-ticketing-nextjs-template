import { products } from '@wix/stores';

export type SelectedOptions = Record<string, string | null>;
import { Dispatch, SetStateAction } from 'react';

export function selectDefaultOptionFromProduct(
  product: products.Product,
  updater: Dispatch<SetStateAction<SelectedOptions>>
) {
  // Selects the default option
  product.productOptions?.forEach((option) => {
    updater((choices) => ({
      ...choices,
      [option.name!]: option.choices![0].description!,
    }));
  });
}
