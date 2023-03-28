import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWixClient } from './useWixClient';
import { WixClient } from '../components/Provider/ClientProvider';
import { currentCart } from '@wix/ecom';

export const useRemoveItemFromCart = () => {
  const wixClient = useWixClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (itemId: string) => removeItemFromCart(wixClient, itemId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
  return mutation.mutate;
};

async function removeItemFromCart(wixClient: WixClient, itemId: string) {
  await wixClient.currentCart.removeLineItemsFromCurrentCart([itemId]);
  await wixClient.currentCart.createCheckoutFromCurrentCart({
    channelType: currentCart.ChannelType.OTHER_PLATFORM,
  });
}
