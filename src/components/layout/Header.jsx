import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const Header = ({ isSidebarOpen, onToggleSidebar }) => {
  // Local fallback (uncontrolled) in case parent doesn’t pass props — handy for storybook/tests.
    const handleToggle = () => {
        onToggleSidebar(!isSidebarOpen);
    };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="h-14 px-4 flex items-center justify-between">
        {/* Mobile hamburger / close */}
        <button
          type="button"
          onClick={handleToggle}
          className="md:hidden inline-flex items-center justify-center rounded-xl p-2 border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand"
          aria-controls="app-sidebar"
          aria-expanded={isSidebarOpen ? "true" : "false"}
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          {isSidebarOpen ? (
            <HiOutlineX className="h-6 w-6" />
          ) : (
            <HiOutlineMenu className="h-6 w-6" />
          )}
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 rounded-xl border border-brand/30 bg-brand/10"
            aria-hidden="true"
          />
          <span className="text-h5 font-semibold text-brand">TaskFlow</span>
        </div>

        {/* Right side placeholder */}
        <div className="w-6 h-6" aria-hidden="true" />
      </div>
    </header>
  );
};

export default Header;
