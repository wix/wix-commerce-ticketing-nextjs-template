'use client';

import React from 'react';
import { Button, Label, Modal, Spinner, TextInput } from 'flowbite-react';
import { useUI } from '@app/components/Provider/context';
import { useWixClient } from '@app/hooks/useWixClient';
import { products } from '@wix/stores';
import { STORES_APP_ID } from '@app/constants';

export const BackInStockFormModal = ({
  product,
  variantId = '00000000-0000-0000-0000-000000000000',
}: {
  product: products.Product;
  variantId?: string;
}) => {
  const { closeModalBackInStock, displayBackInStockModal } = useUI();
  const [loading, setLoading] = React.useState(false);
  const wixClient = useWixClient();
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');

  const closeModal = () => {
    closeModalBackInStock();
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await wixClient.backInStockNotifications.createBackInStockNotificationRequest(
        {
          email,
          itemUrl: window.location.href,
          catalogReference: {
            appId: STORES_APP_ID,
            catalogItemId: product._id,
            options: { variantId },
          },
        },
        {
          price: product.price?.price?.toFixed(),
          name: product.name!,
          image: product.media?.mainMedia?.image?.url,
        }
      );
      closeModalBackInStock();
    } catch (e: any) {
      console.error(e);
      if (e.details.applicationError.code === 500) {
        setError('Back In Stock App is not installed');
      } else {
        setError(e.message);
      }
    }

    setLoading(false);
  };

  return (
    <React.Fragment>
      <Modal
        show={displayBackInStockModal}
        onClose={closeModal}
        root={globalThis.document?.body}
      >
        <Modal.Body>
          <form onSubmit={(e) => submit(e)}>
            <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
              <div className="flex">
                <h3 className="text-xl font-bold text-gray-900 text-center flex-1">
                  Notify when available
                </h3>
                <button
                  onClick={closeModal}
                  aria-label="Close"
                  className="focus:outline-none"
                >
                  <svg
                    className="w-6 h-6 ml-6"
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
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <h4>
                Enter your email address and you’ll be notified when this
                product is back in stock.
              </h4>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email" value="Email" />
                </div>
                <TextInput
                  id="email"
                  type="email"
                  color={'primary'}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required={true}
                />
              </div>
              <div className="w-full">
                <Button type="submit" disabled={loading}>
                  {loading ? <Spinner aria-label="Loading" /> : 'Submit'}
                </Button>
              </div>
              <p>{error}</p>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};
