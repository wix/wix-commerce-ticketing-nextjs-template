import { useMutation, useQueryClient } from '@tanstack/react-query';
import { currentCart } from '@wix/ecom';
import { useWixClient } from './useWixClient';
import { WixClient } from '../components/Provider/ClientProvider';

export const useAddItemToCart = () => {
  const wixClient = useWixClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (item: currentCart.LineItem) =>
      addItemFromCart(wixClient, item),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data.cart);
    },
  });
  return mutation.mutate;
};

async function addItemFromCart(
  wixClient: WixClient,
  item: currentCart.LineItem
) {
  return wixClient.currentCart.addToCurrentCart({ lineItems: [item] });
}
