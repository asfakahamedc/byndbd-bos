'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Phone,
  MessageSquare,
  AlertTriangle,
  Heart,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  X,
  Play,
  ChevronRight,
  LifeBuoy,
  UserCheck,
  AlertOctagon,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  location: string;
  status: 'Completed' | 'Active' | 'Upcoming';
  iconName: 'breakfast' | 'hike' | 'lunch' | 'camp';
}

interface Traveler {
  id: string;
  name: string;
  initials: string;
  status: 'Checked In' | 'Pending' | 'Mild Issue';
  vitalNotes?: string;
  medicalAlert?: string;
}

interface UpcomingTrip {
  id: string;
  title: string;
  dates: string;
  status: 'Ready' | 'Planning';
}

interface ActiveTrip {
  id: string;
  title: string;
  dayProgress: string;
  overallProgress: number;
  statusText: string;
  statusType: 'success' | 'warning' | 'critical';
  imageUrl: string;
}

// ============================================================================
// INITIAL MOCK DATA
// ============================================================================

const INITIAL_ACTIVE_TRIP: ActiveTrip = {
  id: 'BOS-TRIP-9921',
  title: 'Mountain Valley Adventure',
  dayProgress: 'Day 2 of 3',
  overallProgress: 65,
  statusText: 'All Good',
  statusType: 'success',
  imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf4ocBBsoIRDkjMT55rluxInsLT3b7mazEUXV_hwuju6YWfv75iDPudePyUAd8uTGZdo14dhMAWRRC_q2bMHnZz8TPigwtlMOO0bcTM9KIwDqgG-axBb4PJnAsOLkcKSqG8DQdnhWdo5nn-j-HwiGDdjK1uO0xE7LO87b9Xj2_WFzEBk_bfL62V8hVA3x41C2d925kd2R513QIUpJd24a3AWoHr-D9PwEpDXqngH0_9m3bTC43g5254BUEJZYo1QXrnqplxJPIMxZj'
};

const INITIAL_ITINERARY: ItineraryItem[] = [
  {
    id: 'it-1',
    time: '8:00 AM',
    title: 'Breakfast',
    location: 'Basecamp Lodge',
    status: 'Completed',
    iconName: 'breakfast'
  },
  {
    id: 'it-2',
    time: '9:30 AM',
    title: 'Ridge Hike',
    location: 'North Trail - 1,200ft',
    status: 'Active',
    iconName: 'hike'
  },
  {
    id: 'it-3',
    time: '12:30 PM',
    title: 'Summit Lunch',
    location: 'Pack Lunch Provided',
    status: 'Upcoming',
    iconName: 'lunch'
  },
  {
    id: 'it-4',
    time: '4:00 PM',
    title: 'Basecamp Return',
    location: 'Lodge Fireplace Room',
    status: 'Upcoming',
    iconName: 'camp'
  }
];

const INITIAL_TRAVELERS: Traveler[] = [
  {
    id: 't-1',
    name: 'Alex Johnson',
    initials: 'AJ',
    status: 'Checked In',
    vitalNotes: 'Dietary: Vegan'
  },
  {
    id: 't-2',
    name: 'Sarah Miller',
    initials: 'SM',
    status: 'Checked In',
    medicalAlert: 'Medical: Asthma inhaler'
  },
  {
    id: 't-3',
    name: 'Thomas Hill',
    initials: 'TH',
    status: 'Pending',
    vitalNotes: 'Dietary: Gluten Free'
  },
  {
    id: 't-4',
    name: 'Emma Watson',
    initials: 'EW',
    status: 'Checked In'
  },
  {
    id: 't-5',
    name: 'David Beck',
    initials: 'DB',
    status: 'Pending'
  },
  {
    id: 't-6',
    name: 'Jessica Alba',
    initials: 'JA',
    status: 'Checked In',
    medicalAlert: 'Medical: Bee allergy'
  }
];

const INITIAL_UPCOMING_TRIPS: UpcomingTrip[] = [
  {
    id: 'BOS-TRIP-9925',
    title: 'Sajek Valley Escape',
    dates: 'June 10 - June 12, 2024',
    status: 'Ready'
  },
  {
    id: 'BOS-TRIP-9930',
    title: 'Sundarbans Exploration',
    dates: 'June 25 - June 29, 2024',
    status: 'Planning'
  }
];

