'use client';
import { useEffect, useRef } from 'react';
// @ts-ignore
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
interface SidebarProps {
  children: any;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, onClose }) => {
  const sidebarRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const contentRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const onKeyDownSidebar = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.focus();
    }

    const contentElement = contentRef.current;

    if (contentElement) {
      disableBodyScroll(contentElement, { reserveScrollBarGap: true });
    }

    return () => clearAllBodyScrollLocks();
  }, []);

  return (
    <div
      className="fixed inset-0 h-full z-50 box-borֱder outline-none"
      ref={sidebarRef}
      onKeyDown={onKeyDownSidebar}
      tabIndex={1}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-black bg-opacity-40 duration-100 ease-linear backdrop-blur-sm"
          onClick={onClose}
        />
        <section className="absolute inset-y-0 right-0 w-full md:w-auto max-w-full flex outline-none md:pl-10">
          <div className="h-full w-full md:w-screen md:max-w-sm bg-site">
            <div
              className="h-full flex flex-col text-base bg-accent-0 shadow-xl overflow-y-auto overflow-x-hidden"
              ref={contentRef}
            >
              {children}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
