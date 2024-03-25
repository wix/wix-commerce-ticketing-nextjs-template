'use client';
import { WixMediaImage } from '@app/components/Image/WixMediaImage';
import { getDatePart } from '@app/utils/date-formatter';
import { wixEventsV2 as wixEvents } from '@wix/events';
import { useState } from 'react';
import testIds from '@app/utils/test-ids';

export const Events = ({ events }: { events: wixEvents.V3Event[] }) => {
  const [expendEventDescription, setExpendEventDescription] = useState(
    {} as Record<string, boolean>
  );

  return (
    <div
      className="px-8 sm:px-0 max-w-4xl mx-auto"
      data-testid={testIds.TICKET_LIST.CONTAINER}
    >
      <h1 className="uppercase text-4xl sm:text-7xl text-center sm:text-left">
        SHOWS
      </h1>
      <div className="py-10">
        {events!.map((event) => (
          <div
            data-testid={testIds.TICKET_ITEM.CONTAINER}
            className="group/event flex border-b last:border-0 hover:border-purple-500 gap-4 sm:gap-8 flex-col sm:flex-row py-4 sm:py-0 transition-colors duration-300"
            key={event._id}
          >
            <div className="flex flex-1 sm:items-center gap-4 sm:gap-4 md:gap-8 flex-col sm:flex-row sm:py-3">
              <div
                className={`sm:group-hover/event:overflow-hidden transition-all duration-300 ease-out ${
                  expendEventDescription[event._id!]
                    ? 'w-0 overflow-hidden'
                    : 'w-full max-w-fit sm:group-hover/event:w-0'
                }`}
              >
                <div className="flex flex-col min-w-fit sm:flex-row overflow-hidden sm:gap-4 md:gap-8 relative">
                  <div className="w-[310px] h-[171px] sm:w-[80px] sm:h-[80px] overflow-hidden sm:group-hover/event:opacity-0 transition-opacity duration-300">
                    <WixMediaImage
                      media={event.mainImage}
                      width={300}
                      height={300}
                    />
                  </div>
                  <div className="flex gap-4 items-center absolute bottom-2 left-2 sm:bottom-auto sm:left-auto sm:relative">
                    <span className="text-4xl">
                      {getDatePart(
                        new Date(event.dateAndTimeSettings?.startDate!),
                        'day',
                        event!.dateAndTimeSettings?.timeZoneId!
                      )}
                    </span>
                    <div className="flex flex-col text-xs">
                      <span className="text-white sm:text-gray-600">
                        {getDatePart(
                          new Date(event.dateAndTimeSettings?.startDate!),
                          'weekday',
                          event!.dateAndTimeSettings?.timeZoneId!
                        )}
                      </span>
                      <span>
                        {getDatePart(
                          new Date(event.dateAndTimeSettings?.startDate!),
                          'month',
                          event!.dateAndTimeSettings?.timeZoneId!
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grow flex flex-col hover:text-purple-500">
                <button
                  className="text-left w-full h-full group/button text-2xl text-left"
                  onClick={(e) => {
                    setExpendEventDescription({
                      [event._id!]: !expendEventDescription[event._id!],
                    });
                  }}
                >
                  {event.title}
                  <svg
                    fill="none"
                    className={`w-4 h-4 inline ml-3 opacity-0 group-hover/button:opacity-100 ${
                      expendEventDescription[event._id!]
                        ? 'transform rotate-180 opacity-100'
                        : ''
                    }`}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    ></path>
                  </svg>
                </button>
                <div
                  className={`text-sm text-site transition-all ease-in pointer-events-none ${
                    expendEventDescription[event._id!]
                      ? 'opacity-100 h-auto py-3'
                      : 'opacity-0 h-0'
                  }`}
                >
                  <p>{event!.dateAndTimeSettings?.formatted?.dateAndTime}</p>
                  <p>
                    {event!.title},{' '}
                    {
                      // @ts-ignore
                      event!.location!.address?.formatted!
                    }
                  </p>
                  <p className="mt-3">{event.shortDescription}</p>
                </div>
              </div>
            </div>
            <a
              data-testid={testIds.TICKET_ITEM.SELECT_CTA}
              className="btn-main my-2 sm:my-10 rounded-2xl w-full text-center sm:w-auto h-fit min-w-fit"
              href={`/events/${event.slug}`}
            >
              Buy Tickets
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
