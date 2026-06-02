'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  CheckSquare, 
  Compass, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle, 
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPING DEFINITIONS
// ============================================================================

interface FunnelMetrics {
  inquiries: number;
  quotes: number;
  bookings: number;
  conversionRate: number;
  avgDealSize: string;
}

interface TeamPerformanceMetrics {
  onTimeTasksRate: number;
  deadlineBreachesCount: number;
  overdueTasks: string[];
}

interface TripMetrics {
  activeCount: number;
  departingCount: number;
  returningCount: number;
  incident: {
    title: string;
    severity: 'warning' | 'critical' | 'neutral';
  } | null;
  hostStatus: string;
}

interface DepartmentHealthMetrics {
  name: string;
  tasksDone: number;
  totalTasks: number;
  overdueCount: number;
  status: 'Green' | 'Yellow' | 'Red';
  members: number;
}

interface Escalation {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
}

interface ApprovalRequest {
  id: string;
  classification: string;
  title: string;
  description: string;
}

interface TripRow {
  id: string;
  destination: string;
  group: string;
  statusText: string;
  statusColor: 'success' | 'blue' | 'neutral';
}

interface FeedItem {
  id: string;
  title: string;
  timestamp: string;
  severity: 'primary' | 'error' | 'success';
  description?: string;
}

interface DashboardData {
  metrics: FunnelMetrics;
  teamPerformance: TeamPerformanceMetrics;
  trips: TripMetrics;
  departments: DepartmentHealthMetrics[];
  escalations: Escalation[];
  approvals: ApprovalRequest[];
  tripsList: TripRow[];
}

// ============================================================================
// STRUCTURED MOCK DATA (Tabbed contexts for: Week, Month, Quarter)
// ============================================================================

