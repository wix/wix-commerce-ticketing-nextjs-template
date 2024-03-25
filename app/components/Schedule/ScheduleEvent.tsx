import { wixEventsV2 as wixEvents, schedule } from '@wix/events';
import { formatDate } from '@app/utils/date-formatter';
import { Schedule } from './Schedule';

export function ScheduleEvent({
  event,
  items,
  slug,
}: {
  event: wixEvents.V3Event;
  slug: string;
  items: schedule.ScheduleItem[] | undefined;
}) {
  return (
    <div className="max-w-4xl mx-auto px-8 sm:px-14 pt-4 sm:pt-16">
      <div className="flex flex-col-reverse sm:flex-col">
        <p className="font-helvetica text-xs sm:text-base">
          {`${event.title} | ${
            event.dateAndTimeSettings?.formatted?.dateAndTime
          }, ${
            // @ts-ignore
            event.location!.address.formatted!
          }`}
        </p>
        <h1 className="text-2xl sm:text-5xl mb-4 sm:mb-12 sm:mt-4">Schedule</h1>
      </div>
      <div className="flex flex-col-reverse sm:flex-col">
        <a
          className="text-purple-500 border py-2 mt-4 sm:mt-0 px-4 sm:mb-8 border-purple-500 inline-block w-full sm:w-fit text-center"
          href={`/events/${slug}`}
        >
          Get Tickets
        </a>
        <div>
          <h2 className="mt-4 border-b border-black pb-4">
            {formatDate(
              new Date(event!.dateAndTimeSettings?.startDate!),
              event!.dateAndTimeSettings!.timeZoneId!
            )}
          </h2>
          <Schedule items={items!} slug={slug} isFull={true} />
        </div>
      </div>
    </div>
  );
}
