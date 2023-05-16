'use client';

import React from 'react';
import { Button, Modal } from 'flowbite-react';
import { useUI } from '@app/components/Provider/context';

export const NotPremium = () => {
  const { closeModalNotPremium, displayNotPremiumModal } = useUI();

  return (
    <React.Fragment>
      <Modal
        show={displayNotPremiumModal}
        onClose={closeModalNotPremium}
        root={globalThis.document?.body}
      >
        <Modal.Body>
          <div className="text-center">
            <h2 className="mb-6">We can not accept online orders right now</h2>
            <p className="text-base leading-relaxed text-gray-500 text-center">
              Please contact us to complete your purchase.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-center">
          <Button onClick={closeModalNotPremium} className="bg-black">
            Got It
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};
