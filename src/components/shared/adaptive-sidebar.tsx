'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
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

  const isCeoContext = pathname?.startsWith('/ceo');
  const isOperationsContext = pathname?.startsWith('/operations');

  const dashboardHref = isOperationsContext 
    ? '/operations' 
    : isCeoContext 
      ? '/ceo' 
      : '/owner';

  const navItems = [
    { name: 'Dashboard', href: dashboardHref, icon: LayoutDashboard },
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
          const isActive = pathname === item.href || (item.href !== '/owner' && item.href !== '/ceo' && item.href !== '/operations' && pathname?.startsWith(item.href));

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
          {isOperationsContext ? (
            <>
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden relative shrink-0 border border-white/10">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDXJ6Hye1WeVPQ26Nbs2WfascJBsUrmpXp8wlgvPxZ7aXRijp_GrHuoInaIKM3euAhsZqu8zCuQEOXOqdQuWDErNzuor97cRSKMjnWCmV3yV81DP7cg96o4cOvPgkTOo4_yNZh95yiSQwfLpchAbkbox6Gj7TVGO5k2qFzQOkvpqfhy9S1uOl3eyJpVCS4fUZb4aMWIhNQY_TfMraCwaW1sOkJFsZji5kpN5dXrc2z9OKx4FqVyzZqVfxOAd2dvfZn85ErSOfkM-Fs"
                  alt="Ops Lead"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-body text-white font-bold leading-none">Ops Lead</p>
                <p className="text-[10px] text-[#9CA3AF] leading-tight uppercase tracking-wider mt-1">Internal Access</p>
              </div>
            </>
          ) : isCeoContext ? (
            <>
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden relative shrink-0">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEYxhWyCcc1TF_BASKslTCjb2UktrbTSrU1HJbeGCVbaW_3_AlSEvFiNqMGc-zwfih4eUyM_nwoqMw-pG8-2Ur6L4J3sGPHptaU1AIvdsLt587YqACKXTiJpEAzWhm0WKq8JPDadRKYQCT2ABKL2zmOf9nlaMMdRQ_Vw_PG6RudCmcFEKVWPjLbzi3deYyJcF-iJgZz6UH4Cu7SjDg61mjQ8IYxq7qRYJyMWvhF3QvTbwpz-RV65WhlFdyo-LisNEMJi7ZNoTRmiOy"
                  alt="Rahat Ahmed"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-body text-white font-bold leading-none">Rahat Ahmed</p>
                <p className="text-label text-slate-400 leading-tight">CEO/COO</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                OC
              </div>
              <div>
                <p className="text-label text-white font-bold">Owner Admin</p>
                <p className="text-[10px] text-[#9CA3AF]">v2.4.0 Stable</p>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
