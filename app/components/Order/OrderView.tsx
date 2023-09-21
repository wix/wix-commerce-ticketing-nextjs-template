import { orders } from '@wix/ecom';
import { CartItem } from '@app/components/CartItem/CartItem';

export function OrderView({ order }: { order: orders.Order | undefined }) {
  if (!order) {
    return null;
  }
  return (
    <div className="mx-auto px-14">
      <h2 className="text-center">
        Thank you for purchasing {order.billingInfo!.contactDetails!.firstName}{' '}
        {order.billingInfo!.contactDetails!.lastName}
      </h2>
      <div className="flex-1 px-24 py-10 flex flex-col justify-center items-center">
        You just bought:
        <ul className="py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-accent-2 border-b">
          {order.lineItems!.map((item) => (
            <CartItem
              hideButtons={true}
              key={item._id}
              item={item}
              currencyCode={order.currency!}
            />
          ))}
        </ul>
        <br />
        {order.shippingInfo?.logistics?.shippingDestination ? (
          <p>
            We will ship to{' '}
            {
              order.shippingInfo!.logistics!.shippingDestination!.address!
                .addressLine1
            }
            ,{' '}
            {order.shippingInfo!.logistics!.shippingDestination!.address!.city},{' '}
            {
              order.shippingInfo!.logistics!.shippingDestination!.address!
                .subdivision
            }
            ,{' '}
            {
              order.shippingInfo!.logistics!.shippingDestination!.address!
                .postalCode
            }
            ,{' '}
            {
              order.shippingInfo!.logistics!.shippingDestination!.address!
                .country
            }
          </p>
        ) : null}
        {order.shippingInfo?.logistics?.pickupDetails ? (
          <p>
            Pickup at:{' '}
            {
              order.shippingInfo?.logistics?.pickupDetails!.address!
                .addressLine1
            }
            , {order.shippingInfo?.logistics?.pickupDetails!.address!.city},{' '}
            {order.shippingInfo?.logistics?.pickupDetails!.address!.subdivision}
            , {order.shippingInfo?.logistics?.pickupDetails!.address!.country}
          </p>
        ) : null}
      </div>
    </div>
  );
}
