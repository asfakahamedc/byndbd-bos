import React from 'react';
import { getCurrentUser, signOut } from '@/actions/auth';
import { SidebarLinks, NavItem } from './sidebar-links';
import { Icon } from '../ui/icon';
import { Badge } from '../ui/badge';

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

  // Get dynamic layer badge styling from guidelines
  const getLayerBadge = (layer: number) => {
    switch (layer) {
      case 0:
        return { className: 'bg-gradient-to-r from-[#E8A830] via-[#FF5F0F] to-[#C24B0A] text-white border-none', label: 'Co-Founder' };
      case 1:
        return { className: 'bg-[#1D1D1B] text-[#FAF9F2] border border-[#FAF9F2]/20', label: 'CEO / COO' };
      case 2:
        return { className: 'bg-[#FF5F0F] text-white border-none', label: 'Admin Manager' };
      case 3:
        return { className: 'bg-[#FFF3E0] text-[#FF5F0F] border-none', label: 'Department Lead' };
      case 4:
        return { className: 'bg-[#E3F2FD] text-[#1565C0] border-none', label: 'Executive' };
      case 5:
        return { className: 'bg-[#F5F5F5] text-[#555555] border-none', label: 'Associate' };
      case 6:
        return { className: 'bg-[#E8F5E9] text-[#2E7D32] border-none', label: 'Host' };
      default:
        return { className: 'bg-[#F5F5F5] text-[#555555] border-none', label: `Layer ${layer}` };
    }
  };

  const badgeInfo = user !== null ? getLayerBadge(user.layer) : { className: 'bg-[#F5F5F5] text-[#555555]', label: 'Guest' };

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-dusk flex flex-col z-50 border-r border-[#FAF9F2]/10">
      {/* Official Bynd BD Horizontal Lockup Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-[#FAF9F2]/10">
        <img src="/color_logo.svg" className="w-8 h-8 filter brightness-110" alt="Bynd BD Logo" />
        <div className="flex flex-col">
          <span className="font-poppins font-black text-sm text-[#FAF9F2] uppercase tracking-[0.05em] leading-none">BYND BD</span>
          <span className="text-[10px] font-poppins font-bold text-sunrise tracking-[0.1em] uppercase mt-1 leading-none">BOS</span>
        </div>
      </div>

      {/* Render the Client links component passing the filtered navItems */}
      <SidebarLinks navItems={navItems} />

      {/* Footer Profile Section */}
      <div className="p-6 mt-auto border-t border-[#FAF9F2]/10 space-y-4 bg-black/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FAF9F2]/10 flex items-center justify-center overflow-hidden relative shrink-0 border border-[#FAF9F2]/20 text-[#FAF9F2] font-poppins font-bold text-sm">
            {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-poppins font-medium text-[#FAF9F2] leading-none truncate">{user?.full_name || 'BOS User'}</p>
            <div className="mt-1.5">
              <span className={`inline-block px-2 py-0.5 text-[9px] font-poppins font-semibold rounded-full uppercase tracking-wider ${badgeInfo.className}`}>
                {badgeInfo.label}
              </span>
            </div>
            {user?.department && (
              <p className="text-[10px] font-ubuntu font-light text-[#FAF9F2]/60 truncate mt-1">{user.department}</p>
            )}
          </div>
        </div>

        {user && (
          <form action={signOut} className="w-full">
            <button 
              type="submit" 
              className="w-full py-2 px-3 border border-ember/30 bg-ember/10 hover:bg-ember/20 text-[#FAF9F2] transition-colors font-poppins font-semibold text-xs rounded-[6px] flex items-center justify-center gap-2 uppercase tracking-[0.02em]"
            >
              <Icon name="logout" size={14} color="#C24B0A" />
              Sign Out
            </button>
          </form>
        )}
      </div>
    </aside>
  );
}
