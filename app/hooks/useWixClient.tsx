'use client';
import { useContext } from 'react';
import { WixClientContext } from '@app/components/Provider/ClientProvider';

export const useWixClient = () => {
  return useContext(WixClientContext);
};
