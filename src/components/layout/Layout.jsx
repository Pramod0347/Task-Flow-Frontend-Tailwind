import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Optional mobile backdrop */}
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar backdrop"
        />
      )}

      {/* Main area */}
      <div className="flex flex-col flex-1">
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={setIsSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
