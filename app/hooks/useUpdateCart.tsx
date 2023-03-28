import { useMutation, useQueryClient } from '@tanstack/react-query';
import { currentCart } from '@wix/ecom';
import { useWixClient } from './useWixClient';
import { WixClient } from '../components/Provider/ClientProvider';

export const useUpdateCart = () => {
  const wixClient = useWixClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (item: currentCart.LineItemQuantityUpdate) =>
      updateLineItemQuantity(wixClient, item),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
  return mutation.mutate;
};

async function updateLineItemQuantity(
  wixClient: WixClient,
  item: currentCart.LineItemQuantityUpdate
) {
  await wixClient.currentCart.updateCurrentCartLineItemQuantity([item]);
  await wixClient.currentCart.createCheckoutFromCurrentCart({
    channelType: currentCart.ChannelType.OTHER_PLATFORM,
  });
}
