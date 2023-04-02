import LogoIcon from "./icons/LogoIcon";
import HomeIcon from "./icons/HomeIcon";

const SideNav = () => {
  return (
    <nav className="sidenav">
      <ul className="sidenav__list">
        <li>
          <button>
            <LogoIcon />
          </button>
        </li>
        <li>
          <button>
            <HomeIcon />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
