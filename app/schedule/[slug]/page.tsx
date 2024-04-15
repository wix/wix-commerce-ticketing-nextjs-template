import { getWixClient } from '@app/hooks/useWixClientServer';
import { ScheduleEvent } from '@app/components/Schedule/ScheduleEvent';
import { wixEventsV2 as wixEvents } from '@wix/events';

export default async function SchedulePage({ params }: any) {
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
    .eq('slug', params.slug)
    .limit(1)
    .find();
  const event = events?.length ? events![0] : null;
  const { items } = await wixClient.schedule.listScheduleItems({
    eventId: [event!._id!],
    limit: 100,
  });

  return <ScheduleEvent event={event || {}} slug={params.slug} items={items} />;
}
