'use client';
import React, { useCallback, useState } from 'react';
import { formatPrice } from '@app/utils/price-formatter';
import { CartItem } from '@app/components/CartItem/CartItem';
import { useCart } from '@app/hooks/useCart';
import { useUI } from '@app/components/Provider/context';
import { useWixClient } from '@app/hooks/useWixClient';
import { Spinner } from 'flowbite-react';
import { currentCart } from '@wix/ecom';

export const CartView = ({ layout = 'mini' }: { layout?: 'full' | 'mini' }) => {
  const wixClient = useWixClient();
  const { closeSidebar, openModalNotPremium } = useUI();
  const { data, isLoading } = useCart();
  const [redirecting, setRedirecting] = useState<boolean>(false);
  const subTotal = formatPrice(
    data && {
      amount:
        data.lineItems?.reduce((acc, item) => {
          return (
            acc +
            Number.parseFloat(item.price?.amount ?? '0') * (item.quantity ?? 0)
          );
        }, 0) ?? 0,
      currencyCode: data.currency,
    }
  );

  const goToCheckout = useCallback(async () => {
    closeSidebar();
    setRedirecting(true);
    try {
      const checkout =
        await wixClient.currentCart.createCheckoutFromCurrentCart({
          channelType: currentCart.ChannelType.WEB,
        });
      const { redirectSession } =
        await wixClient.redirects.createRedirectSession({
          ecomCheckout: { checkoutId: checkout.checkoutId },
          callbacks: {
            postFlowUrl: window.location.origin,
            thankYouPageUrl: `${window.location.origin}/stores-success`,
            cartPageUrl: `${window.location.origin}/cart`,
          },
        });
      if (redirectSession?.fullUrl) {
        window.location.href = redirectSession.fullUrl;
      }
    } catch (e: any) {
      if (
        e.details.applicationError.code ===
        'SITE_MUST_ACCEPT_PAYMENTS_TO_CREATE_CHECKOUT'
      ) {
        openModalNotPremium();
      }
      setRedirecting(false);
    }
  }, [
    closeSidebar,
    openModalNotPremium,
    wixClient.currentCart,
    wixClient.redirects,
  ]);

  const isMini = layout === 'mini';
  return (
    <>
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner aria-label="Loading Cart" />
        </div>
      ) : null}
      {!isLoading && data?.lineItems?.length! > 0 ? (
        <div className={`${!isMini ? 'max-w-6xl mx-auto' : ''}`}>
          <div className="flex-1">
            <div className="relative">
              {isMini ? (
                <button
                  onClick={closeSidebar}
                  aria-label="Close"
                  className="hover:text-accent-5 absolute transition ease-in-out duration-150 focus:outline-none mr-6 top-[32px]"
                >
                  <svg
                    className="w-6 h-6 text-site ml-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    ></path>
                  </svg>
                </button>
              ) : null}
              <span
                className={`font-bold text-2xl text-center block p-6 ${
                  isMini ? 'bg-black text-white' : ''
                }`}
              >
                Cart
              </span>
            </div>
            <ul className="sm:px-6 p-4 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-accent-2 border-accent-2">
              {data?.lineItems?.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  currencyCode={data?.currency!}
                />
              ))}
            </ul>
          </div>

          <div className="flex-shrink-0 px-6 py-6 sm:px-6 sticky z-20 bottom-0 w-full right-0 left-0 border-t text-md bg-site">
            <ul className="pb-2">
              <li className="flex justify-between py-1">
                <span>Subtotal</span>
                <span>{subTotal}</span>
              </li>
            </ul>
            <div>
              <button
                className="btn-main w-full text-lg"
                onClick={goToCheckout}
                disabled={redirecting}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 px-4 flex flex-col justify-center items-center">
          <span className="border border-dashed border-primary rounded-full flex items-center justify-center w-16 h-16 p-12 text-secondary">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
          </span>
          <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
            Your cart is empty
          </h2>
          <p className="text-accent-3 px-10 text-center pt-2">
            Add products to your cart in <a href="/shop">here</a>
          </p>
        </div>
      )}
    </>
  );
};
