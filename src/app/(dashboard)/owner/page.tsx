import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import ClassBTimer from '@/components/dashboards/class-b-timer';
import ClassCModal from '@/components/dashboards/class-c-modal';
import { Icon } from '@/components/ui/icon';

// ============================================================================
// MOCK DATA STRUCTURES (Prepared for seamless replacement with Supabase hooks)
// ============================================================================

const BUSINESS_METRICS = {
  revenue: { value: 450000, percentageVsTarget: 12 },
  profit: { value: 120000, percentageVsForecast: 8 },
  bookings: { total: 22, confirmed: 14, pending: 5, conversionRate: 64 },
  opsEfficiency: { percentage: 94 }
};

const LIVE_TRIPS = [
  {
    id: 'trip-1',
    name: 'Mountain Valley Adventure',
    currentDay: 2,
    totalDays: 3,
    travelerCount: 6,
    hostName: 'John',
    status: 'All good' // Maps to success Badge variant
  }
];

const TEAM_ALERTS = [
  {
    id: 'alert-1',
    severity: 'critical', // Maps to critical Badge variant
    title: '1 Critical Trip Issue',
    description: 'Sylhet Valley: Transport delay > 2hrs'
  }
];

const ACTIVE_PROJECTS = [
  { id: 'proj-1', name: 'Q2 Marketing Campaign', progress: 75, statusText: '75% on track', isSuccess: true },
  { id: 'proj-2', name: 'Website Redesign', progress: 40, statusText: '40% in progress', isSuccess: false }
];



const SYSTEM_HEALTH = {
  status: '100% Online',
  lastPingMinutesAgo: 2
};

const formatBDT = (val: number) => `BDT ${val.toLocaleString('en-US')}`;

