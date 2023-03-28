'use client';
import { WixMediaImage } from '../Image/WixMediaImage';
import { getDatePart } from '../../utils/date-formatter';
import { wixEvents } from '@wix/events';
import { useState } from 'react';

export const Events = ({ events }: { events: wixEvents.Event[] }) => {
  const [expendEventDescription, setExpendEventDescription] = useState(
    {} as Record<string, boolean>
  );

  return (
    <div className="px-8 sm:px-14">
      <h1 className="uppercase text-4xl sm:text-7xl text-center sm:text-left">
        SHOWS
      </h1>
      <div className="py-10 sm:px-44">
        {events!.map((event) => (
          <div
            className="group/event flex border-b last:border-0 hover:border-purple-500 gap-4 sm:gap-8 flex-col sm:flex-row py-4 sm:py-0 transition-colors duration-300"
            key={event._id}
          >
            <div className="flex flex-1 sm:items-center gap-4 sm:gap-8 flex-col sm:flex-row sm:py-3">
              <div
                className={`flex flex-col sm:flex-row overflow-hidden gap-8 relative sm:group-hover/event:max-w-0 max-w-4xl transition-[max-width] duration-300 ease-out ${
                  expendEventDescription[event._id!] ? 'sm:m-w-0' : ''
                }`}
              >
                <div className="w-[310px] h-[171px] sm:w-[80px] sm:h-[80px] overflow-hidden">
                  <WixMediaImage
                    media={event.mainImage}
                    width={300}
                    height={300}
                  />
                </div>
                <div className="flex gap-4 items-center absolute bottom-2 left-2 sm:bottom-auto sm:left-auto sm:relative">
                  <span className="text-4xl">
                    {getDatePart(
                      new Date(event.scheduling?.config?.startDate!),
                      'day',
                      event!.scheduling!.config!.timeZoneId!
                    )}
                  </span>
                  <div className="flex flex-col text-xs">
                    <span className="text-white sm:text-gray-600">
                      {getDatePart(
                        new Date(event.scheduling?.config?.startDate!),
                        'weekday',
                        event!.scheduling!.config!.timeZoneId!
                      )}
                    </span>
                    <span>
                      {getDatePart(
                        new Date(event.scheduling?.config?.startDate!),
                        'month',
                        event!.scheduling!.config!.timeZoneId!
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grow flex flex-col group/button hover:text-purple-500">
                <button
                  className={`text-2xl text-left ${
                    expendEventDescription[event._id!] ? 'text-purple-500' : ''
                  }`}
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
                  className={`text-sm text-site transition-all ease-in ${
                    expendEventDescription[event._id!]
                      ? 'opacity-100 h-auto py-3'
                      : 'opacity-0 h-0'
                  }`}
                >
                  <p>{event!.scheduling?.formatted}</p>
                  <p>
                    {event!.title}, {event!.location!.address}
                  </p>
                  <p className="mt-3">{event.description}</p>
                </div>
              </div>
            </div>
            <a
              className="btn-main my-2 sm:my-10 rounded-2xl w-full text-center sm:w-auto h-fit"
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
