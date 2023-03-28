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
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
  return mutation.mutate;
};

async function addItemFromCart(
  wixClient: WixClient,
  item: currentCart.LineItem
) {
  await wixClient.currentCart.addToCurrentCart({ lineItems: [item] });
  await wixClient.currentCart.createCheckoutFromCurrentCart({
    channelType: currentCart.ChannelType.OTHER_PLATFORM,
  });
}
