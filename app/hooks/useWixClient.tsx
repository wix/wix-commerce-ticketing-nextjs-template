'use client';
import { useContext } from 'react';
import { WixClientContext } from '../components/Provider/ClientProvider';

export const useWixClient = () => {
  return useContext(WixClientContext);
};
