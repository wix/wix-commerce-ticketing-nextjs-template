import testIds from '@app/utils/test-ids';

interface ProductTagProps {
  name: string;
  price: string;
  sku?: string;
}

export const ProductTag: React.FC<ProductTagProps> = ({ name, price, sku }) => {
  return (
    <>
      {sku && <span className="text-xs mb-4">SKU: {sku}</span>}
      <h2
        data-testid={testIds.PRODUCT_DETAILS.HEADER}
        className="max-w-full w-full leading-extra-loose text-3xl tracking-wide leading-8 py-1"
      >
        {name}
      </h2>
      <p className="text-md font-semibold inline-block tracking-wide py-1">
        {price}
      </p>
    </>
  );
};
