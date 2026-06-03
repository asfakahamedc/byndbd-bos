'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '../ui/icon';
import { cn } from '@/lib/utils';

// Serializable NavItem interface
export interface NavItem {
  name: string;
  href: string;
  iconName: 'Dashboard' | 'Work' | 'Trips' | 'People' | 'Settings' | 'SYSTEM' | 'DEPARTMENTS';
}

interface SidebarLinksProps {
  navItems: NavItem[];
}

// Icon dictionary mapped to Material Symbol names
const iconMap: Record<NavItem['iconName'], string> = {
  Dashboard: 'dashboard',
  Work: 'task_alt',
  Trips: 'luggage',
  People: 'groups',
  Settings: 'settings',
  SYSTEM: 'admin_panel_settings',
  DEPARTMENTS: 'business',
};

export function SidebarLinks({ navItems }: SidebarLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 mt-6 px-4 space-y-1">
      {navItems.map((item) => {
        const iconName = iconMap[item.iconName] || 'settings';
        
        // Match logic: highlights if active or starts with sub-routes
        const isActive = 
          pathname === item.href || 
          (item.href !== '/owner' && 
           item.href !== '/ceo' && 
           item.href !== '/operations' && 
           pathname?.startsWith(item.href));

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-[6px] transition-all duration-150 border-l-4",
              isActive
                ? "text-sunrise border-sunrise bg-sunrise/10 font-poppins font-semibold"
                : "text-[#9E9E9E] border-transparent hover:text-[#FAF9F2] hover:bg-[#FAF9F2]/5 font-poppins font-medium"
            )}
          >
            <Icon 
              name={iconName} 
              size={20} 
              color={isActive ? '#FF5F0F' : '#9E9E9E'} 
              className={isActive ? '' : 'group-hover:text-[#FAF9F2]'}
            />
            <span className="text-sm">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
