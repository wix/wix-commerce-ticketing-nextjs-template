import { formatCurrency } from '@app/utils/price-formatter';
import { Flowbite, TextInput } from 'flowbite-react';
import React from 'react';
import { WIX_SERVICE_FEE } from '@app/constants';
import {
  ticketDefinitions as api,
  wixEventsV2 as wixEvents,
  ticketDefinitions,
} from '@wix/events';
import { TicketDefinitionExtended } from '@app/types/ticket';

export function Price({
  ticket,
  setTickets,
  event,
  selectedTickets,
  disabled,
  option,
}: {
  ticket: TicketDefinitionExtended;
  setTickets: Function;
  event: wixEvents.V3Event;
  disabled: boolean;
  option?: api.PricingOption;
  selectedTickets: Record<string, { quantity: number; price: number }>;
}) {
  const onPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number.parseFloat(e.target.value);
    if (
      val &&
      val >= Number.parseFloat(ticket.pricing?.minPrice?.value ?? '0')
    ) {
      setTickets({
        [ticket._id!]: {
          quantity: 1,
          price: Number.parseFloat(e.target.value),
        },
      });
    } else {
      setTickets({
        [ticket._id!]: {
          quantity: 0,
          price: 0,
        },
      });
    }
  };

  const defaultPrice: number = option
    ? Number.parseFloat(option.price!.value!)
    : selectedTickets[ticket._id!]?.price ||
      Number.parseFloat(ticket.price!.value!);

  const tax = Number(
    (defaultPrice *
      Number.parseFloat(
        event.registration?.tickets?.taxSettings?.rate || '0'
      )) /
      100 || 0
  );

  const defaultPriceWithTax =
    defaultPrice +
    ((event.registration?.tickets?.taxSettings?.type ===
    wixEvents.TaxType.ADDED_AT_CHECKOUT
      ? tax
      : 0) || 0);

  const fee = Number((defaultPriceWithTax * WIX_SERVICE_FEE) / 100 || 0);

  const getSelectedPricingOptionsRange = (
    pricingOptions: api.PricingOption[]
  ): { min: { value: number }; max: { value: number } } =>
    pricingOptions.reduce(
      (range, { price }) => {
        const amount = Number(price!.value);
        if (range.min === undefined || Number(range.min.value) > amount) {
          range.min = price!;
        }
        if (range.max === undefined || Number(range.max.value) < amount) {
          range.max = price!;
        }
        return range;
      },
      { min: undefined, max: undefined } as any
    );

  if (ticket.pricing?.pricingOptions?.options?.length && !option) {
    const range = getSelectedPricingOptionsRange(
      ticket.pricing?.pricingOptions.options
    );
    return (
      <>
        {`From ${formatCurrency(
          range.min!.value,
          ticket.pricing?.minPrice?.currency
        )} to ${formatCurrency(
          range.max.value,
          ticket.pricing?.minPrice?.currency
        )}`}
      </>
    );
  }

  const donationText = disabled
    ? 'Pay what you want'
    : `Pay ${
        Number.parseFloat(ticket.pricing?.minPrice?.value!) > 0
          ? `more than ${formatCurrency(
              ticket.pricing?.minPrice?.value!,
              ticket.price?.currency
            )}`
          : 'what you want'
      }`;

  let price;
  if (
    option ||
    ticket.pricing?.pricingType === ticketDefinitions.Type.STANDARD
  ) {
    price = <>{formatCurrency(defaultPrice, ticket.price!.currency)}</>;
  } else if (ticket.pricing?.pricingType === ticketDefinitions.Type.DONATION) {
    price = (
      <>
        {!disabled && (
          <Flowbite
            theme={{
              theme: {
                textInput: {
                  field: {
                    input: {
                      base: 'bg-transparent text-black rounded-none',
                    },
                  },
                },
              },
            }}
          >
            <TextInput
              type="number"
              id={`price-${ticket._id}`}
              className="bg-transparent mt-1"
              sizing="sm"
              addon="$"
              min={ticket.pricing?.minPrice?.value ?? 0}
              onChange={onPriceChange}
            />
          </Flowbite>
        )}
      </>
    );
  }

  return (
    <>
      {!option && (
        <span className="block text-12">
          {ticket.pricing?.pricingType === ticketDefinitions.Type.DONATION
            ? donationText
            : 'Price'}
        </span>
      )}
      <span className="text-base">{price}</span>
      {event.registration?.tickets?.taxSettings?.type ===
        wixEvents.TaxType.ADDED_AT_CHECKOUT &&
        !ticket.free &&
        (ticket.pricing?.pricingType === api.Type.STANDARD ||
          event.registration?.tickets?.taxSettings?.appliedToDonations) && (
          <>
            <br />
            <span className="text-xs text-black">
              {' '}
              +
              {tax
                ? formatCurrency(tax, ticket.price?.currency)
                : `${event.registration?.tickets?.taxSettings?.rate}%`}{' '}
              {event.registration?.tickets?.taxSettings?.name}
            </span>
          </>
        )}
      {ticket.wixFeeConfig?.type === api.FeeType.FEE_ADDED_AT_CHECKOUT &&
        !ticket.free && (
          <>
            <span className="text-12 block mt-1 sm:text-xs text-black">
              +{fee ? formatCurrency(fee, ticket.price?.currency) + ' ' : ''}
              Service fee
            </span>
          </>
        )}
    </>
  );
}
