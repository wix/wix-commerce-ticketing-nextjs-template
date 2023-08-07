'use client';
import { Carousel, Flowbite, useTheme } from 'flowbite-react';
import { products } from '@wix/stores';
import { PLACEHOLDER_IMAGE } from '@app/constants';
import { WixMediaImage } from '@app/components/Image/WixMediaImage';
export function ImageGalleryClient({ items }: { items: products.MediaItem[] }) {
  const { theme } = useTheme();
  const images = items.length ? items : [{ image: { url: PLACEHOLDER_IMAGE } }];
  return (
    <div className="h-56 sm:h-96 max-h-96 max-w-xl mx-auto">
      <Flowbite
        theme={{
          theme: {
            carousel: {
              scrollContainer: {
                ...theme.carousel.scrollContainer,
                base: theme.carousel.scrollContainer.base + ' rounded-none',
              },
            },
          },
        }}
      >
        <Carousel slide={false}>
          {images.map((media, index) => (
            <WixMediaImage
              key={index}
              media={media.image?.url || ''}
              alt={media.image?.altText ?? ''}
              width={600}
              height={400}
            />
          ))}
        </Carousel>
      </Flowbite>
    </div>
  );
}
