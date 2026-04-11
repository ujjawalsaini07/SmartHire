import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Navbar from '@components/layout/Navbar';
import Sidebar from '@components/layout/Sidebar';

const DashboardLayout = ({ sidebarLinks = [] }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-transparent">
      {/* Top Navbar - Using existing Navbar component */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`fixed bottom-0 left-0 top-20 z-30 hidden transition-all duration-300 lg:block ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}>
          <Sidebar 
            links={sidebarLinks} 
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
        </aside>

        {/* Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 top-20 z-40 bg-black/45 backdrop-blur-[2px] lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            {/* Mobile Sidebar */}
            <aside className="fixed bottom-0 left-0 top-20 z-50 w-64 lg:hidden">
              <Sidebar
                links={sidebarLinks}
                isMobile
                onClose={() => setIsMobileSidebarOpen(false)}
              />
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className={`flex-1 min-h-[calc(100vh-5rem)] transition-all duration-300 ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}>
          {/* Mobile Menu Button - Fixed at top of content area */}
          <div className="sticky top-20 z-20 border-b border-light-border/80 bg-white/80 p-4 backdrop-blur-xl dark:border-dark-border/80 dark:bg-dark-bg-secondary/85 lg:hidden">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="rounded-lg border border-light-border bg-white p-2.5 text-light-text-secondary transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-dark-border dark:bg-dark-bg-tertiary dark:text-dark-text-secondary dark:hover:border-primary-500 dark:hover:text-primary-300"
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Page Content - Rendered via Outlet */}
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
