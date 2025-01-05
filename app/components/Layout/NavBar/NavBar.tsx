'use client';
import { NavLink } from './NavLink';
import { useCallback, useState } from 'react';
import type { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navbarMainItems = [
  { ref: '/', label: 'HOME' },
  { ref: '/shop', label: 'MERCH' },
];

const navbarSecondrayItems = [
  { ref: '/terms', label: 'TERMS & CONDITIONS' },
  { ref: '/shipping', label: 'SHIPPING & RETURNS' },
  { ref: '/faq', label: 'FAQ' },
];

const StyledNavLink = ({
  isActive,
  className,
  ...linkProps
}: LinkProps & {
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <NavLink
    className={`${className ?? ''} ${
      isActive ? 'text-purple-300' : 'hover:text-gray-400'
    }`}
    {...linkProps}
  />
);

export function NavBar() {
  const [isMenuShown, setIsMenuShown] = useState(false);
  const pathname = usePathname();
  const [linkRef, setLinkRef] = useState<LinkProps['href']>(pathname!);
  const toggleOpen = useCallback(
    () => setIsMenuShown(!isMenuShown),
    [isMenuShown]
  );

  return (
    <>
      <button className="relative z-50 mt-2" onClick={toggleOpen}>
        <div className="space-y-2">
          {(isMenuShown
            ? [
                'rotate-45 translate-y-[13px] bg-white',
                'opacity-0 h-0',
                '-rotate-45 translate-y-[-13px] bg-white',
              ]
            : ['bg-gray-600', 'bg-gray-600', 'bg-gray-600']
          ).map((className, index) => (
            <span
              key={index}
              className={
                'block h-[4px] w-8 transform transition duration-500 ease-in-out ' +
                className
              }
            ></span>
          ))}
        </div>
      </button>
      <nav
        className={`${
          isMenuShown ? 'w-full opacity-100' : 'w-0 opacity-0'
        } transition-all duration-500 ease-in-out block overflow-hidden fixed animate-sideways-once h-screen bg-black text-white pt-8 z-40 top-0 right-0`}
      >
        <div className="relative flex flex-col-reverse sm:flex-col gap-2">
          <div className="h-[180px] w-[140px] overflow-hidden sm:h-auto sm:w-auto mx-auto">
            <Image
              className="mx-auto z-10"
              src="https://static.wixstatic.com/media/503ea4_cb7ebc8a601749f098164d92ec7aa441~mv2.jpg/v1/fill/w_480,h_622,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/503ea4_cb7ebc8a601749f098164d92ec7aa441~mv2.jpg"
              width={240}
              height={0}
              alt="Talisa Kidd"
            />
          </div>
          <h2 className="text-center text-2xl sm:text-[120px] z-20 sm:mt-[-150px]">
            TALI$A KIDD
          </h2>
        </div>
        <ul className="flex flex-col items-center gap-4 justify-end mt-4 sm:mt-[140px]">
          {navbarMainItems.map(({ ref, label }) => (
            <li key={ref} className="relative">
              <StyledNavLink
                className="text-lg"
                isActive={ref === linkRef}
                href={ref}
                onClick={() => {
                  setLinkRef(ref);
                  setIsMenuShown(false);
                }}
              >
                {label}
              </StyledNavLink>
            </li>
          ))}
          <div className="flex text-white gap-4 mt-4">
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
              viewBox="0 0 1226 1200"
              className="w-5 h-5"
            >
              <path
                fill="currentColor"
                d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
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
          {navbarSecondrayItems.map(({ ref, label }) => (
            <li key={ref} className="relative">
              <StyledNavLink
                className="text-xs"
                isActive={ref === linkRef}
                href={ref}
                onClick={() => {
                  setLinkRef(ref);
                  setIsMenuShown(false);
                }}
              >
                {label}
              </StyledNavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
