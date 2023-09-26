import { useMutation, useQueryClient } from '@tanstack/react-query';
import { currentCart } from '@wix/ecom';
import { WixClient } from '@app/components/Provider/ClientProvider';
import { useWixClient } from './useWixClient';

export const useUpdateCart = () => {
  const wixClient = useWixClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (item: currentCart.LineItemQuantityUpdate) =>
      updateLineItemQuantity(wixClient, item),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data.cart);
    },
  });
  return mutation.mutate;
};

async function updateLineItemQuantity(
  wixClient: WixClient,
  item: currentCart.LineItemQuantityUpdate
) {
  return wixClient.currentCart.updateCurrentCartLineItemQuantity([item]);
}
