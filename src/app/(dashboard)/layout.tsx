import React from 'react';
import { AdaptiveSidebar } from '@/components/shared/adaptive-sidebar';
import { Search, HelpCircle, Bell } from 'lucide-react';
import Image from 'next/image';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f9f9ff]">
      {/* Side Navigation Panel */}
      <AdaptiveSidebar />

      {/* Main Content Area Wrapper */}
      <div className="flex flex-col min-h-screen">
        {/* Top AppBar Shell */}
        <header className="flex justify-between items-center h-[60px] pl-[280px] pr-lg w-full bg-white border-b border-outline-variant sticky top-0 z-40 shadow-sm">
          {/* Search Bar */}
          <div className="flex items-center bg-surface-container-low px-md py-1.5 rounded-lg border border-outline-variant w-96 ml-lg">
            <Search className="w-5 h-5 text-outline" />
            <input
              type="text"
              placeholder="Search operations, trips, or staff..."
              className="bg-transparent border-none focus:ring-0 text-body w-full ml-2 text-on-surface focus:outline-none"
            />
          </div>

          {/* Action Buttons & Profile */}
          <div className="flex items-center gap-md">
            <button className="hover:bg-surface-container-low rounded-full p-2 text-on-surface-variant transition-all duration-200">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button className="hover:bg-surface-container-low rounded-full p-2 text-on-surface-variant transition-all duration-200 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-white"></span>
            </button>
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8olNfEvBdt7fTPDHbdco-V_khuL21hdjnk75_kucK7vvHxX0m6BeuRLV2dM313epKxtb09FX3oJKa2-jBu6ASPoU4t14IYudmsX9qBFsAzodwgRRue1rRH1PRMfHJAA98S5AOtO-TV6jXdtzxPEoLwLNbXzfQFzwRp0non8E6-cNsPcCkia3x-oSFnkdMnyFLUbengZYJKYX5aKkSHaJbBtEgvdAn-GGm-Xu9MSvRr5JyxOI_zVkfaMltRq56a5e8HvxLvWacukrG"
              alt="User Profile"
              width={32}
              height={32}
              className="rounded-full object-cover border border-outline-variant"
            />
          </div>
        </header>

        {/* Scrollable Layout Canvas */}
        <main className="ml-[280px] p-lg max-w-[1440px] w-[calc(100%-280px)] mx-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
