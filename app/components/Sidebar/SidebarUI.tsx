'use client';
import React from 'react';
import { Sidebar } from './Sidebar';
import { CartSidebarView } from '../CartSidebar/CartSidebarView';
import { useUI } from '../Provider/context';

export const SidebarUI: React.FC = () => {
  const { displaySidebar, closeSidebar } = useUI();
  return displaySidebar ? (
    <Sidebar onClose={closeSidebar}>
      <CartSidebarView />
    </Sidebar>
  ) : null;
};
