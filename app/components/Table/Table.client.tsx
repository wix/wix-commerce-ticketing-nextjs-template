'use client';
import { Counter } from '../Counter/Counter';
import { useEffect, useState } from 'react';
import { formatCurrency } from '../../utils/price-formtter';
import { Price } from '../Price/Price';
import { WIX_SERVICE_FEE } from '../../constants';
import {
  checkout as checkoutApi,
  wixEvents,
  ticketDefinitions as api,
} from '@wix/events';
import { useWixClient } from '../../hooks/useWixClient';
import { Badge } from 'flowbite-react';
import { formatDateWithTime } from '../../utils/date-formatter';
import { TicketDefinitionExtended } from '../../types/ticket';

export function TicketsTable({
  tickets,
  event,
}: {
  tickets: TicketDefinitionExtended[];
  event: wixEvents.Event;
}) {
  const wixClient = useWixClient();
  const [selectedTickets, setSelectedTickets] = useState<
    Record<string, { quantity: number; price: number }>
  >({});
  const [serviceFee, setServiceFee] = useState(0);
  const [tax, setTax] = useState(0);
  const [subTotals, setSubTotals] = useState(0);
  const [expendPricingOptions, setExpendPricingOptions] = useState(
    {} as Record<string, boolean>
  );
  const [expendTicketDescription, setExpendTicketDescription] = useState(
    {} as Record<string, boolean>
  );
  const [redirecting, setRedirecting] = useState<boolean>(false);

  const setExpendPricingOptionsForTicket = (ticketId: string) => {
    setExpendPricingOptions({
      ...expendPricingOptions,
      [ticketId]: !expendPricingOptions[ticketId],
    });
  };

  const setExpendTicketDescriptionForTicket = (ticketId: string) => {
    setExpendTicketDescription({
      ...expendTicketDescription,
      [ticketId]: !expendTicketDescription[ticketId],
    });
  };

  const setTickets = (
    ticket: Record<string, { quantity: number; price: number }>
  ) => {
    const [ticketId, { quantity }] = Object.entries(ticket)[0];
    if (quantity === 0) {
      delete selectedTickets[ticketId];
      setSelectedTickets({ ...selectedTickets });
      return;
    }
    setSelectedTickets({ ...selectedTickets, ...ticket });
  };

  const findTicketAndMaybeOption = (key: string) => {
    const [ticketId, optionId] = key.split('|');
    const ticket = tickets.find((t) => t._id === ticketId);
    if (!optionId) {
      return { ticket };
    }
    const option = ticket!.pricing!.pricingOptions!.options!.find(
      (o) => o._id === optionId
    );
    return { ticket, option };
  };

  useEffect(() => {
    setServiceFee(
      Object.keys(selectedTickets).reduce((acc, key) => {
        const { ticket, option } = findTicketAndMaybeOption(key);
        const tax =
          (Number.parseFloat(option?.price?.value || ticket?.price?.value!) *
            Number.parseFloat(
              event.registration?.ticketing?.config?.taxConfig?.rate || '0'
            )) /
          100;
        const price = selectedTickets[key].price + tax;
        const priceWithTax =
          ticket!.wixFeeConfig!.type === api.FeeType.FEE_ADDED_AT_CHECKOUT
            ? Number(price * WIX_SERVICE_FEE) / 100
            : 0;
        return acc + selectedTickets[key].quantity * priceWithTax;
      }, 0)
    );

    setSubTotals(
      Object.keys(selectedTickets).reduce(
        (acc, key) =>
          acc + selectedTickets[key].quantity * selectedTickets[key].price,
        0
      )
    );

    if (
      event.registration?.ticketing?.config?.taxConfig?.type ===
      wixEvents.TaxType.ADDED_AT_CHECKOUT
    ) {
      setTax(
        Object.keys(selectedTickets).reduce(
          (acc, key) =>
            acc +
            (selectedTickets[key].quantity *
              selectedTickets[key].price *
              Number.parseFloat(
                event.registration?.ticketing?.config?.taxConfig?.rate!
              )) /
              100,
          0
        )
      );
    }
  }, [selectedTickets]);

  const createReservation = async () => {
    const ticketsGrouped = Object.keys(selectedTickets).reduce(
      (acc: Record<string, any>, key: string) => {
        const [ticketId, optionId] = key.split('|');
        if (!optionId) {
          acc[ticketId] = selectedTickets[ticketId];
        } else {
          acc[ticketId] = {
            ...acc[ticketId],
            quantity:
              (acc[ticketId]?.quantity ?? 0) + selectedTickets[key].quantity,
            ticketDetails: [
              ...(acc[ticketId]?.ticketDetails ?? []),
              {
                pricingOptionId: optionId,
                capacity: selectedTickets[key].quantity,
              },
            ],
          };
        }
        return acc;
      },
      {}
    );

    const ticketQuantities: checkoutApi.TicketReservationQuantity[] =
      Object.keys(ticketsGrouped).map((key) => {
        const [ticketId] = key.split('|');
        const ticket = tickets.find((t) => t._id === ticketId);
        return {
          ticketDefinitionId: ticketId,
          quantity: ticketsGrouped[ticketId].quantity,
          ...(ticketsGrouped[ticketId].ticketDetails && {
            ticketDetails: ticketsGrouped[ticketId].ticketDetails,
          }),
          ...(ticketsGrouped[ticketId].price &&
            ticket!.pricing.pricingType === api.Type.DONATION && {
              ticketDetails: [
                {
                  priceOverride: ticketsGrouped[ticketId].price.toString(),
                },
              ],
            }),
        };
      });
    const { _id: id } = await wixClient.checkout.createReservation(event._id!, {
      ticketQuantities,
    });

    try {
      setRedirecting(true);
      const { redirectSession } =
        await wixClient.redirects.createRedirectSession({
          eventsCheckout: { reservationId: id, eventSlug: event.slug! },
          callbacks: {
            postFlowUrl: window.location.origin,
            thankYouPageUrl: `${window.location.origin}/events-success`,
          },
        });
      if (id) {
        window.location.href = redirectSession!.fullUrl!;
      }
    } catch (e) {
      console.error(e);
      setRedirecting(false);
    }
  };

  return (
    <>
      <div className="flex full-w flex-col" id="tickets">
        {tickets.map((ticket: TicketDefinitionExtended) => (
          <div
            className="flex flex-col sm:flex-row mt-6 border p-4 sm:p-6"
            key={ticket._id}
          >
            <div className="basis-1/2 sm:border-r-2">
              <span className="block text-12">Ticket type</span>
              <span className="text-base">{ticket.name}</span>
              {ticket.salePeriod &&
                new Date(ticket.salePeriod.endDate!) > new Date() &&
                new Date(ticket.salePeriod.startDate!) < new Date() && (
                  <div className="mt-2 text-xs">
                    <p>Sale ends</p>
                    <p>
                      {formatDateWithTime(
                        new Date(ticket.salePeriod.endDate!),
                        event.scheduling?.config?.timeZoneId!
                      )}
                    </p>
                  </div>
                )}
              {expendTicketDescription[ticket._id!] && (
                <p className="text-xs">{ticket.description}</p>
              )}
              {ticket.description && (
                <div className="whitespace-nowrap my-1">
                  <div className="flex justify-between">
                    <button
                      className="text-xs text-purple-400 underline"
                      onClick={() =>
                        setExpendTicketDescriptionForTicket(ticket._id!)
                      }
                    >
                      {expendTicketDescription[ticket._id!] ? 'Less' : 'More'}{' '}
                      info
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div
              className={`basis-1/2 sm:pl-4 ${
                ticket.pricing?.pricingOptions?.options?.length
                  ? ''
                  : 'flex flex-col sm:flex-row'
              }`}
            >
              <div className="basis-1/2 mt-4 sm:mt-0">
                <Price
                  selectedTickets={selectedTickets}
                  ticket={ticket}
                  setTickets={setTickets}
                  event={event}
                  disabled={
                    event.registration?.status !==
                    wixEvents.RegistrationStatus.OPEN_TICKETS
                  }
                />
                {ticket.salePeriod &&
                  new Date(ticket.salePeriod.startDate!) > new Date() && (
                    <div className="mt-2 text-12">
                      <p>Goes on sale</p>
                      <span>
                        {formatDateWithTime(
                          new Date(ticket.salePeriod.startDate!),
                          event.scheduling?.config?.timeZoneId!
                        )}
                      </span>
                    </div>
                  )}
              </div>
              {!ticket.pricing?.pricingOptions?.options?.length && (
                <div
                  className={`sm:ml-auto mt-4 sm:mt-0 ${
                    !ticket.canPurchase ? 'w-fit' : ''
                  }`}
                >
                  {ticket.canPurchase && (
                    <>
                      <span className="block text-12 mb-1">Quantity</span>

                      <Counter
                        onChange={setTickets}
                        ticketId={ticket._id!}
                        limit={ticket.limitPerCheckout!}
                        initialCount={
                          selectedTickets[ticket._id!]?.quantity ?? 0
                        }
                        price={
                          selectedTickets[ticket._id!]?.price ||
                          Number.parseFloat(ticket.price?.value!)
                        }
                      />
                    </>
                  )}
                  {ticket.limitPerCheckout! === 0 && (
                    <Badge color="gray">Sold Out</Badge>
                  )}
                  {ticket.salePeriod &&
                    new Date(ticket.salePeriod.endDate!) < new Date() && (
                      <Badge color="gray">Sale ended</Badge>
                    )}
                </div>
              )}
              {ticket.pricing?.pricingOptions?.options
                ?.slice(
                  0,
                  expendPricingOptions[ticket._id!]
                    ? ticket.pricing?.pricingOptions?.options?.length
                    : 3
                )
                .map((option) => (
                  <div
                    className="flex flex-col sm:flex-row mt-4 border-t-2 pt-4"
                    key={option._id}
                  >
                    <div className="basis-1/2">
                      <span className="whitespace-nowrap block text-12">
                        {option.name}
                      </span>
                      <span className="block">
                        <Price
                          selectedTickets={selectedTickets}
                          ticket={ticket}
                          setTickets={setTickets}
                          event={event}
                          option={option}
                          disabled={
                            event.registration?.status !==
                            wixEvents.RegistrationStatus.OPEN_TICKETS
                          }
                        />
                      </span>
                    </div>
                    <div
                      className={`ml-auto mt-2 sm:mt-0 ${
                        ticket.limitPerCheckout! > 0
                          ? 'w-full sm:w-fit'
                          : 'w-fit'
                      }`}
                    >
                      {ticket.limitPerCheckout! > 0 ? (
                        <>
                          <span className="block text-12 mb-1">Quantity</span>
                          <Counter
                            onChange={setTickets}
                            ticketId={ticket._id!}
                            optionId={option._id!}
                            limit={ticket.limitPerCheckout!}
                            initialCount={
                              selectedTickets[`${ticket._id!}|${option._id}`]
                                ?.quantity ?? 0
                            }
                            price={
                              selectedTickets[`${ticket._id!}|${option._id}`]
                                ?.price ||
                              Number.parseFloat(option.price?.value!)
                            }
                          />
                        </>
                      ) : (
                        <Badge color="gray">Sold Out</Badge>
                      )}
                    </div>
                  </div>
                ))}
              {ticket.pricing?.pricingOptions?.options!.length! > 3 && (
                <div className="whitespace-nowrap mt-6">
                  <div className="flex justify-between">
                    <button
                      className="text-sm text-purple-400 underline"
                      onClick={() =>
                        setExpendPricingOptionsForTicket(ticket._id!)
                      }
                    >
                      View {expendPricingOptions[ticket._id!] ? 'less' : 'more'}{' '}
                      price options
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="sm:w-[35%] ml-auto mt-4 sm:mt-10">
        {Object.keys(selectedTickets).length && subTotals ? (
          <div className="flex" key="subtotal">
            <span>Subtotal</span>
            <span className="text-right ml-auto">
              {formatCurrency(subTotals, tickets[0]!.price!.currency)}
            </span>
          </div>
        ) : null}
        {tax ? (
          <div className="flex mt-2" key="tax">
            <div>{event.registration?.ticketing?.config?.taxConfig?.name}</div>
            <div className="text-right ml-auto">
              {formatCurrency(tax, tickets[0]!.price!.currency)}
            </div>
          </div>
        ) : null}
        {serviceFee ? (
          <div className="flex mt-2" key="fee">
            <span>Service fee</span>
            <span className="text-right ml-auto">
              {formatCurrency(
                serviceFee.toString(),
                tickets[0]!.price!.currency
              )}
            </span>
          </div>
        ) : null}
        <div className="border-t flex mt-2 pt-2 text-lg" key="total">
          <span>Total</span>
          <span className="text-right ml-auto">
            {formatCurrency(
              tax +
                serviceFee +
                Object.keys(selectedTickets).reduce(
                  (acc, key) =>
                    acc +
                    selectedTickets[key].quantity * selectedTickets[key].price,
                  0
                ),
              event.registration?.ticketing?.currency!
            )}
          </span>
        </div>
        <div className="mt-6" key="checkout">
          <div className="whitespace-nowrap font-medium">
            <button
              onClick={createReservation}
              disabled={
                Object.keys(selectedTickets).length === 0 || redirecting
              }
              className="btn-main w-full disabled:text-gray-500 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:hover:bg-gray-200 disabled:hover:text-gray-500 hover:border-white"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
