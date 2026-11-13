import React, { useState } from 'react';
import {
  LayoutDashboard,
  ScanLine,
  FileWarning,
  BarChart3,
  Award,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  Home,
  Plus,
  Info,
  User,
} from 'lucide-react';
import { AppPage } from '../types/eco';
import { EcoLogoMark } from './EcoLogo';

interface SidebarShellProps {
  activePage: Exclude<AppPage, 'landing'>;
  onNavigate: (page: AppPage) => void;
  greenScore: number;
  pendingCount: number;
  children: React.ReactNode;
}

const NAV_ITEMS: Array<{
  id: Exclude<AppPage, 'landing'>;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'wastevision', label: 'WasteVision AI', icon: ScanLine },
  { id: 'ecoreport', label: 'EcoReport', icon: FileWarning },
  { id: 'green-dashboard', label: 'Green Dashboard', icon: BarChart3 },
  { id: 'greenscore', label: 'GreenScore', icon: Award },
  { id: 'ecoadvisor', label: 'EcoAdvisor', icon: MessageSquareText },
  { id: 'about', label: 'About', icon: Info },
];

const PAGE_TITLES: Record<Exclude<AppPage, 'landing'>, string> = {
  overview: 'Student Overview',
  wastevision: 'WasteVision AI',
  ecoreport: 'EcoReport',
  'green-dashboard': 'Green Dashboard',
  greenscore: 'GreenScore',
  ecoadvisor: 'EcoAdvisor',
  about: 'About & Creators',
};

export function SidebarShell({
  activePage,
  onNavigate,
  greenScore,
  pendingCount,
  children,
}: SidebarShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelectPage = (page: AppPage) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const sidebarContent = (isMobile: boolean) => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/90">
      {/* Brand Header */}
      <div
        className={`h-16 px-4 flex items-center border-b border-slate-200/80 ${
          collapsed && !isMobile ? 'justify-center' : 'justify-between'
        }`}
      >
        <button
          type="button"
          onClick={() => handleSelectPage('landing')}
          className="flex items-center gap-2.5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] rounded-lg"
          title="Return to Landing Page"
        >
          <EcoLogoMark className="w-8 h-8 shrink-0" />
          {(!collapsed || isMobile) && (
            <span className="font-display font-bold text-base tracking-tight text-[#064E3B] whitespace-nowrap">
              EcoCampus AI
            </span>
          )}
        </button>

        {!isMobile && (
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 text-slate-400 hover:text-[#064E3B] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}

        {isMobile && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Primary Workspace Navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectPage(item.id)}
              title={collapsed && !isMobile ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] ${
                isActive
                  ? 'bg-[#ECFDF5] text-[#064E3B] font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#1F2937]'
              } ${collapsed && !isMobile ? 'justify-center px-2' : 'justify-between'}`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-[18px] h-[18px] shrink-0 ${
                    isActive ? 'text-[#059669]' : 'text-slate-500'
                  }`}
                />
                {(!collapsed || isMobile) && (
                  <span className="truncate whitespace-nowrap">{item.label}</span>
                )}
              </span>

              {(!collapsed || isMobile) && item.id === 'green-dashboard' && pendingCount > 0 && (
                <span className="font-mono text-[11px] font-semibold text-amber-700 tabular-nums shrink-0">
                  {pendingCount}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-3 mt-3 border-t border-slate-200/80">
          <button
            type="button"
            onClick={() => handleSelectPage('landing')}
            title={collapsed && !isMobile ? 'Landing Page' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-[#1F2937] transition-colors cursor-pointer ${
              collapsed && !isMobile ? 'justify-center px-2' : ''
            }`}
          >
            <Home className="w-[18px] h-[18px] shrink-0" />
            {(!collapsed || isMobile) && (
              <span className="whitespace-nowrap">Landing Page</span>
            )}
          </button>
        </div>
      </nav>

      {/* Bottom Profile Summary */}
      <div className="p-3 border-t border-slate-200/80">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50/90 ${
            collapsed && !isMobile ? 'justify-center' : ''
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-[#ECFDF5] border border-emerald-200 text-[#064E3B] flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#1F2937] truncate">BSSRV Member</p>
              <p className="text-xs text-slate-500 truncate tabular-nums">
                GreenScore: <span className="font-semibold text-[#059669]">{greenScore.toLocaleString()}</span> pts
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1F2937] flex">
      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 sticky top-0 h-screen transition-[width] duration-200 ease-out ${
          collapsed ? 'w-[76px]' : 'w-[256px]'
        }`}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-[272px] max-w-[85vw] h-full z-10 shadow-xl">
            {sidebarContent(true)}
          </div>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Workspace Header */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-[#064E3B] hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="text-slate-400 hidden sm:inline whitespace-nowrap">EcoCampus AI</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <h1 className="font-display font-bold text-[#064E3B] text-base sm:text-lg truncate">
                {PAGE_TITLES[activePage]}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {activePage === 'wastevision' ? (
              <button
                type="button"
                onClick={() => onNavigate('ecoreport')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#064E3B] bg-[#ECFDF5] hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Report Issue</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('wastevision')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#059669] hover:bg-[#064E3B] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ScanLine className="w-4 h-4" />
                <span>Scan Waste</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1320px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
