import { ticketDefinitions as api } from '@wix/events';

export type TicketDefinitionExtended = api.TicketDefinition & {
  pricing: TicketPricing;
  canPurchase: boolean;
};

export interface TicketPricing extends TicketPricingPriceOneOf {
  /**
   * Ticket pricing type.
   * @internal
   * @readonly
   */
  pricingType?: api.Type;
  /** Ticket price which is read only. */
  fixedPrice?: api.Money;
  /** Min price per ticket, customizable. */
  minPrice?: api.Money;
  /** Ticket pricing options. */
  pricingOptions?: PricingOptions;
}

/** @oneof */
export interface TicketPricingPriceOneOf {
  /** Ticket price which is read only. */
  fixedPrice?: api.Money;
  /** Min price per ticket, customizable. */
  minPrice?: api.Money;
  /** Ticket pricing options. */
  pricingOptions?: PricingOptions;
}

export interface PricingOptions {
  /** Multiple ticket pricing options. */
  options?: PricingOption[];
}

export interface PricingOption {
  /** Ticket pricing option ID. */
  _id?: string | null;
  /** Ticket pricing option name. */
  name?: string | null;
  /** Ticket pricing option price. */
  price?: api.Money;
}
