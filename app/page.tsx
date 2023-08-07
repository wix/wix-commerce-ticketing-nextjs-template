import Image from 'next/image';
import { getWixClient } from './hooks/useWixClientServer';
import { wixEvents } from '@wix/events';
import { products } from '@wix/stores';
import { Events } from './components/Events/Events';
import testIds from '@app/utils/test-ids';
import { WixMediaImage } from '@app/components/Image/WixMediaImage';

export default async function Home() {
  const wixClient = await getWixClient();
  let productsForCategories: { category: string; product: products.Product }[] =
    [];
  try {
    const { items: collectionsItems } = await wixClient.collections
      .queryCollections()
      .ne('_id', '00000000-000000-000000-000000000001')
      .limit(3)
      .find();
    productsForCategories = await Promise.all(
      collectionsItems.map((collection) =>
        wixClient.products
          .queryProducts()
          .eq('collectionIds', collection._id)
          .limit(1)
          .find()
          .then((products) => ({
            product: products.items[0],
            category: collection.name!,
          }))
      )
    );
  } catch (e) {}

  let events: wixEvents.Event[] = [];
  try {
    events = (
      await wixClient.wixEvents.queryEventsV2({
        fieldset: [
          wixEvents.EventFieldset.FULL,
          wixEvents.EventFieldset.DETAILS,
        ],
        query: {
          paging: { limit: 10, offset: 0 },
          sort: [{ fieldName: 'start', order: wixEvents.SortOrder.ASC }],
        },
      })
    ).events!;
  } catch (e) {}
  return (
    <div className="mx-auto relative">
      <div className="relative">
        <div className="flex sm:flex-row flex-col bg-zinc-900">
          <div className="basis-1/2 text-center sm:text-left relative">
            <div
              className="px-10 sm:px-14 py-6 bg-site"
              data-testid={testIds.HOME_PAGE.HEADER}
            >
              <h1 className="text-5xl sm:text-[120px] leading-none animate-fade-in">
                USA
                <br /> SUMMER
                <br /> TOUR
              </h1>
              <h3 className="text-base sm:text-2xl py-6">
                A NEW ALBUM BY{' '}
                <span className="text-purple-500">TALI$A KIDD</span>
              </h3>
              <div className="flex text-gray-700 gap-4 justify-center sm:justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  className="w-5 h-5"
                >
                  <path
                    fill="currentColor"
                    d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-5 h-5"
                >
                  <path
                    fill="currentColor"
                    d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-5 h-5"
                >
                  <path
                    fill="currentColor"
                    d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  className="w-5 h-5"
                >
                  <path
                    fill="currentColor"
                    d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-5 h-5"
                >
                  <path
                    fill="currentColor"
                    d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"
                  />
                </svg>
              </div>
            </div>
            <div className="bg-zinc-900 h-[75px] w-full"></div>
          </div>
          <div className="basis-1/2">
            <Image
              src="https://static.wixstatic.com/media/503ea4_ed9a38760ae04aab86b47e82525fdcac~mv2.jpg/v1/fill/w_918,h_585,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/503ea4_ed9a38760ae04aab86b47e82525fdcac~mv2.jpg"
              alt="TALI$A"
              className="w-full px-10 sm:px-0"
              width={1000}
              height={800}
            />
          </div>
        </div>
        <Image
          className="absolute inset-x-2/4 -translate-x-2/4 -translate-y-[20%] bottom-0 top-[20%] hidden sm:block"
          src="https://static.wixstatic.com/media/c22c23_14f3a617cd684341b51dd1a3962c856e~mv2.png/v1/fill/w_202,h_245,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/c22c23_14f3a617cd684341b51dd1a3962c856e~mv2.png"
          alt="TALI$A"
          width={202}
          height={245}
        />
      </div>
      {events?.length ? (
        <div className="bg-zinc-900 text-site pt-16 sm:p-20">
          <Events events={events} />
        </div>
      ) : (
        <div className="text-3xl w-full text-center p-9 box-border max-w-4xl mx-auto">
          No events found. Click{' '}
          <a
            href="https://manage.wix.com/account/site-selector?actionUrl=https%3A%2F%2Fmanage.wix.com%2Fdashboard%2F%7BmetaSiteId%7D%2Fevents%3FreferralInfo%3DHeadless"
            target="_blank"
            rel="noreferrer"
            className="text-purple-500"
          >
            here
          </a>{' '}
          to go to the business dashboard to add events. Once added, they will
          appear here.
        </div>
      )}
      {productsForCategories.length ? (
        <div className="flex gap-2 sm:gap-14 px-14 flex-col sm:flex-row">
          <div className="text-custom-1 text-center sm:text-left pt-10 sm:py-20 basis-1/2">
            <h1 className="uppercase text-4xl sm:text-7xl text-center sm:text-left text-black">
              Merch
            </h1>
            <p className="text-lg my-10 text-black">
              I am a paragraph. I’m a great space to write about what makes the
              products special and explain how customers can benefit from these
              items.
            </p>
            <a
              href="/shop"
              className="btn-main rounded-2xl text-base px-8 py-2.5"
            >
              Get Merch
            </a>
            {productsForCategories[1]?.product?.media?.mainMedia ? (
              <div className="mt-10 sm:mt-[300px]">
                <a href="/shop" className="h-auto max-w-full inline-block">
                  <WixMediaImage
                    media={
                      productsForCategories[1]?.product!.media!.mainMedia!
                        .image!.url!
                    }
                    width={800}
                    height={800}
                    alt={
                      productsForCategories[1]?.product!.media!.mainMedia!
                        .image!.altText!
                    }
                  />
                </a>
                <span className="font-bold text-2xl sm:text-5xl block text-center mt-[-15px] sm:mt-[-30px] text-black relative z-10">
                  <a href="/shop">{productsForCategories[1]?.category}</a>
                </span>
              </div>
            ) : null}
          </div>
          <div className="basis-1/2">
            {productsForCategories[0]?.product?.media?.mainMedia ? (
              <div className="mt-10 sm:mt-[220px]">
                <a href="/shop" className="h-auto max-w-full inline-block">
                  <WixMediaImage
                    media={
                      productsForCategories[0]?.product!.media!.mainMedia!
                        .image!.url!
                    }
                    width={800}
                    height={800}
                    alt={
                      productsForCategories[0]?.product!.media!.mainMedia!
                        .image!.altText!
                    }
                  />
                </a>
                <span className="font-bold text-2xl sm:text-5xl block text-center mt-[-15px] sm:mt-[-30px] relative z-10">
                  <a href="/shop">{productsForCategories[0]?.category}</a>
                </span>
              </div>
            ) : null}
            {productsForCategories[2]?.product?.media?.mainMedia ? (
              <div className="mt-10 sm:mt-40">
                <a href="/shop" className="h-auto max-w-full inline-block">
                  <WixMediaImage
                    media={
                      productsForCategories[2]?.product?.media!.mainMedia!
                        .image!.url!
                    }
                    width={800}
                    height={800}
                    alt={
                      productsForCategories[2]?.product!.media!.mainMedia!
                        .image!.altText!
                    }
                  />
                </a>
                <span className="font-bold text-2xl sm:text-5xl block text-center mt-[-15px] sm:mt-[-30px] relative z-10">
                  <a href="/shop">{productsForCategories[2]?.category}</a>
                </span>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="text-3xl w-full text-center p-9 box-border max-w-4xl mx-auto">
          No categories found. Click{' '}
          <a
            href="https://manage.wix.com/account/site-selector?actionUrl=+https%3A%2F%2Fmanage.wix.com%2Fdashboard%2F%7BmetaSiteId%7D%2Fstore%2Fcategories%2Flist%3FreferralInfo%3DHeadless"
            target="_blank"
            rel="noreferrer"
            className="text-purple-500"
          >
            here
          </a>{' '}
          to go to the business dashboard to create event categories. Once
          added, they will appear here.
        </div>
      )}
    </div>
  );
}
