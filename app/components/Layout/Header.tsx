import { CartBag } from '../CartBag/CartBag';
import { NavBar } from './NavBar/NavBar';

const Header = () => (
  <>
    <header className="h-header z-40 w-full">
      <div className="flex px-6 sm:px-14 h-header items-center gap-4 sm:gap-8">
        <h2 className="flex-1">
          <a href="/">TALI$A KIDD</a>
        </h2>
        <div>
          <CartBag />
        </div>
        <div>
          <NavBar />
        </div>
      </div>
    </header>
  </>
);

export default Header;
