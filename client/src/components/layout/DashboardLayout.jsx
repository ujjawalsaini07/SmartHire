import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import Navbar from '@components/layout/Navbar';
import Sidebar from '@components/layout/Sidebar';

const DashboardLayout = ({ sidebarLinks = [] }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      {/* Top Navbar */}
      <Navbar />

      {/* Layout shell */}
      <div className="flex">

        {/* ── Desktop Sidebar ── */}
        <aside
          className={`hidden lg:block fixed bottom-0 left-0 top-[68px] z-30 transition-all duration-300 ${
            isCollapsed ? 'w-[72px]' : 'w-[256px]'
          }`}
          aria-label="Sidebar"
        >
          <Sidebar
            links={sidebarLinks}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
        </aside>

        {/* ── Mobile Sidebar Drawer ── */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 top-[68px] z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                onClick={() => setIsMobileSidebarOpen(false)}
                aria-hidden="true"
              />
              {/* Drawer */}
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 top-[68px] z-50 w-[256px] lg:hidden"
                aria-label="Mobile sidebar"
              >
                <Sidebar
                  links={sidebarLinks}
                  isMobile
                  onClose={() => setIsMobileSidebarOpen(false)}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── Main Content ── */}
        <main
          className={`flex-1 min-h-[calc(100vh-68px)] transition-all duration-300 ${
            isCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[256px]'
          }`}
        >
          {/* Mobile top bar with hamburger */}
          <div
            className="sticky top-[68px] z-20 flex items-center gap-3 px-4 py-3 lg:hidden border-b"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              borderColor: 'var(--color-border)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-lg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-teal)] hover:text-[var(--color-teal)] transition-all"
              aria-label="Toggle navigation"
              aria-expanded={isMobileSidebarOpen}
            >
              <Menu className="w-4 h-4" aria-hidden="true" />
            </button>
            <span className="text-sm font-medium text-[var(--color-text-muted)]">Menu</span>
          </div>

          {/* Page content */}
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
