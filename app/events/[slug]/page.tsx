import '@wix/ricos/css/all-plugins-viewer.css';
import { WixMediaImage } from '@app/components/Image/WixMediaImage';
import { formatDate } from '@app/utils/date-formatter';
import { TicketsTable } from '@app/components/Table/Table.client';
import { getWixClient } from '@app/hooks/useWixClientServer';
import { wixEventsV2 as wixEvents } from '@wix/events';
import { Schedule } from '@app/components/Schedule/Schedule';
import { TicketDefinitionExtended } from '@app/types/ticket';
import testIds from '@app/utils/test-ids';
import { headers } from 'next/headers';
import EventRichText from '../EventRichText';

export default async function EventPage({ params }: any) {
  if (!params.slug) {
    return;
  }
  const headersList = headers();
  const host = headersList.get('host');
  const proto = headersList.get('x-forwarded-proto') || 'http';
  // You should probably just put your site domain and not use this generic implementation
  const pageUrl = `${proto}://${host}/events/${params.slug}`;

  const shareUrl = encodeURIComponent(pageUrl);
  const wixClient = await getWixClient();
  const { items: events } = await wixClient.wixEvents
    .queryEvents({
      fields: [
        wixEvents.RequestedFields.DETAILS,
        wixEvents.RequestedFields.TEXTS,
        wixEvents.RequestedFields.REGISTRATION,
        wixEvents.RequestedFields.AGENDA,
      ],
    })
    .limit(1)
    .eq('slug', decodeURIComponent(params.slug))
    .find();
  const event = events?.length ? events![0] : null;

  const [tickets, schedule, eventRichText] = event
    ? await Promise.all([
        (
          await wixClient.eventOrders.queryAvailableTickets({
            filter: { eventId: event._id },
            offset: 0,
            limit: 100,
            sort: 'orderIndex:asc',
          })
        ).definitions?.map((ticket) => ({
          ...ticket,
          canPurchase:
            ticket.limitPerCheckout! > 0 &&
            (!ticket.salePeriod ||
              (new Date(ticket.salePeriod.endDate!) > new Date() &&
                new Date(ticket.salePeriod.startDate!) < new Date())),
        })) as TicketDefinitionExtended[],
        wixClient.schedule.listScheduleItems({
          eventId: [event._id!],
          limit: 100,
        }),
        wixClient.wixEventsRichText
          .queryRichContent()
          .limit(1)
          .eq('eventId', event._id!)
          .find()
          .then((evRichTexts) => evRichTexts.items?.[0]),
      ])
    : [];

  return (
    <div className="mx-auto px-4 sm:px-14">
      {event ? (
        <div
          className="full-w overflow-hidden max-w-6xl mx-auto"
          data-testid={testIds.TICKET_DETAILS_PAGE.CONTAINER}
        >
          <div className="flex flex-col sm:flex-row gap-4 bg-zinc-900 text-white max-w-6xl sm:max-w-5xl items-lef sm:items-center mx-auto">
            <div className="basis-1/2">
              <WixMediaImage
                media={event.mainImage}
                width={530}
                height={530}
                className="max-h-[320px] sm:h-[530px] sm:max-h-[530px]"
              />
            </div>
            <div className="basis-1/2 text-left px-5 pb-4">
              <span>
                {formatDate(
                  new Date(event.dateAndTimeSettings?.startDate!),
                  event!.dateAndTimeSettings?.timeZoneId!
                ) || event.dateAndTimeSettings?.formatted?.startDate}{' '}
                | {event.location?.name}
              </span>
              <h1
                data-testid={testIds.TICKET_DETAILS_PAGE.HEADER}
                className="text-3xl sm:text-5xl my-2"
              >
                {event.title}
              </h1>
              <h3 className="my-4 sm:my-6">{event.shortDescription}</h3>
              {event.registration?.status ===
                wixEvents.RegistrationStatusStatus.OPEN_TICKETS && (
                <a
                  className="btn-main inline-block w-full sm:w-auto text-center"
                  href={`/events/${event.slug}#tickets`}
                >
                  Buy Tickets
                </a>
              )}
              {event.registration?.status ===
                wixEvents.RegistrationStatusStatus.OPEN_EXTERNAL && (
                <a
                  className="btn-main inline-block w-full sm:w-auto text-center"
                  href={event.registration.external!.url!}
                >
                  Buy Tickets
                </a>
              )}
              {[
                wixEvents.RegistrationStatusStatus.CLOSED_MANUALLY,
                wixEvents.RegistrationStatusStatus.CLOSED_AUTOMATICALLY,
              ].includes(event.registration?.status!) && (
                <div>
                  <p className="border-2 inline-block p-3">
                    Registration is closed
                    <br />
                    <a href="/" className="underline">
                      See other events
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="max-w-3xl mx-auto text-[14px] sm:text-base px-3 sm:px-0">
            <h2 className="mt-7">TIME & LOCATION</h2>
            <p className="font-helvetica">
              {event.dateAndTimeSettings?.formatted?.dateAndTime}
            </p>
            <p className="font-helvetica">
              {
                // @ts-ignore
                event.location?.address?.formatted!
              }
            </p>
            {eventRichText ? (
              <EventRichText
                richText={eventRichText}
                title={<h2 className="mt-7">ABOUT THE EVENT</h2>}
              />
            ) : null}
            {schedule?.items?.length ? (
              <div className="mb-4 sm:mb-14">
                <h2 className="mt-7">SCHEDULE</h2>
                <Schedule items={schedule.items} slug={event.slug!} />
              </div>
            ) : null}
            {event.registration?.external && (
              <a
                className="btn-main my-10 inline-block"
                href={event.registration?.external.url!}
              >
                Buy Tickets
              </a>
            )}
            {[
              wixEvents.RegistrationStatusStatus.CLOSED_MANUALLY,
              wixEvents.RegistrationStatusStatus.OPEN_TICKETS,
            ].includes(event.registration?.status!) && (
              <div className="my-4 sm:my-10">
                <h2 className="mt-7">TICKETS</h2>
                <TicketsTable tickets={tickets!} event={event} />
              </div>
            )}
            <div className="my-4">
              <h2 className="mt-7">Share this event</h2>
              <div className="my-4 flex gap-2">
                <a
                  className="border-2 inline-flex items-center mb-1 mr-1 transition p-1 rounded-full text-white border-neutral-600 bg-neutral-600 hover:bg-neutral-700 hover:border-neutral-700"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  aria-label="Share on Facebook"
                >
                  <svg
                    aria-hidden="true"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-4 h-4"
                  >
                    <path d="M379 22v75h-44c-36 0-42 17-42 41v54h84l-12 85h-72v217h-88V277h-72v-85h72v-62c0-72 45-112 109-112 31 0 58 3 65 4z"></path>
                  </svg>
                </a>
                <a
                  className="border-2 inline-flex items-center mb-1 mr-1 transition p-1 rounded-full text-white border-neutral-600 bg-neutral-600 hover:bg-neutral-700 hover:border-neutral-700"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://x.com/intent/post?url=${shareUrl}`}
                  aria-label="Share on X"
                >
                  <svg
                    aria-hidden="true"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="-100 0 1300 1300"
                    className="w-4 h-4"
                  >
                    <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"></path>
                  </svg>
                </a>
                <a
                  className="border-2 inline-flex items-center mb-1 mr-1 transition p-1 rounded-full text-white border-neutral-600 bg-neutral-600 hover:bg-neutral-700 hover:border-neutral-700"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&source=`}
                  aria-label="Share on Linkedin"
                >
                  <svg
                    aria-hidden="true"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-4 h-4"
                  >
                    <path d="M136 183v283H42V183h94zm6-88c1 27-20 49-53 49-32 0-52-22-52-49 0-28 21-49 53-49s52 21 52 49zm333 208v163h-94V314c0-38-13-64-47-64-26 0-42 18-49 35-2 6-3 14-3 23v158h-94V183h94v41c12-20 34-48 85-48 62 0 108 41 108 127z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-3xl w-full text-center p-9 box-border">
          The event was not found
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams(): Promise<{ slug?: string }[]> {
  const wixClient = await getWixClient();
  return wixClient.wixEvents
    .queryEvents({})
    .limit(10)
    .ascending('dateAndTimeSettings.startDate')
    .find()
    .then(({ items: events }) => {
      return events!.map((event) => ({
        slug: event.slug,
      }));
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}
