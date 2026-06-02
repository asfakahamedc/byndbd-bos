'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Compass, 
  CheckSquare, 
  Users, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * AdaptiveSidebar is the persistent left navigation sidebar for the Bynd BD BOS project.
 * Uses Lucide icons and highlights the active route based on the pathname.
 */
export function AdaptiveSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/owner', icon: LayoutDashboard },
    { name: 'Work', href: '/work', icon: CheckSquare },
    { name: 'Trips', href: '/owner/trips', icon: Compass },
    { name: 'People', href: '/owner/people', icon: Users },
    { name: 'Settings', href: '/owner/settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-[#0F172A] flex flex-col z-50 shadow-xl">
      <div className="p-6 flex flex-col gap-1">
        <h1 className="text-h4 font-h4 text-white uppercase tracking-wider">BYND BD BOS</h1>
        <p className="text-label text-[#9CA3AF]">Enterprise OS</p>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Matches exact path or is a sub-path of the item href
          const isActive = pathname === item.href || (item.href !== '/owner' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-none transition-all duration-150 border-l-4",
                isActive
                  ? "text-white border-primary bg-primary/10 font-bold"
                  : "text-[#9CA3AF] border-transparent hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-body">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            OC
          </div>
          <div>
            <p className="text-label text-white font-bold">Owner Admin</p>
            <p className="text-[10px] text-[#9CA3AF]">v2.4.0 Stable</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