const MOCK_DATA: Record<'week' | 'month' | 'quarter', DashboardData> = {
  week: {
    metrics: {
      inquiries: 12,
      quotes: 8,
      bookings: 6,
      conversionRate: 50,
      avgDealSize: '32K'
    },
    teamPerformance: {
      onTimeTasksRate: 94,
      deadlineBreachesCount: 2,
      overdueTasks: ['Content copy', 'Vendor brief']
    },
    trips: {
      activeCount: 3,
      departingCount: 2,
      returningCount: 1,
      incident: {
        title: 'Weather Alert: Heavy rain warnings in Sajek',
        severity: 'warning'
      },
      hostStatus: 'All checked in'
    },
    departments: [
      { name: 'Operations', members: 4, tasksDone: 8, totalTasks: 8, overdueCount: 2, status: 'Yellow' },
      { name: 'Finance', members: 2, tasksDone: 14, totalTasks: 15, overdueCount: 0, status: 'Green' },
      { name: 'HR & Admin', members: 1, tasksDone: 4, totalTasks: 5, overdueCount: 1, status: 'Yellow' }
    ],
    escalations: [
      { id: 'esc-1', priority: 'High', title: 'Trip 1 Hotel check-in delay', description: 'Hotel check-in delay at Sajek Valley resort.' },
      { id: 'esc-2', priority: 'Medium', title: 'Vendor payment variance', description: 'BDT 15k difference in transport invoice.' }
    ],
    approvals: [
      { id: 'app-1', classification: 'Class B Decision', title: 'Budget reallocation', description: 'Reallocate BDT 50k from marketing to Sajek logistics.' },
      { id: 'app-2', classification: 'Class C Decision', title: 'New Vendor contract', description: 'Approve local transport operator SLA for Sundarbans.' }
    ],
    tripsList: [
      { id: '#TRP-8821', destination: 'Sajek Valley, Rangamati', group: 'Corporate Ret. (12p)', statusText: 'Onsite / Active', statusColor: 'success' },
      { id: '#TRP-8824', destination: "Cox's Bazar", group: 'Private Tour (4p)', statusText: 'Departing Tomorrow', statusColor: 'blue' }
    ]
  },
  month: {
    metrics: {
      inquiries: 52,
      quotes: 38,
      bookings: 26,
      conversionRate: 50,
      avgDealSize: '45K'
    },
    teamPerformance: {
      onTimeTasksRate: 91,
      deadlineBreachesCount: 5,
      overdueTasks: ['Social media calendar', 'Asset sourcing', 'Host payout verify']
    },
    trips: {
      activeCount: 12,
      departingCount: 8,
      returningCount: 6,
      incident: {
        title: 'Marine Drive Blockage Alert',
        severity: 'warning'
      },
      hostStatus: '9/10 hosts checked in'
    },
    departments: [
      { name: 'Operations', members: 4, tasksDone: 38, totalTasks: 40, overdueCount: 5, status: 'Yellow' },
      { name: 'Finance', members: 2, tasksDone: 28, totalTasks: 30, overdueCount: 1, status: 'Green' },
      { name: 'HR & Admin', members: 1, tasksDone: 12, totalTasks: 14, overdueCount: 2, status: 'Yellow' }
    ],
    escalations: [
      { id: 'esc-1', priority: 'High', title: 'Trip 8 flight cancellation', description: 'DAC-CXB flight canceled due to technical issues.' },
      { id: 'esc-2', priority: 'Medium', title: 'Guide payment discrepancy', description: 'Sreemangal guide requesting overtime allowance.' }
    ],
    approvals: [
      { id: 'app-1', classification: 'Class B Decision', title: 'Quarter marketing budget', description: 'Approve BDT 200k for Facebook/Google Ads Campaign.' },
      { id: 'app-2', classification: 'Class C Decision', title: 'Local host SLA agreement', description: 'Standard SLA agreement update for independent hosts.' }
    ],
    tripsList: [
      { id: '#TRP-8821', destination: 'Sajek Valley, Rangamati', group: 'Corporate Ret. (12p)', statusText: 'Onsite / Active', statusColor: 'success' },
      { id: '#TRP-8824', destination: "Cox's Bazar", group: 'Private Tour (4p)', statusText: 'Departing Tomorrow', statusColor: 'blue' },
      { id: '#TRP-8828', destination: 'Sreemangal', group: 'Family Tour (6p)', statusText: 'Returning Today', statusColor: 'neutral' },
      { id: '#TRP-8830', destination: 'Sundarbans', group: 'Adventure Group (15p)', statusText: 'Onsite / Active', statusColor: 'success' }
    ]
  },
  quarter: {
    metrics: {
      inquiries: 164,
      quotes: 112,
      bookings: 82,
      conversionRate: 50,
      avgDealSize: '50K'
    },
    teamPerformance: {
      onTimeTasksRate: 89,
      deadlineBreachesCount: 14,
      overdueTasks: ['Yearly tax filing', 'Q3 planning session', 'Compliance audit']
    },
    trips: {
      activeCount: 34,
      departingCount: 28,
      returningCount: 24,
      incident: {
        title: 'Monsoon season weather warning advisory active',
        severity: 'warning'
      },
      hostStatus: 'All active checkins successful'
    },
    departments: [
      { name: 'Operations', members: 4, tasksDone: 120, totalTasks: 130, overdueCount: 10, status: 'Yellow' },
      { name: 'Finance', members: 2, tasksDone: 85, totalTasks: 90, overdueCount: 3, status: 'Green' },
      { name: 'HR & Admin', members: 1, tasksDone: 30, totalTasks: 35, overdueCount: 5, status: 'Yellow' }
    ],
    escalations: [
      { id: 'esc-1', priority: 'High', title: 'Corporate travel contract stall', description: 'Stalled negotiations with tech client regarding indemnity.' },
      { id: 'esc-2', priority: 'Medium', title: 'Office lease renewal clause variance', description: 'Variance found in annual escalation rate clause.' }
    ],
    approvals: [
      { id: 'app-1', classification: 'Class B Decision', title: 'Annual transport pre-qualification', description: 'Approve transport vendor pre-qual list.' },
      { id: 'app-2', classification: 'Class C Decision', title: 'Q3 Hiring plan', description: 'Recruitment plan approval for 2 junior operations assistants.' }
    ],
    tripsList: [
      { id: '#TRP-8821', destination: 'Sajek Valley, Rangamati', group: 'Corporate Ret. (12p)', statusText: 'Onsite / Active', statusColor: 'success' },
      { id: '#TRP-8824', destination: "Cox's Bazar", group: 'Private Tour (4p)', statusText: 'Departing Tomorrow', statusColor: 'blue' },
      { id: '#TRP-8828', destination: 'Sreemangal', group: 'Family Tour (6p)', statusText: 'Returning Today', statusColor: 'neutral' },
      { id: '#TRP-8830', destination: 'Sundarbans', group: 'Adventure Group (15p)', statusText: 'Onsite / Active', statusColor: 'success' },
      { id: '#TRP-8835', destination: 'Sylhet', group: 'Private Tour (8p)', statusText: 'Departing in 3 Days', statusColor: 'blue' }
    ]
  }
};

