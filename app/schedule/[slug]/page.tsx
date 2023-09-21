import { getWixClient } from '@app/hooks/useWixClientServer';
import { ScheduleEvent } from '@app/components/Schedule/ScheduleEvent';

export default async function SchedulePage({ params }: any) {
  const wixClient = await getWixClient();
  const { events } = await wixClient.wixEvents.queryEventsV2({
    query: { filter: { slug: params.slug }, paging: { limit: 1, offset: 0 } },
  });
  const event = events?.length ? events![0] : null;
  const { items } = await wixClient.schedule.listScheduleItems({
    eventId: [event!._id!],
    limit: 100,
  });

  return <ScheduleEvent event={event || {}} slug={params.slug} items={items} />;
}
