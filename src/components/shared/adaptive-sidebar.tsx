import React from 'react';
import { getCurrentUser, signOut } from '@/actions/auth';
import { SidebarLinks, NavItem } from './sidebar-links';
import { LogOut } from 'lucide-react';

/**
 * AdaptiveSidebar is the server-rendered navigation sidebar for the Bynd BD BOS project.
 * It resolves the authenticated user session, filters access links dynamically by user layer,
 * and renders user profile footers.
 */
export async function AdaptiveSidebar() {
  const user = await getCurrentUser();

  // Resolve dashboard context route dynamically by user layer
  const dashboardHref = user
    ? user.layer === 0
      ? '/owner'
      : user.layer === 1
        ? '/ceo'
        : user.layer === 2
          ? '/operations'
          : user.layer === 4
            ? '/executive'
            : user.layer === 5
              ? '/host'
              : '/owner'
    : '/owner';

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: dashboardHref, iconName: 'Dashboard' },
    { name: 'Work', href: '/work', iconName: 'Work' },
    { name: 'Team', href: '/team', iconName: 'People' },
    { name: 'Trips', href: '/trips', iconName: 'Trips' },
    { name: 'Settings', href: '/owner/settings', iconName: 'Settings' },
  ];

  // 1. Only Layer 0-2 see "SYSTEM"
  if (user && user.layer >= 0 && user.layer <= 2) {
    navItems.push({ name: 'SYSTEM', href: '/system', iconName: 'SYSTEM' });
  }
  
  // 2. Only Leads+ (Layer <= 3) see "DEPARTMENTS"
  if (user && user.layer <= 3) {
    navItems.push({ name: 'DEPARTMENTS', href: '/departments', iconName: 'DEPARTMENTS' });
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-[#0F172A] flex flex-col z-50 shadow-xl">
      <div className="p-6 flex flex-col gap-1">
        <h1 className="text-h4 font-h4 text-white uppercase tracking-wider">BYND BD BOS</h1>
        <p className="text-label text-[#9CA3AF]">Enterprise OS</p>
      </div>

      {/* Render the Client links component passing the filtered navItems */}
      <SidebarLinks navItems={navItems} />

      {/* Footer Profile Section */}
      <div className="p-6 mt-auto border-t border-white/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden relative shrink-0 border border-white/10 text-white font-bold">
            {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-body text-white font-bold leading-none truncate">{user?.full_name || 'BOS User'}</p>
            <p className="text-[10px] text-[#9CA3AF] leading-tight uppercase tracking-wider mt-1 truncate">
              {user !== null ? `Layer ${user.layer}` : 'Guest Profile'}
            </p>
            {user?.department && (
              <p className="text-[9px] text-slate-400 truncate mt-0.5">{user.department}</p>
            )}
          </div>
        </div>

        {user && (
          <form action={signOut} className="w-full">
            <button 
              type="submit" 
              className="w-full py-2 px-3 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors font-bold text-xs rounded-none flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </form>
        )}
      </div>
    </aside>
  );
}
