'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Compass, 
  CheckSquare, 
  Users, 
  Settings,
  ShieldAlert,
  Briefcase
} from 'lucide-react';
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

// Icon dictionary mapped to static components
const iconMap: Record<NavItem['iconName'], React.ComponentType<{ className?: string }>> = {
  Dashboard: LayoutDashboard,
  Work: CheckSquare,
  Trips: Compass,
  People: Users,
  Settings: Settings,
  SYSTEM: ShieldAlert,
  DEPARTMENTS: Briefcase,
};

export function SidebarLinks({ navItems }: SidebarLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 mt-6 px-4 space-y-1">
      {navItems.map((item) => {
        const Icon = iconMap[item.iconName] || Settings;
        
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
  );
}