const INITIAL_FEED_ITEMS: FeedItem[] = [
  { id: 'feed-1', title: 'TRP-8821 Manifest updated', timestamp: '2 mins ago', severity: 'primary' },
  { id: 'feed-2', title: 'Route Alert: Marine Drive', timestamp: '10 mins ago', severity: 'error', description: 'Protests reported, routes diverted.' }
];

export default function CEODashboard() {
  const [filter, setFilter] = React.useState<'week' | 'month' | 'quarter'>('week');
  const [approvals, setApprovals] = React.useState<ApprovalRequest[]>(MOCK_DATA.week.approvals);
  const [feedItems, setFeedItems] = React.useState<FeedItem[]>(INITIAL_FEED_ITEMS);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Sync approvals list when date filter changes
  React.useEffect(() => {
    setApprovals(MOCK_DATA[filter].approvals);
  }, [filter]);

  const activeData = MOCK_DATA[filter];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleApprove = (id: string, title: string) => {
    setApprovals(prev => prev.filter(app => app.id !== id));
    setFeedItems(prev => [
      {
        id: `feed-new-${Date.now()}`,
        title: `Approved: ${title}`,
        timestamp: 'Just now',
        severity: 'success' as const,
        description: 'Action approved successfully by CEO/COO.'
      },
      ...prev
    ]);
  };

  const handleReject = (id: string, title: string) => {
    setApprovals(prev => prev.filter(app => app.id !== id));
    setFeedItems(prev => [
      {
        id: `feed-new-${Date.now()}`,
        title: `Rejected: ${title}`,
        timestamp: 'Just now',
        severity: 'error' as const,
        description: 'Action rejected by CEO/COO.'
      },
      ...prev
    ]);
  };

  return (
    <div className="space-y-xl">
      {/* Top Header Block */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
        <div>
          <h2 className="text-h1 font-h1 text-on-surface mb-xs">Dashboard — CEO / COO</h2>
          <p className="text-on-surface-variant text-body">Operational oversight for Bynd BD Travel Ops.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Filter Segment */}
          <div className="flex bg-surface-container-low border border-outline-variant rounded-none p-1 gap-1">
            {(['week', 'month', 'quarter'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={cn(
                  "px-3 py-1.5 text-label font-bold transition-all uppercase rounded-none",
                  filter === tab
                    ? "bg-primary text-on-primary font-bold shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40"
                )}
              >
                {tab === 'week' ? 'This Week' : tab === 'month' ? 'This Month' : 'This Quarter'}
              </button>
            ))}
          </div>

          <button 
            onClick={handleRefresh}
            className="p-2.5 bg-white border border-outline-variant hover:bg-slate-50 transition-all rounded-none flex items-center justify-center" 
            title="Refresh Data"
          >
            <RefreshCw 
              className={cn(
                "w-4 h-4 text-on-surface-variant transition-transform duration-500", 
                isRefreshing && "rotate-180"
              )} 
            />
          </button>
        </div>
      </section>

      {/* Row 1: Funnel, Performance, Trips Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* Operations Flow Funnel */}
        <Card className="p-lg flex flex-col justify-between h-full min-h-[220px]">
          <div className="flex justify-between items-start mb-md">
            <span className="text-on-surface-variant text-label font-bold uppercase tracking-wider">Operations Flow</span>
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-sm my-auto w-full">
            <div className="flex justify-between items-center border-b border-outline-variant/60 pb-1">
              <span className="text-body text-on-surface-variant">Inquiries</span>
              <span className="font-bold text-h4">{activeData.metrics.inquiries}</span>
            </div>
            <div className="flex justify-between items-center border-b border-outline-variant/60 pb-1">
              <span className="text-body text-on-surface-variant">Quotes Sent</span>
              <span className="font-bold text-h4">{activeData.metrics.quotes}</span>
            </div>
            <div className="flex justify-between items-center border-b border-outline-variant/60 pb-1">
              <span className="text-body text-on-surface-variant">Bookings</span>
              <span className="font-bold text-h4">{activeData.metrics.bookings}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="bg-primary/5 p-2 border border-primary/10 rounded-none text-center">
                <span className="text-[9px] text-primary uppercase font-bold block">Conversion</span>
                <span className="text-h3 font-extrabold text-primary">{activeData.metrics.conversionRate}%</span>
              </div>
              <div className="bg-success/5 p-2 border border-success/10 rounded-none text-center">
                <span className="text-[9px] text-success uppercase font-bold block">Avg Deal</span>
                <span className="text-h3 font-extrabold text-success">BDT {activeData.metrics.avgDealSize}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Team Performance */}
        <Card className="p-lg flex flex-col justify-between h-full min-h-[220px]">
          <div className="flex justify-between items-start mb-md">
            <span className="text-on-surface-variant text-label font-bold uppercase tracking-wider">Team Performance</span>
            <CheckSquare className="w-5 h-5 text-primary" />
          </div>
          <div className="my-auto space-y-md w-full">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-h2 font-extrabold text-on-surface">{activeData.teamPerformance.onTimeTasksRate}%</span>
                <p className="text-[9px] text-on-surface-variant uppercase font-bold">On-Time Tasks</p>
              </div>
              <div className="text-right">
                <span className="text-h2 font-extrabold text-error">{activeData.teamPerformance.deadlineBreachesCount}</span>
                <p className="text-[9px] text-error uppercase font-bold">Deadline Breaches</p>
              </div>
            </div>
            
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold uppercase text-on-surface-variant">Overdue Tasks</p>
              <div className="space-y-1">
                {activeData.teamPerformance.overdueTasks.map((task, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-1.5 bg-error/5 border-l-2 border-error text-xs font-semibold text-error">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* This Week's Trips status */}
        <Card className="p-lg flex flex-col justify-between h-full min-h-[220px]">
          <div className="flex justify-between items-start mb-md">
            <span className="text-on-surface-variant text-label font-bold uppercase tracking-wider">This Week Trips</span>
            <Compass className="w-5 h-5 text-primary" />
          </div>
          
          <div className="my-auto space-y-md w-full">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-primary/5 p-2 border border-primary/10 rounded-none">
                <span className="text-[20px] font-extrabold text-primary block leading-none">{activeData.trips.activeCount}</span>
                <span className="text-[9px] text-on-surface-variant uppercase font-bold">Active</span>
              </div>
              <div className="bg-success/5 p-2 border border-success/10 rounded-none">
                <span className="text-[20px] font-extrabold text-success block leading-none">{activeData.trips.departingCount}</span>
                <span className="text-[9px] text-on-surface-variant uppercase font-bold">Departing</span>
              </div>
              <div className="bg-slate-100 p-2 border border-outline-variant rounded-none">
                <span className="text-[20px] font-extrabold text-on-surface block leading-none">{activeData.trips.returningCount}</span>
                <span className="text-[9px] text-on-surface-variant uppercase font-bold">Returning</span>
              </div>
            </div>

            {activeData.trips.incident && (
              <div className="flex items-center justify-between p-2 bg-error/5 border border-error/10">
                <div className="flex items-center gap-2 text-xs text-error font-bold leading-tight">
                  <AlertTriangle className="w-4 h-4 text-error shrink-0" />
                  <span>{activeData.trips.incident.title}</span>
                </div>
                <Badge variant="critical" className="shrink-0">Alert</Badge>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-outline-variant/60">
              <span className="text-xs text-on-surface-variant font-medium">Host check-in status:</span>
              <span className="text-xs font-bold text-success flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                {activeData.trips.hostStatus}
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* Row 2: Department Health, Escalations, Approvals, Log Feed */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        {/* Left Side: Department Health & Trips Table (col-span 2) */}
        <div className="lg:col-span-2 space-y-xl">
          {/* Department Health Card */}
          <Card className="flex flex-col">
            <div className="bg-slate-50 px-lg py-md border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-h3 text-on-surface flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Department Health
              </h3>
              <button className="text-primary font-bold text-label hover:underline">Full Org Chart</button>
            </div>
            
            <div className="p-lg space-y-lg">
              {activeData.departments.map((dept, index) => {
                const percent = Math.round((dept.tasksDone / dept.totalTasks) * 100);
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-body font-bold text-on-surface">{dept.name}</span>
                        <span className="text-label text-on-surface-variant">({dept.members} members)</span>
                      </div>
                      <Badge variant={dept.status === 'Green' ? 'success' : 'warning'}>
                        {dept.status === 'Green' ? 'On-Track' : 'Alert'}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between text-[11px] font-bold text-on-surface-variant">
                      <span>Task Completion ({dept.tasksDone}/{dept.totalTasks})</span>
                      <span>{percent}%</span>
                    </div>
                    
                    <div className="w-full bg-slate-100 h-2 rounded-none overflow-hidden border border-outline-variant/30">
                      <div 
                        className={cn(
                          "h-full transition-all duration-300", 
                          dept.status === 'Green' ? 'bg-success' : 'bg-[#F59E0B]'
                        )}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    
                    {dept.overdueCount > 0 && (
                      <p className="text-[10px] text-error font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {dept.overdueCount} tasks overdue
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Trips Table */}
          <div className="space-y-lg pt-2">
            <div className="flex justify-between items-center">
              <h3 className="text-h3 text-on-surface flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" />
                This Week&apos;s Trips
              </h3>
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-label text-on-surface-variant font-semibold">
                  <span className="w-2.5 h-2.5 rounded-none bg-blue-400"></span> Depart
                </span>
                <span className="flex items-center gap-1.5 text-label text-on-surface-variant font-semibold">
                  <span className="w-2.5 h-2.5 rounded-none bg-success"></span> Active
                </span>
                <span className="flex items-center gap-1.5 text-label text-on-surface-variant font-semibold">
                  <span className="w-2.5 h-2.5 rounded-none bg-slate-400"></span> Return
                </span>
              </div>
            </div>
            
            <div className="bg-white border border-outline-variant rounded-none overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead className="bg-slate-50 border-b border-outline-variant">
                  <tr>
                    <th className="px-6 py-4 text-label font-bold uppercase text-on-surface-variant">Trip ID</th>
                    <th className="px-6 py-4 text-label font-bold uppercase text-on-surface-variant">Destination</th>
                    <th className="px-6 py-4 text-label font-bold uppercase text-on-surface-variant">Group</th>
                    <th className="px-6 py-4 text-label font-bold uppercase text-on-surface-variant">Status</th>
                    <th className="px-6 py-4 text-label font-bold uppercase text-on-surface-variant">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {activeData.tripsList.map((trip) => (
                    <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-body text-primary font-bold">{trip.id}</td>
                      <td className="px-6 py-4 text-body font-medium">{trip.destination}</td>
                      <td className="px-6 py-4 text-body text-on-surface-variant">{trip.group}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "w-2 h-2 rounded-none",
                            trip.statusColor === 'success' && "bg-success status-pulse",
                            trip.statusColor === 'blue' && "bg-blue-400",
                            trip.statusColor === 'neutral' && "bg-slate-400"
                          )}></span>
                          <span className="text-label font-bold">{trip.statusText}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="hover:text-primary p-1 border border-transparent hover:border-outline-variant transition-all">
                          <Eye className="w-4 h-4 text-on-surface-variant" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Escalations, Approvals, Feed (col-span 1) */}
        <div className="space-y-xl">
          {/* Approvals */}
          <Card className="flex flex-col">
            <div className="bg-slate-50 px-lg py-md border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-h3 text-on-surface flex items-center gap-2">
                Approvals
              </h3>
              {approvals.length > 0 && (
                <span className="bg-error text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {approvals.length}
                </span>
              )}
            </div>
            
            <div className="p-lg space-y-md">
              {approvals.length === 0 ? (
                <div className="text-center py-6 text-on-surface-variant">
                  <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-xs font-bold text-success">All approvals completed!</p>
                </div>
              ) : (
                approvals.map((app) => (
                  <div 
                    key={app.id} 
                    className="p-4 border border-outline-variant bg-surface space-y-3 border-l-4 border-l-primary"
                  >
                    <div>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{app.classification}</p>
                      <h4 className="text-body font-bold text-on-surface">{app.title}</h4>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-tight">{app.description}</p>
                    <div className="flex gap-2 pt-1">
                      <button 
                        onClick={() => handleApprove(app.id, app.title)}
                        className="flex-1 bg-primary text-white py-2 px-3 font-bold text-label hover:bg-blue-700 transition-all rounded-none"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(app.id, app.title)}
                        className="flex-1 bg-slate-100 text-on-surface border border-outline-variant py-2 px-3 font-bold text-label hover:bg-slate-200 transition-all rounded-none"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Escalations */}
          <Card className="flex flex-col">
            <div className="bg-slate-50 px-lg py-md border-b border-outline-variant">
              <h3 className="text-h3 text-on-surface flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-error" />
                Active Escalations
              </h3>
            </div>
            
            <div className="p-lg space-y-md">
              {activeData.escalations.map((esc) => (
                <div 
                  key={esc.id} 
                  className={cn(
                    "p-3 border-l-4 bg-slate-50 relative",
                    esc.priority === 'High' ? 'border-l-error' : 'border-l-[#F59E0B]'
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-wider",
                      esc.priority === 'High' ? 'text-error' : 'text-[#F59E0B]'
                    )}>
                      {esc.priority} Priority
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface mb-1">{esc.title}</h4>
                  <p className="text-[11px] text-on-surface-variant leading-tight">{esc.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Operations Feed */}
          <div className="bg-slate-50 border border-outline-variant p-lg space-y-lg rounded-none shadow-inner">
            <h4 className="text-h4 text-on-surface flex items-center gap-2">
              Operations Feed
            </h4>
            <div className="space-y-lg max-h-[220px] overflow-y-auto pr-1">
              {feedItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <span className={cn(
                    "w-2.5 h-2.5 rounded-none mt-1 shrink-0",
                    item.severity === 'primary' && "bg-primary",
                    item.severity === 'error' && "bg-error",
                    item.severity === 'success' && "bg-success"
                  )}></span>
                  <div>
                    <p className="text-body font-bold leading-tight">{item.title}</p>
                    <p className="text-label text-on-surface-variant mt-0.5">{item.timestamp}</p>
                    {item.description && (
                      <p className="text-label text-on-surface-variant mt-0.5 leading-snug">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer block */}
      <footer className="pt-xl pb-lg border-t border-outline-variant bg-slate-50 flex justify-between items-center text-on-surface-variant text-label">
        <p>© 2024 Bynd BD Travel Ops. All rights reserved.</p>
        <div className="flex gap-xl">
          <a className="hover:text-primary transition-colors font-bold" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors font-bold" href="#">System Status: 100%</a>
        </div>
      </footer>
    </div>
  );
}

export const dynamic = 'force-dynamic';