export default function OwnerDashboard() {
  return (
    <div className="space-y-xl">
      {/* Section 1: Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
        <div>
          <h2 className="text-h1 font-h1 text-on-surface mb-xs">Dashboard — Owner</h2>
          <div className="flex items-center gap-xs text-on-surface-variant">
            <Icon name="calendar_today" className="w-[18px] h-[18px]" />
            <p className="text-body">
              Today | This Week | <span className="text-sunrise font-bold">This Month</span> | Custom
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-low px-lg py-md rounded-xl border border-[#E0E0E0] shadow-sm cursor-pointer">
          <Icon name="date_range" size={20} color="#FF5F0F" />
          <span className="text-label">Oct 01, 2023 - Oct 31, 2023</span>
          <Icon name="expand_more" size={16} color="#9E9E9E" />
        </div>
      </section>

      {/* Section 2: Business Health metrics (4-col grid layout) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        {/* Revenue Card */}
        <Card className="p-lg flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <p className="text-label text-on-surface-variant">Revenue (MTD)</p>
            <Icon name="payments" size={20} color="#FF5F0F" />
          </div>
          <div>
            <h3 className="text-h1">{formatBDT(BUSINESS_METRICS.revenue.value)}</h3>
            <p className="text-label text-success flex items-center gap-1">
              <Badge variant="success">+{BUSINESS_METRICS.revenue.percentageVsTarget}% vs target</Badge>
            </p>
          </div>
        </Card>

        {/* Profit Card */}
        <Card className="p-lg flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <p className="text-label text-on-surface-variant">Profit (MTD)</p>
            <Icon name="account_balance_wallet" size={20} color="#E8A830" />
          </div>
          <div>
            <h3 className="text-h1">{formatBDT(BUSINESS_METRICS.profit.value)}</h3>
            <p className="text-label text-success flex items-center gap-1">
              <Badge variant="success">+{BUSINESS_METRICS.profit.percentageVsForecast}% vs forecast</Badge>
            </p>
          </div>
        </Card>

        {/* Bookings Card */}
        <Card className="p-lg h-40 relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <p className="text-label text-on-surface-variant">Bookings (MTD)</p>
            <Icon name="check_circle" className="w-5 h-5 text-sunrise" />
          </div>
          <div className="mt-2 relative z-10">
            <h3 className="text-h2">{BUSINESS_METRICS.bookings.total} Total</h3>
            <div className="flex gap-2 mt-1">
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant uppercase">Confirmed</span>
                <span className="font-bold text-label">{BUSINESS_METRICS.bookings.confirmed}</span>
              </div>
              <div className="w-px h-6 bg-outline-variant"></div>
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant uppercase">Pending</span>
                <span className="font-bold text-label">{BUSINESS_METRICS.bookings.pending}</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-lg right-lg text-right">
            <p className="text-[20px] font-bold text-sunrise leading-none">{BUSINESS_METRICS.bookings.conversionRate}%</p>
            <p className="text-[9px] text-on-surface-variant uppercase tracking-wider">Conv. Rate</p>
          </div>
        </Card>

        {/* Efficiency Card */}
        <Card className="p-lg flex flex-col justify-between h-40 bg-sunrise/5 border-sunrise/20">
          <div className="flex justify-between items-start">
            <p className="text-label text-on-surface-variant">Ops Efficiency</p>
            <Icon name="speed" size={20} color="#FF5F0F" />
          </div>
          <div>
            <h3 className="text-h1 text-sunrise">{BUSINESS_METRICS.opsEfficiency.percentage}%</h3>
            <div className="w-full bg-outline-variant/30 h-2 rounded-full mt-2">
              <div 
                className="bg-success h-full rounded-full transition-all duration-500" 
                style={{ width: `${BUSINESS_METRICS.opsEfficiency.percentage}%` }}
              />
            </div>
          </div>
        </Card>
      </section>

      {/* Section 3 & 4 Grid (2-col grid layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Section 3: Trips & Operations */}
        <div className="space-y-lg">
          {/* Live Trips Card */}
          <Card className="overflow-hidden flex flex-col">
            <div className="bg-surface-container px-lg py-md border-b border-[#E0E0E0] flex justify-between items-center">
              <h4 className="text-h2 flex items-center gap-2">
                <Icon name="explore" className="w-5 h-5 text-sunrise" />
                Live Trips
              </h4>
              <Badge variant="primary">{LIVE_TRIPS.length} Active</Badge>
            </div>
            <div className="p-lg">
              {LIVE_TRIPS.map((trip) => (
                <div key={trip.id} className="flex items-center justify-between p-lg border border-[#E0E0E0] bg-surface">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded bg-surface-container-high flex items-center justify-center">
                      <Icon name="landscape" size={24} color="#FF5F0F" />
                    </div>
                    <div>
                      <h5 className="text-h4">{trip.name}</h5>
                      <p className="text-body text-on-surface-variant">
                        Day {trip.currentDay} of {trip.totalDays} • {trip.travelerCount} travelers • Host: {trip.hostName}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant="success" className="mb-1">{trip.status}</Badge>
                    <button className="text-sunrise text-label hover:underline">Details</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Team Alerts Card */}
          <Card className="overflow-hidden flex flex-col">
            <div className="bg-surface-container px-lg py-md border-b border-[#E0E0E0]">
              <h4 className="text-h2 flex items-center gap-2">
                <Icon name="warning" className="w-5 h-5 text-error" />
                Team Alerts
              </h4>
            </div>
            <div className="p-lg space-y-md">
              {TEAM_ALERTS.map((alert) => (
                <div 
                  key={alert.id} 
                  className="flex items-center justify-between p-lg border-l-4 border-error bg-ember/5"
                >
                  <div className="flex items-center gap-3">
                    <Icon name="warning" className="w-5 h-5 text-error" />
                    <div>
                      <p className="text-label font-bold">{alert.title}</p>
                      <p className="text-[12px] text-on-surface-variant">{alert.description}</p>
                    </div>
                  </div>
                  <Icon name="chevron_right" className="w-5 h-5 text-outline cursor-pointer" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Section 4: Projects & Escalations */}
        <div className="space-y-lg">
          {/* Active Projects Card */}
          <Card className="overflow-hidden flex flex-col">
            <div className="bg-surface-container px-lg py-md border-b border-[#E0E0E0]">
              <h4 className="text-h2 flex items-center gap-2">
                <Icon name="rocket_launch" size={20} color="#FF5F0F" />
                Active Projects
              </h4>
            </div>
            <div className="p-lg space-y-lg">
              {ACTIVE_PROJECTS.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-label font-bold">{project.name}</p>
                    <Badge variant={project.isSuccess ? 'success' : 'secondary'}>{project.statusText}</Badge>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${project.isSuccess ? 'bg-success' : 'bg-secondary'}`} 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Escalations Card */}
          <Card className="overflow-hidden flex flex-col">
            <div className="bg-surface-container px-lg py-md border-b border-[#E0E0E0]">
              <h4 className="text-h2 flex items-center gap-2">
                <Icon name="campaign" size={20} color="#FF5F0F" />
                Escalations
              </h4>
            </div>
            <div className="p-lg space-y-md">
              <ClassBTimer 
                actionTitle="Budget reallocation"
                initiatedBy="Sajek Valley Retreat logistics"
                amount="BDT 80,000"
                description="Over-budget alert for Sajek Valley Retreat logistics."
              />

              <ClassCModal 
                actionType="Class C Action: Hire new Host"
                description="Final interview summary for Rahim Ali available."
                coFounderAStatus="confirmed"
                coFounderBStatus="pending"
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Section: Bottom Summary (Operational Outlook & System Health) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-lg items-center">
        <div className="md:col-span-2">
          <div className="bg-inverse-surface rounded-[6px] p-xl flex items-center gap-xl">
            <div className="hidden md:block flex-shrink-0">
              <Image 
                alt="Data Visualization Overlay" 
                className="object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu1pgFTID3TIUiHL2DgAy_V6o3pqhXeyaWJtMhCblXrfBjt_Bb-TWLM13bVOLquCmT5bC5D-Cxh-urA-RMfq1RhlPA7wGe9dMXPSEewwU3aN0IJZvK7K6TA0T3DgPSYnrbBPv4jZ0lKc7_qo48i5gpV-fRpblJeGoYKLbv9pZM4dZlXPD1fjl4C9zmfPnNeae8-6KA_E5wkGFCsw1Ldq7aJXaX-9KHYlLXn9j050tit6Q82Z4n7DmlKFXpO52v6ajbmhxv4QPS_NCf" 
                width={128}
                height={128}
              />
            </div>
            <div>
              <h4 className="text-white text-h2 mb-xs">Operational Outlook: Stable</h4>
              <p className="text-[#9CA3AF] text-body max-w-lg">
                All primary business units are operating within defined KPIs. Cash flow is healthy with no projected shortfalls.
              </p>
              <button className="mt-md bg-sunrise text-white px-lg py-2 rounded-lg font-bold text-label hover:opacity-90 transition-opacity">
                Export Monthly Report
              </button>
            </div>
          </div>
        </div>

        <Card className="p-xl rounded-[6px] h-full flex flex-col justify-center text-center">
          <p className="text-on-surface-variant text-label uppercase tracking-widest mb-2">System Health</p>
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <span className="w-3 h-3 bg-success rounded-full animate-pulse" />
            <h3 className="text-h1 text-on-surface">{SYSTEM_HEALTH.status}</h3>
          </div>
          <p className="text-body text-on-surface-variant">Last ping: {SYSTEM_HEALTH.lastPingMinutesAgo} mins ago</p>
        </Card>
      </section>
    </div>
  );
}

export const dynamic = 'force-dynamic';
