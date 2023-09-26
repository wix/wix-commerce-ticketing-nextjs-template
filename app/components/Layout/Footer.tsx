import './footer.css';
import ScrollIntoView from '@app/components/ScrollIntoView/ScrollIntoView';
import testIds from '@app/utils/test-ids';

const Footer = () => (
  <footer
    className="w-full m-h-56 bg-turquoise-100 leading-7"
    data-testid={testIds.LAYOUT.FOOTER}
  >
    <ScrollIntoView hashName="#contact" />
    <div className="bg-black text-white text-center py-6">
      <h2 className="text-2xl sm:text-4xl font-bold">
        FOR BOOKING REQUIREMENTS
      </h2>
      <p className="mt-10 text-xs sm:text-base">
        INFO@MYSITE.COM | PHONE: 123-456-7890
      </p>
    </div>
    <div className="mx-auto flex flex-col-reverse items-center sm:flex-row gap-1 sm:gap-16 pt-3 sm:pt-11 pb-4 sm:pb-20 px-6 sm:px-14 text-12 sm:text-xs">
      <p className="font-default mb-10 flex-1">
        © 2023 BY TALI$A KIDD. CREATED ON NextJS.
      </p>
      <a href="/terms">TERMS & CONDITIONS</a>
      <a href="/shipping">SHIPPING & RETURNS</a>
      <a href="/faq">FAQ&apos;S</a>
    </div>
  </footer>
);

export default Footer;
