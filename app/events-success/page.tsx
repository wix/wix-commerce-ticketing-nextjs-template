// opt out static rendering because of https://github.com/vercel/next.js/issues/43077
export const dynamic = 'force-dynamic';

export default function Success({ searchParams }: any) {
  if (!searchParams.reservationId) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      reservationId: {searchParams.reservationId}
    </div>
  );
}
