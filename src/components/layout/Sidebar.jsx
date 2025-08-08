import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "🏠" },
  { key: "boards", label: "Boards", icon: "📋" },
  { key: "calendar", label: "Calendar", icon: "📅" },
  { key: "settings", label: "Settings", icon: "⚙️" },
];

const Sidebar = ({ isOpen, onClose }) => {
  const [activeKey, setActiveKey] = useState("dashboard");

  return (
    <aside
      id="app-sidebar"
      aria-label="Sidebar"
      className={[
        // Base
        "fixed inset-y-0 left-0 z-[99] w-64 bg-white border-r shadow-sm",
        // Mobile slide in/out
        "transform transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop: pinned and visible
        "md:translate-x-0 md:static md:flex md:flex-col",
      ].join(" ")}
    >
      {/* Mobile-only header with close button */}
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

      {/* Content */}
      <div className="flex flex-col w-full p-4">
        {/* Desktop brand (hidden on mobile since Header shows brand already) */}
        <h1 className="hidden md:block text-h2 text-brand font-bold mb-6">
          TaskFlow
        </h1>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveKey(item.key)}
              className={[
                "flex items-center gap-3 p-2 w-full text-left rounded-lg transition",
                activeKey === item.key
                  ? "bg-gray-100 text-brand font-semibold"
                  : "text-gray-700 hover:bg-gray-100 hover:text-brand",
              ].join(" ")}
              aria-current={activeKey === item.key ? "page" : undefined}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span className="text-body font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t text-sm text-gray-500">
          TaskFlow © {new Date().getFullYear()}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;