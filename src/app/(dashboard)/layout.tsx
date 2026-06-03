import React from 'react';
import { AdaptiveSidebar } from '@/components/shared/adaptive-sidebar';
import { Icon } from '@/components/ui/icon';
import Image from 'next/image';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-morning-fog">
      {/* Side Navigation Panel */}
      <AdaptiveSidebar />

      {/* Main Content Area Wrapper */}
      <div className="flex flex-col min-h-screen">
        {/* Top AppBar Shell */}
        <header className="flex justify-between items-center h-[64px] pl-[240px] pr-lg w-full bg-white border-b border-[#E0E0E0] sticky top-0 z-40 shadow-sm">
          {/* Brand Logo & Search Bar */}
          <div className="flex items-center gap-md ml-lg">
            <div className="flex items-center gap-2 mr-2">
              <Image src="/color_logo.svg" alt="Bynd BD Logo" width={28} height={28} className="object-contain" />
              <span className="font-poppins font-bold text-sm text-dusk uppercase tracking-wider">BOS</span>
            </div>
            <div className="flex items-center bg-[#F5F5F5] px-md py-1.5 rounded-[6px] border border-[#E0E0E0] w-80 focus-within:border-sunrise focus-within:ring-2 focus-within:ring-sunrise transition-all">
              <Icon name="search" size={20} color="#555555" />
              <input
                type="text"
                placeholder="Search operations, trips, or staff..."
                className="bg-transparent border-none focus:ring-0 text-sm font-ubuntu w-full ml-2 text-dusk focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons & Profile */}
          <div className="flex items-center gap-md">
            <button className="hover:bg-[#F5F5F5] rounded-full p-2 text-[#555555] transition-all duration-200" aria-label="Help">
              <Icon name="help" size={20} color="#555555" />
            </button>
            <button className="hover:bg-[#F5F5F5] rounded-full p-2 text-[#555555] transition-all duration-200 relative" aria-label="Notifications">
              <Icon name="notifications" size={20} color="#555555" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-ember rounded-full border border-white"></span>
            </button>
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8olNfEvBdt7fTPDHbdco-V_khuL21hdjnk75_kucK7vvHxX0m6BeuRLV2dM313epKxtb09FX3oJKa2-jBu6ASPoU4t14IYudmsX9qBFsAzodwgRRue1rRH1PRMfHJAA98S5AOtO-TV6jXdtzxPEoLwLNbXzfQFzwRp0non8E6-cNsPcCkia3x-oSFnkdMnyFLUbengZYJKYX5aKkSHaJbBtEgvdAn-GGm-Xu9MSvRr5JyxOI_zVkfaMltRq56a5e8HvxLvWacukrG"
              alt="User Profile"
              width={32}
              height={32}
              className="rounded-full object-cover border border-[#E0E0E0]"
            />
          </div>
        </header>

        {/* Scrollable Layout Canvas */}
        <main className="ml-[240px] p-lg max-w-[1440px] w-[calc(100%-240px)] mx-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
