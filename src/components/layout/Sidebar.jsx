import {
  HiOutlineX,
  HiOutlineHome,
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineCog,
} from "react-icons/hi";
import { NavLink, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: HiOutlineHome, path: "/" },
  { key: "boards", label: "Boards", icon: HiOutlineClipboardList, path: "/boards" },
  { key: "calendar", label: "Calendar", icon: HiOutlineCalendar, path: "/calendar" },
  { key: "settings", label: "Settings", icon: HiOutlineCog, path: "/settings" },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    onClose?.();
  };

  return (
    <aside
      id="app-sidebar"
      aria-label="Sidebar"
      className={[
        "fixed inset-y-0 left-0 z-[99] w-64 bg-white border-r shadow-sm",
        "transform transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0 md:static md:flex md:flex-col",
      ].join(" ")}
    >
      {/* Mobile top bar */}
      <div className="flex items-center justify-between p-3 border-b md:hidden">
        <span className="text-h6 font-semibold text-brand">Menu</span>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-xl p-2 border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand"
          aria-label="Close sidebar"
        >
          <HiOutlineX className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col w-full p-4">
        <h1 className="hidden md:block text-h2 text-brand font-bold mb-6">
          TaskFlow
        </h1>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.key}
                to={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.path);
                }}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 p-2 w-full rounded-lg transition",
                    isActive
                      ? "bg-gray-100 text-brand font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-brand",
                  ].join(" ")
                }
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="text-body font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t text-sm text-gray-500">
          TaskFlow © {new Date().getFullYear()}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
