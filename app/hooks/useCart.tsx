import { useQuery } from '@tanstack/react-query';
import { useWixClient } from './useWixClient';

export const useCart = () => {
  const wixClient = useWixClient();
  return useQuery(['cart'], () => wixClient.currentCart.getCurrentCart(), {
    retry: false,
  });
};
