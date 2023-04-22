import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWixClient } from './useWixClient';
import { WixClient } from '../components/Provider/ClientProvider';

export const useRemoveItemFromCart = () => {
  const wixClient = useWixClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (itemId: string) => removeItemFromCart(wixClient, itemId),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data.cart);
    },
  });
  return mutation.mutate;
};

async function removeItemFromCart(wixClient: WixClient, itemId: string) {
  return wixClient.currentCart.removeLineItemsFromCurrentCart([itemId]);
}