// ============================================================================
// MAIN HOST COMPONENT
// ============================================================================

export default function HostDashboard() {
  // State variables
  const [activeTrip, setActiveTrip] = useState<ActiveTrip>(INITIAL_ACTIVE_TRIP);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(INITIAL_ITINERARY);
  const [travelers, setTravelers] = useState<Traveler[]>(INITIAL_TRAVELERS);
  const [upcomingTrips] = useState<UpcomingTrip[]>(INITIAL_UPCOMING_TRIPS);
  const [activeTab, setActiveTab] = useState<'all' | 'trips' | 'active' | 'checklists'>('all');

  // Interactive check-in modal state
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  // Incident reporting modal state
  const [isIncidentOpen, setIsIncidentOpen] = useState(false);
  const [incidentTitle, setIncidentTitle] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [incidentSeverity, setIncidentSeverity] = useState<'warning' | 'critical' | 'neutral'>('warning');

  // Simulated communication modal state
  const [simulatedAction, setSimulatedAction] = useState<{ type: 'call' | 'msg'; target: string } | null>(null);

  // Emergency Call modal state
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  // Dynamic calculations
  const totalTravelersCount = travelers.length;
  const checkedInCount = travelers.filter(t => t.status === 'Checked In').length;

  // Handlers
  const handleToggleCheckIn = (travelerId: string) => {
    setTravelers(prev => prev.map(t => {
      if (t.id === travelerId) {
        return {
          ...t,
          status: t.status === 'Checked In' ? 'Pending' : 'Checked In'
        };
      }
      return t;
    }));
  };

  const handleMarkAllCheckedIn = () => {
    setTravelers(prev => prev.map(t => ({ ...t, status: 'Checked In' })));
    setIsCheckInOpen(false);
  };

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentTitle.trim()) return;

    // Update active trip state with incident status
    setActiveTrip(prev => ({
      ...prev,
      statusText: `${incidentSeverity === 'critical' ? '1 Critical issue' : '1 mild issue'}`,
      statusType: incidentSeverity === 'critical' ? 'critical' : 'warning'
    }));

    // If critical, trigger first traveler status to mild issue as sample
    if (incidentSeverity === 'critical' || incidentSeverity === 'warning') {
      setTravelers(prev => prev.map((t, idx) => idx === 0 ? { ...t, status: 'Mild Issue' } : t));
    }

    setIncidentTitle('');
    setIncidentDescription('');
    setIsIncidentOpen(false);
  };

  const handleItineraryItemClick = (id: string) => {
    // Toggle itinerary items completed/active/upcoming
    setItinerary(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Completed' ? 'Active' : item.status === 'Active' ? 'Upcoming' : 'Completed';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-[#f9f9ff] text-on-surface pb-[140px] relative min-h-screen">
      
      {/* Top Banner / Breadcrumb Header */}
      <div className="flex flex-col gap-1 pb-4 mb-4 border-b border-outline-variant">
        <nav className="flex items-center gap-2 text-on-surface-variant text-[11px] uppercase tracking-wider font-bold">
          <span>Coordinator Console</span>
          <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant" />
          <span className="text-primary">Host View</span>
        </nav>
        <h1 className="text-h2 font-h2 text-on-surface">Dashboard — Host</h1>
      </div>

      {/* Segmented Quick Filters */}
      <div className="flex bg-surface-container-low border border-outline-variant p-1 rounded-none mb-6">
        {(['all', 'trips', 'active', 'checklists'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 px-2 py-2 text-caption font-bold uppercase transition-all rounded-none min-h-[40px] flex items-center justify-center text-center",
              activeTab === tab
                ? "bg-primary text-on-primary font-bold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40"
            )}
          >
            {tab === 'all' ? 'All' : tab === 'trips' ? 'My Trips' : tab === 'active' ? 'Active Now' : 'Checklists'}
          </button>
        ))}
      </div>

      {/* SECTION 1: Active Trip Command Panel (🔴 ACTIVE NOW) */}
      <section className={cn(
        "mb-6 transition-all duration-300",
        activeTab === 'trips' && "hidden",
        activeTab === 'checklists' && "opacity-80"
      )}>
        <Card className="rounded-none border border-outline-variant bg-white overflow-hidden shadow-sm">
          {/* Active Trip Header Image */}
          <div className="relative h-40 overflow-hidden">
            <img 
              className="w-full h-full object-cover" 
              src={activeTrip.imageUrl} 
              alt={activeTrip.title}
            />
            <div className="absolute top-sm left-sm flex gap-xs">
              <span className="bg-error text-on-error px-2.5 py-1 rounded-none text-caption font-semibold active-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-none"></span> 🔴 ACTIVE NOW
              </span>
              <span className="bg-white/95 text-primary px-2.5 py-1 rounded-none text-caption font-semibold border border-primary/20">
                {activeTrip.dayProgress}
              </span>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-h3 text-h3 text-on-surface">{activeTrip.title}</h3>
                <p className="text-on-surface-variant text-label font-bold uppercase tracking-wider">{activeTrip.id}</p>
              </div>
              <Badge 
                variant={activeTrip.statusType === 'success' ? 'success' : 'critical'}
                className="rounded-none font-bold py-1 px-3 border"
              >
                {activeTrip.statusText === 'All Good' ? '🟢 ALL GOOD' : `⚠️ ${activeTrip.statusText}`}
              </Badge>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-label mb-1">
                <span className="text-on-surface-variant font-medium">Itinerary Progress</span>
                <span className="text-primary font-extrabold">{activeTrip.overallProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-none overflow-hidden border border-outline-variant/30">
                <div 
                  className="bg-primary h-full transition-all duration-300" 
                  style={{ width: `${activeTrip.overallProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Daily Check-In Command */}
            <div className="pt-2">
              <button 
                onClick={() => setIsCheckInOpen(true)}
                className="w-full min-h-[48px] bg-success text-white rounded-none font-h4 flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all font-bold uppercase tracking-wider shadow-sm border border-success/30"
              >
                <UserCheck className="w-5 h-5 text-white" />
                Daily Check-In
              </button>
            </div>
          </div>
        </Card>
      </section>

      {/* SECTION 2: Today's Itinerary (Checklist focus) */}
      <section className={cn(
        "mb-6 transition-all duration-300",
        activeTab === 'trips' && "hidden"
      )}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-h3 text-h3 text-on-surface">Today&apos;s Itinerary</h3>
          <button className="text-primary font-label hover:underline text-xs uppercase tracking-wider font-bold">
            [View Map]
          </button>
        </div>

        <div className="space-y-3">
          {itinerary.map((item) => {
            const isCompleted = item.status === 'Completed';
            const isActive = item.status === 'Active';
            return (
              <div 
                key={item.id}
                onClick={() => handleItineraryItemClick(item.id)}
                className={cn(
                  "p-4 border transition-all duration-150 cursor-pointer rounded-none flex items-center gap-4",
                  isCompleted 
                    ? "bg-slate-50 border-outline-variant/30 text-on-surface-variant opacity-75"
                    : isActive
                      ? "bg-white border-2 border-primary-container shadow-sm text-on-surface"
                      : "bg-white border-outline-variant text-on-surface opacity-90"
                )}
                title="Click to toggle status"
              >
                <div className="flex flex-col items-center shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  ) : isActive ? (
                    <Play className="w-6 h-6 text-primary fill-primary animate-pulse" />
                  ) : (
                    <Clock className="w-6 h-6 text-on-surface-variant/50" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <p className={cn(
                      "font-h4 text-[14px]",
                      isCompleted && "line-through text-on-surface-variant/60 font-medium",
                      isActive && "text-primary font-bold"
                    )}>
                      {item.time} {item.title}
                    </p>
                    {isActive && (
                      <Badge variant="primary" className="rounded-none py-0 px-2 text-[9px] uppercase font-bold tracking-wide">
                        NOW
                      </Badge>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] text-success font-bold uppercase tracking-wider">
                        DONE
                      </span>
                    )}
                  </div>
                  <p className="text-label text-on-surface-variant mt-0.5 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-on-surface-variant/60" />
                    {item.location}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Group Capacity Summary */}
      <section className={cn(
        "mb-6 transition-all duration-300",
        activeTab === 'trips' && "hidden"
      )}>
        <Card className="bg-inverse-surface text-white p-4 rounded-none shadow-md border-b-2 border-black flex justify-between items-center">
          <div>
            <h4 className="font-h4 text-sm font-bold uppercase tracking-wider text-slate-300">Group Capacity</h4>
            <p className="text-xs text-primary-fixed-dim mt-0.5 font-bold">
              {checkedInCount} of {totalTravelersCount} Accounted
            </p>
          </div>
          <button 
            onClick={() => setIsCheckInOpen(true)}
            className="bg-primary text-white border border-primary/40 px-4 min-h-[48px] rounded-none text-label font-bold uppercase tracking-wider hover:bg-primary/95"
          >
            Manifest
          </button>
        </Card>
      </section>

      {/* SECTION 3: Traveler Information */}
      <section className={cn(
        "mb-6 transition-all duration-300",
        activeTab === 'trips' && "hidden"
      )}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-h3 text-h3 text-on-surface font-bold">Traveler Status</h3>
          <div className="flex gap-2">
            <button className="text-primary hover:underline text-caption font-bold uppercase tracking-wider px-2 py-1 border border-outline-variant/30 hover:bg-slate-50">
              [Full List]
            </button>
            <button className="text-error hover:underline text-caption font-bold uppercase tracking-wider px-2 py-1 border border-error/20 hover:bg-error/5">
              [Medical Summary]
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {travelers.map((traveler) => (
            <div 
              key={traveler.id} 
              className="flex items-center gap-4 p-3 bg-white rounded-none border border-outline-variant h-20 shadow-xs"
            >
              {/* Initials avatar wrapper */}
              <div className="w-11 h-11 bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm rounded-none shrink-0">
                {traveler.initials}
              </div>

              {/* Status and Notes */}
              <div className="flex-1 min-w-0">
                <p className="font-h4 text-[14px] text-on-surface truncate font-bold">{traveler.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={cn(
                    "w-2 h-2 rounded-none",
                    traveler.status === 'Checked In' && "bg-[#10B981]",
                    traveler.status === 'Pending' && "bg-yellow-500",
                    traveler.status === 'Mild Issue' && "bg-error"
                  )}></span>
                  <span className="text-label text-on-surface-variant font-medium">
                    {traveler.status}
                  </span>
                </div>
                
                {/* Notes and alerts indicators */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {traveler.vitalNotes && (
                    <span className="text-[10px] bg-slate-100 text-on-surface border border-outline-variant px-1.5 py-0.2 rounded-none font-bold uppercase">
                      {traveler.vitalNotes}
                    </span>
                  )}
                  {traveler.medicalAlert && (
                    <span className="text-[10px] bg-error-container text-error border border-error/20 px-1.5 py-0.2 rounded-none font-bold uppercase flex items-center gap-1">
                      <Heart className="w-2.5 h-2.5 text-error fill-error" />
                      {traveler.medicalAlert}
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Communication Actions (min-h-48 targets) */}
              <div className="flex gap-1 shrink-0">
                <button 
                  onClick={() => setSimulatedAction({ type: 'call', target: traveler.name })}
                  className="w-12 min-h-[48px] bg-slate-100 border border-outline-variant rounded-none text-primary hover:bg-slate-200 flex items-center justify-center"
                  title={`Call ${traveler.name}`}
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setSimulatedAction({ type: 'msg', target: traveler.name })}
                  className="w-12 min-h-[48px] bg-slate-100 border border-outline-variant rounded-none text-primary hover:bg-slate-200 flex items-center justify-center"
                  title={`Message ${traveler.name}`}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Upcoming Trips */}
      <section className={cn(
        "mb-6 transition-all duration-300",
        activeTab === 'active' || activeTab === 'checklists' ? "hidden" : ""
      )}>
        <h3 className="font-h3 text-h3 text-on-surface mb-3 font-bold">Upcoming Trips</h3>
        <div className="space-y-3">
          {upcomingTrips.map((trip) => (
            <Card key={trip.id} className="p-4 border border-outline-variant bg-white rounded-none">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-h4 text-[14px] text-on-surface font-bold">{trip.title}</h4>
                  <p className="text-label text-on-surface-variant font-medium mt-0.5">{trip.id}</p>
                  <p className="text-label text-on-surface-variant font-normal mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
                    {trip.dates}
                  </p>
                </div>
                <Badge 
                  variant={trip.status === 'Ready' ? 'success' : 'neutral'}
                  className="rounded-none font-bold py-0.5 px-2 border"
                >
                  {trip.status}
                </Badge>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/60 flex justify-end gap-3 text-label">
                <button className="text-primary hover:underline font-bold">[View Details]</button>
                <button className="text-on-surface-variant hover:underline font-bold">[Checklists]</button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SECTION 5: Floating Action Widget & Incident Report */}
      <section className="mt-8 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setIsIncidentOpen(true)}
            className="min-h-[48px] bg-error-container text-error border border-error/20 rounded-none font-h4 flex items-center justify-center gap-2 hover:bg-error/10 active:scale-[0.98] transition-all font-bold uppercase tracking-wider"
          >
            <AlertTriangle className="w-4 h-4 text-error" />
            Report Issue
          </button>
          
          <button 
            onClick={() => setSimulatedAction({ type: 'call', target: 'Operations Support Team' })}
            className="min-h-[48px] bg-slate-100 text-on-surface-variant border border-outline-variant rounded-none font-h4 flex items-center justify-center gap-2 hover:bg-slate-200 active:scale-[0.98] transition-all font-bold uppercase tracking-wider"
          >
            <LifeBuoy className="w-4 h-4 text-on-surface-variant" />
            Support
          </button>
        </div>
      </section>

      {/* Emergency Sticky Button (fixed at bottom above tab menu) */}
      <div className="fixed bottom-[80px] left-0 right-0 px-4 pb-3 z-30 pointer-events-none">
        <button 
          onClick={() => setIsEmergencyOpen(true)}
          className="w-full bg-error text-on-error min-h-[48px] h-14 rounded-none font-h3 flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-error/30 pointer-events-auto border-2 border-black uppercase tracking-wider font-extrabold"
        >
          <AlertOctagon className="w-5 h-5 text-white" />
          Emergency Call
        </button>
      </div>

      {/* ============================================================================
          MODAL INTERACTIVE OVERLAYS
          ============================================================================ */}

      {/* Modal 1: Daily Check-In Checklist */}
      {isCheckInOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-black rounded-none shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-success text-white px-5 py-3.5 flex justify-between items-center border-b-2 border-black">
              <h3 className="font-h3 text-h3 flex items-center gap-2 font-bold uppercase tracking-wide">
                <UserCheck className="w-5 h-5" />
                Daily Checklist
              </h3>
              <button 
                onClick={() => setIsCheckInOpen(false)}
                className="text-white hover:text-slate-100 p-1 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4 max-h-[300px] overflow-y-auto">
              <p className="text-xs text-on-surface-variant font-medium">Check off travelers as they account for today&apos;s Ridge Hike:</p>
              <div className="space-y-2.5">
                {travelers.map((t) => (
                  <div 
                    key={t.id}
                    onClick={() => handleToggleCheckIn(t.id)}
                    className="flex items-center justify-between p-3 border border-outline-variant bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-bold text-sm text-on-surface">{t.name}</span>
                    <div className={cn(
                      "w-6 h-6 border flex items-center justify-center rounded-none font-bold",
                      t.status === 'Checked In' 
                        ? "bg-success border-success text-white" 
                        : "bg-white border-outline-variant text-transparent"
                    )}>
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-outline-variant bg-slate-50 flex gap-2">
              <button
                onClick={handleMarkAllCheckedIn}
                className="flex-1 bg-primary text-on-primary font-bold min-h-[48px] text-xs uppercase tracking-wider rounded-none hover:brightness-105"
              >
                Mark All Checked In
              </button>
              <button
                onClick={() => setIsCheckInOpen(false)}
                className="px-4 border border-outline-variant text-on-surface-variant font-bold min-h-[48px] text-xs uppercase tracking-wider rounded-none hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Incident Report Form */}
      {isIncidentOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-black rounded-none shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-error text-on-error px-5 py-3.5 flex justify-between items-center border-b-2 border-black">
              <h3 className="font-h3 text-h3 flex items-center gap-2 font-bold uppercase tracking-wide">
                <AlertTriangle className="w-5 h-5" />
                Report Incident
              </h3>
              <button 
                onClick={() => setIsIncidentOpen(false)}
                className="text-on-error hover:text-slate-100 p-1 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleReportIncident} className="p-5 space-y-4">
              <div>
                <label className="block text-caption uppercase font-bold text-on-surface mb-1">
                  Issue Summary *
                </label>
                <input
                  type="text"
                  required
                  value={incidentTitle}
                  onChange={(e) => setIncidentTitle(e.target.value)}
                  placeholder="e.g. Minor ankle sprain / Delayed driver"
                  className="w-full px-3 py-2 border border-outline-variant text-body focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-none bg-surface-container-low text-on-surface"
                />
              </div>

              <div>
                <label className="block text-caption uppercase font-bold text-on-surface mb-1">
                  Severity Level
                </label>
                <select
                  value={incidentSeverity}
                  onChange={(e) => setIncidentSeverity(e.target.value as 'warning' | 'critical' | 'neutral')}
                  className="w-full px-3 py-2 border border-outline-variant text-body focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-none bg-surface-container-low text-on-surface"
                >
                  <option value="warning">🟠 Warning (Minor/Mild)</option>
                  <option value="critical">🔴 Critical (Action Required)</option>
                  <option value="neutral">⚪ Info Only</option>
                </select>
              </div>

              <div>
                <label className="block text-caption uppercase font-bold text-on-surface mb-1">
                  Description Details
                </label>
                <textarea
                  rows={3}
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  placeholder="Provide immediate context and current traveler condition..."
                  className="w-full px-3 py-2 border border-outline-variant text-body focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-none bg-surface-container-low text-on-surface"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsIncidentOpen(false)}
                  className="flex-1 border border-outline-variant text-on-surface-variant font-bold min-h-[48px] text-xs uppercase tracking-wider rounded-none hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-error text-on-error font-bold min-h-[48px] text-xs uppercase tracking-wider rounded-none hover:bg-error/95"
                >
                  Log Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Simulated Call/Message alert */}
      {simulatedAction && (
        <div className="fixed bottom-[150px] left-4 right-4 bg-inverse-surface border border-outline-variant p-4 text-white flex justify-between items-center shadow-2xl z-50 border-l-4 border-l-primary rounded-none">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            {simulatedAction.type === 'call' ? (
              <Phone className="w-4 h-4 text-primary" />
            ) : (
              <MessageSquare className="w-4 h-4 text-primary" />
            )}
            <span>Simulating {simulatedAction.type} with: {simulatedAction.target}</span>
          </div>
          <button 
            onClick={() => setSimulatedAction(null)}
            className="text-xs font-extrabold uppercase hover:underline text-primary"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Modal 4: Emergency Call Confirmation */}
      {isEmergencyOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-black rounded-none shadow-2xl w-full max-w-sm overflow-hidden border-t-8 border-t-error">
            <div className="p-6 space-y-4 text-center">
              <div className="w-16 h-16 bg-error/15 border-2 border-error text-error flex items-center justify-center rounded-none mx-auto mb-2">
                <AlertOctagon className="w-8 h-8" />
              </div>
              <h3 className="font-h3 text-h3 text-error uppercase font-extrabold">Confirm Emergency</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                This will simulate placing a priority hotline call to Basecamp Operations Rescue Team and notify the duty officer.
              </p>
            </div>
            
            <div className="p-4 border-t border-outline-variant bg-slate-50 flex gap-2">
              <button
                onClick={() => {
                  setIsEmergencyOpen(false);
                  setSimulatedAction({ type: 'call', target: 'Basecamp operations Emergency Response Team' });
                }}
                className="flex-1 bg-error text-on-error font-bold min-h-[48px] text-xs uppercase tracking-wider rounded-none hover:bg-error/95"
              >
                Call Hotline
              </button>
              <button
                onClick={() => setIsEmergencyOpen(false)}
                className="flex-1 border border-outline-variant text-on-surface-variant font-bold min-h-[48px] text-xs uppercase tracking-wider rounded-none hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const dynamic = 'force-dynamic';
