'use client';
import React from 'react';
import { Sidebar } from './Sidebar';
import { useUI } from '@app/components/Provider/context';
import { CartView } from '@app/components/Cart/CartView';

export const SidebarUI: React.FC = () => {
  const { displaySidebar, closeSidebar } = useUI();
  return displaySidebar ? (
    <Sidebar onClose={closeSidebar}>
      <CartView />
    </Sidebar>
  ) : null;
};
