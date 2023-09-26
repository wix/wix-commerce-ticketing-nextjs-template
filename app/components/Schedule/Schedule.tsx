import { schedule } from '@wix/events';
import { formatDuration, formatHours } from '@app/utils/date-formatter';

export const Schedule = ({
  items,
  slug,
  isFull = false,
}: {
  items: schedule.ScheduleItem[];
  slug: string;
  isFull?: boolean;
}) => {
  const itemsWithDuration = items.map((item) => {
    const { start, end } = item.timeSlot!;
    const dateStart = new Date(start!);
    const dateEnd = new Date(end!);
    let msDifference = Number(dateEnd) - Number(dateStart);
    let minutes = Math.floor(msDifference / 1000 / 60);
    let hours = Math.floor(minutes / 60);
    return { ...item, duration: { diffHrs: hours, diffMins: minutes } };
  });
  return (
    <div className="text-sm">
      {itemsWithDuration.slice(0, isFull ? 100 : 2).map((item) => (
        <div
          className="flex gap-3 sm:gap-8 items-left sm:items-center border-b py-5 sm:py-8 border-black flex-col sm:flex-row"
          key={item._id}
        >
          <div className="basis-1/4">
            <span className="block">{`${formatHours(
              new Date(item.timeSlot?.start!),
              item.timeSlot!.timeZoneId!
            )} - ${formatHours(
              new Date(item.timeSlot?.end!),
              item.timeSlot!.timeZoneId!
            )}`}</span>
            <span className="text-gray-400 text-sm">
              {formatDuration({
                diffHrs: item.duration.diffHrs,
                diffMins: item.duration.diffMins,
              })}
            </span>
          </div>
          <div>
            <span className="block mb-2">{item.name}</span>
            <div className="text-xs flex gap-1 items-center">
              <svg
                className="h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                ></path>
              </svg>
              {item.stageName}
            </div>
          </div>
        </div>
      ))}
      {items.length > 2 && !isFull && (
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 items-center py-4">
          <span className="text-xs">
            {items.length - 2} more items available
          </span>
          <a
            href={`/schedule/${slug}`}
            className="text-purple-500 border py-2 px-4 border-purple-500 w-full sm:w-auto text-center"
          >
            See All
          </a>
        </div>
      )}
    </div>
  );
};
