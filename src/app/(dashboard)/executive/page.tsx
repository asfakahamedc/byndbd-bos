'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Calendar,
  Check,
  MoreHorizontal,
  MessageSquare,
  Send,
  Plus,
  ChevronRight,
  Filter,
  Download,
  AlertCircle,
  X,
  FileText,
  MessageCircle,
  HelpCircle,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timeRemaining: string;
  assignedDate: string;
  progress: number;
  status: string;
  avatars: string[];
}

interface Deadline {
  id: string;
  day: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
  timeInfo: string;
}

interface Reply {
  id: string;
  author: string;
  avatarUrl?: string;
  timeAgo: string;
  content: string;
}

interface Mention {
  id: string;
  author: string;
  avatarUrl: string;
  timeAgo: string;
  project: string;
  content: string;
  replies: Reply[];
}

// ============================================================================
// INITIAL MOCK DATA
// ============================================================================

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Q2 Campaign Copy',
    description: 'Finalize primary copy assets for the upcoming international destination launch. Ensure brand voice alignment.',
    priority: 'critical',
    timeRemaining: '2 hours left',
    assignedDate: 'Monday, Dec 16, 2024',
    progress: 60,
    status: 'In Progress — 60% complete',
    avatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAFzWYzTwTQ_7_wrM5BDXutvAaABaFH84NqRO2vpVVhd3C7aFgY9tErMmi7pR_LjPY6LlKCpqL4n32FPQMGakA6LJxRQ-6iPrVguSUfpBfAql_OCLcZjCiIw57K7vogGAqRxmAE33uBniT50Nsudu26WRQugf3XQH21IAk9JAqbCU5SpOsPKudMcsqJKMUxHMIVJARjLW6t08K_0xKYH-LWqwuPbyLgLQGmosWlEhDM0VKfczSU53nGEyQvlJP3ZRSVAzpY2H-xI3xs',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCHLBixhuJFiMGQl0zwqU5XgyGeAVeQZszhBjKoa0JGK-wiHav-I3fH3l_xQVLMUPV03MuDFT1Uja7sfHQIlEGMDMM3WRBV0JVdRFYm39FW0TXBkdbw5apZZklHptfYy3rsVPSv9yOgM2ejm3QeCSpJJsKJfaOcV08jS5LhOyy7z6jkX-AgL7ZOKgE9LMonl8hT3tztWp14LB08AGQnbZz_Tgn22jv8MbG5qwjNYsnj1N0k1vghiogSf6o2wpH0t9YnvJZQrIvJwGyE'
    ]
  },
  {
    id: 'task-2',
    title: 'Review Destination Guide Draft',
    description: 'Check content completeness, tone accuracy, and layout structure of the new Sundarbans travel guide.',
    priority: 'high',
    timeRemaining: '1 day left',
    assignedDate: 'Monday, Dec 16, 2024',
    progress: 0,
    status: 'Not Started',
    avatars: []
  },
  {
    id: 'task-3',
    title: 'Social Media Calendar Update',
    description: 'Plan post topics, copy, and visual asset requirements for next week across all social platforms.',
    priority: 'medium',
    timeRemaining: '3 days left',
    assignedDate: 'Sunday, Dec 15, 2024',
    progress: 0,
    status: 'Not Started',
    avatars: []
  }
];

const INITIAL_DEADLINES: Deadline[] = [
  {
    id: 'dl-1',
    day: 'Monday',
    title: 'Weekly Sync & Reporting',
    status: 'Completed',
    timeInfo: 'Completed at 9:30 AM'
  },
  {
    id: 'dl-2',
    day: 'Tuesday',
    title: 'Campaign Launch Prep',
    status: 'In Progress',
    timeInfo: 'In Progress'
  },
  {
    id: 'dl-3',
    day: 'Thursday',
    title: 'Client Review Meeting',
    status: 'Not Started',
    timeInfo: 'Due in 2 days'
  },
  {
    id: 'dl-4',
    day: 'Friday',
    title: 'Content Assets Handoff',
    status: 'Not Started',
    timeInfo: 'Due in 3 days'
  },
  {
    id: 'dl-5',
    day: 'Sunday',
    title: 'Weekly Performance Review',
    status: 'Not Started',
    timeInfo: 'Due in 5 days'
  }
];

const INITIAL_MENTIONS: Mention[] = [
  {
    id: 'm-1',
    author: 'Sarah',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyPPLHdPOPP7wbUDMU5gs_EI2nPZ3NGzacMZT8zapFg4vIrIalxx3x8b1MAMim6oJJijFriSZ1Wta6AtTDo2wD07SA3IZ-dqwmYAH3E88f-EkZ3tG53OZu5AcM5t_q5Kw4Dr6qgfb4KOtWHpqeiOxHF6K8nys1djj_E66Uzu10Wmrbakzzw3smFqBskKiou2zpvRhYmXiJIYme4eu7dJm2Kya32IcxJs2GolZFVSGYTzaWxtfnnjejwP7oydMCAytjbks2Uh0D-Bx4',
    timeAgo: '2m ago',
    project: 'Q2 Campaign Brief',
    content: '@Rahat, can you double-check the KPIs on page 4?',
    replies: []
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ExecutiveDashboard() {
  // State Hooks
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [deadlines, setDeadlines] = useState<Deadline[]>(INITIAL_DEADLINES);
  const [mentions, setMentions] = useState<Mention[]>(INITIAL_MENTIONS);
  const [activeFilter, setActiveFilter] = useState<'tasks' | 'deadlines' | 'updates' | 'all'>('all');
  
  // Interactive Reply Form State
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  // Full Discussion Modal State
  const [activeDiscussionId, setActiveDiscussionId] = useState<string | null>(null);

  // New Task Dialog State (FAB trigger)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'critical' | 'high' | 'medium' | 'low'>('medium');
  const [newTaskTime, setNewTaskTime] = useState('1 day left');

  // Priority badge styling helpers
  const priorityInfo = {
    critical: { label: '🔴 CRITICAL', class: 'bg-error/10 text-error border-error/20' },
    high: { label: '🟠 HIGH', class: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    medium: { label: '🟡 MEDIUM', class: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
    low: { label: '🟢 LOW', class: 'bg-success/10 text-success border-success/20' }
  };

  // Sorting Priority helper
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedTasks = [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Metric Calculation
  const totalDeadlines = deadlines.length;
  const completedDeadlines = deadlines.filter(d => d.status === 'Completed').length;
  const deadlineCompletionRate = totalDeadlines > 0 ? Math.round((completedDeadlines / totalDeadlines) * 100) : 0;

  // Handler functions
  const handleMarkAsDone = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, progress: 100, status: 'Completed' } : t));
  };

  const handleStartTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, progress: 20, status: 'In Progress — 20% complete' } : t));
  };

  const toggleDeadline = (dlId: string) => {
    setDeadlines(prev => prev.map(d => {
      if (d.id === dlId) {
        let nextStatus: Deadline['status'];
        let nextTime: string;
        if (d.status === 'Completed') {
          nextStatus = 'Not Started';
          nextTime = 'Not started';
        } else if (d.status === 'Not Started') {
          nextStatus = 'In Progress';
          nextTime = 'In Progress';
        } else {
          nextStatus = 'Completed';
          nextTime = `Completed at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        return { ...d, status: nextStatus, timeInfo: nextTime };
      }
      return d;
    }));
  };

  const handleSendReply = (mentionId: string) => {
    if (!replyText.trim()) return;

    setMentions(prev => prev.map(m => {
      if (m.id === mentionId) {
        return {
          ...m,
          replies: [
            ...m.replies,
            {
              id: `r-${Date.now()}`,
              author: 'Rahat Ahmed',
              avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoNkAGYm4XeDlf6w9stjoLeFpWzaUxJD-kGgu_tGEqHOc6c9AvqTTLRXOTS1_5CtwNlQ0zpIlwReOfhttLdntFPtX83jLlEUFORGeAP1QtByR2ThRMUBergwH3K-FOeBXNd_MDebUtrALOwVG0HZSkqv1e9gVX0rngMUfzUZHA62Ci9Kqur3j0KfYo8eHiUBAoqMAG7lE9JjGJrfCIEaRV6bdf0A9aXMV9HZue-1xdYAgMbJ9M4WUsyKc7FPwN02NLP1NAW0YBVB3l',
              timeAgo: 'Just now',
              content: replyText
            }
          ]
        };
      }
      return m;
    }));

    setReplyText('');
    setReplyToId(null);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc || 'No details provided.',
      priority: newTaskPriority,
      timeRemaining: newTaskTime,
      assignedDate: 'Monday, Dec 16, 2024',
      progress: 0,
      status: 'Not Started',
      avatars: []
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setIsTaskModalOpen(false);
  };

  return (
    <div className="space-y-lg relative">
      {/* 1. Dashboard Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-md pb-lg border-b border-outline-variant">
        <div>
          <nav className="flex items-center gap-2 text-on-surface-variant text-label mb-2">
            <span>Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary font-semibold">Executive</span>
          </nav>
          <h1 className="text-h1 font-h1 text-on-surface">Good morning, Rahat Ahmed</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-on-surface-variant font-body flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-on-surface-variant" />
              Monday, December 16, 2024
            </p>
            <div className="w-1.5 h-1.5 bg-outline-variant rounded-none"></div>
            <p className="text-primary font-h4 text-[14px] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              {tasks.filter(t => t.progress < 100).length} tasks due today
            </p>
          </div>
        </div>

        {/* Filters control block */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-surface-container-low border border-outline-variant p-1 rounded-none">
            {(['all', 'tasks', 'deadlines', 'updates'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={cn(
                  "px-3 py-1.5 text-label font-bold uppercase transition-colors rounded-none",
                  activeFilter === tab
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50"
                )}
              >
                {tab === 'all' ? 'All' : tab === 'tasks' ? 'My Tasks' : tab === 'deadlines' ? 'My Deadlines' : 'Team Updates'}
              </button>
            ))}
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-none font-h4 text-[14px] bg-white hover:bg-surface-container transition-colors">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </header>

      {/* 2. Grid Content Layout */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Column 1: Tasks Today */}
        <section
          className={cn(
            "col-span-12 space-y-6 transition-all duration-300",
            (activeFilter === 'all') ? "lg:col-span-8" : "",
            (activeFilter === 'tasks') ? "lg:col-span-12" : "",
            (activeFilter === 'deadlines' || activeFilter === 'updates') ? "hidden" : ""
          )}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-h2 font-h2 text-on-surface">My Tasks Today</h2>
            <button className="text-primary font-h4 text-[14px] hover:underline uppercase tracking-wide">
              View All Tasks
            </button>
          </div>

          <div className="space-y-4">
            {sortedTasks.map((task) => (
              <Card 
                key={task.id} 
                className={cn(
                  "p-6 relative overflow-hidden transition-all duration-200 border-l-4 border-y border-r border-outline-variant",
                  task.priority === 'critical' && "border-l-error hover:shadow-md",
                  task.priority === 'high' && "border-l-orange-500 hover:shadow-md",
                  task.priority === 'medium' && "border-l-yellow-500 opacity-90 hover:opacity-100 hover:shadow-md",
                  task.priority === 'low' && "border-l-success opacity-85 hover:opacity-100 hover:shadow-md",
                  task.progress === 100 && "opacity-60 hover:opacity-80"
                )}
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center flex-wrap gap-3">
                      <Badge 
                        variant="neutral" 
                        className={cn("rounded-none border px-2 py-0.5", priorityInfo[task.priority].class)}
                      >
                        {priorityInfo[task.priority].label}
                      </Badge>
                      
                      <span className="text-label text-on-surface-variant flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-on-surface-variant" />
                        {task.timeRemaining}
                      </span>
                      
                      <span className="text-label text-on-surface-variant flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
                        {task.assignedDate}
                      </span>
                    </div>

                    <h3 className="text-h3 font-h3 text-on-surface">{task.title}</h3>
                    <p className="text-on-surface-variant text-body max-w-2xl">{task.description}</p>
                    
                    {/* Status badge representation */}
                    <div className="text-label font-bold text-primary mt-1">
                      Status: [{task.status}]
                    </div>
                  </div>

                  <div className="flex items-start gap-2 self-start md:self-auto">
                    {task.progress === 0 ? (
                      <button 
                        onClick={() => handleStartTask(task.id)}
                        className="px-6 py-2 border border-primary text-primary hover:bg-primary/5 rounded-none font-h4 text-[13px] transition-all font-bold uppercase tracking-wider"
                      >
                        Start
                      </button>
                    ) : task.progress < 100 ? (
                      <button 
                        onClick={() => handleMarkAsDone(task.id)}
                        className="px-4 py-2 bg-primary text-on-primary rounded-none font-h4 text-[13px] hover:brightness-110 font-bold uppercase tracking-wider transition-all"
                      >
                        Mark as Done
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-success font-bold text-label bg-success/5 border border-success/15 px-3 py-2">
                        <Check className="w-4 h-4" />
                        Completed
                      </div>
                    )}
                    
                    <button className="p-2 border border-outline-variant rounded-none hover:bg-surface-container transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-on-surface-variant" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Teammates */}
                {task.progress > 0 && (
                  <div className="mt-6 pt-6 border-t border-outline-variant flex items-center gap-6">
                    <div className="flex-1">
                      <div className="flex justify-between text-label mb-2">
                        <span className="text-on-surface-variant font-medium">Progress</span>
                        <span className="text-on-surface font-bold">{task.progress}%</span>
                      </div>
                      <div className="h-2 bg-surface-container rounded-none overflow-hidden border border-outline-variant/30">
                        <div 
                          className="h-full bg-primary transition-all duration-300" 
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {task.avatars && task.avatars.length > 0 && (
                      <div className="flex -space-x-2 shrink-0">
                        {task.avatars.map((url, idx) => (
                          <img 
                            key={idx} 
                            className="w-8 h-8 rounded-none border border-white object-cover" 
                            src={url} 
                            alt="Teammate avatar" 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-4 flex gap-3 text-label">
                  <button className="text-primary hover:underline font-bold">[View Details]</button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Column 2: Deadlines & Communications */}
        <aside
          className={cn(
            "col-span-12 space-y-8 transition-all duration-300",
            (activeFilter === 'all') ? "lg:col-span-4" : "",
            (activeFilter === 'deadlines' || activeFilter === 'updates') ? "lg:col-span-12" : "",
            (activeFilter === 'tasks') ? "hidden" : ""
          )}
        >
          {/* Section: This Week Deadlines */}
          <section className={cn(
            "space-y-4",
            activeFilter === 'updates' ? "hidden" : ""
          )}>
            <Card className="bg-white rounded-none border border-outline-variant overflow-hidden">
              <div className="p-6 border-b border-outline-variant flex items-center justify-between">
                <h2 className="font-h4 text-h4 text-on-surface">This Week Deadlines</h2>
                <span className="text-primary font-bold text-h4 bg-primary/5 px-2.5 py-1 border border-primary/10">
                  {deadlineCompletionRate}% Done
                </span>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {deadlines.map((dl) => (
                    <div 
                      key={dl.id} 
                      className="flex gap-4 cursor-pointer group"
                      onClick={() => toggleDeadline(dl.id)}
                      title="Click to toggle status"
                    >
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-8 h-8 rounded-none flex items-center justify-center border transition-all duration-200",
                          dl.status === 'Completed' 
                            ? "bg-success/15 border-success text-success" 
                            : dl.status === 'In Progress'
                              ? "bg-orange-500 border-orange-600 text-white"
                              : "bg-slate-100 border-outline-variant text-on-surface-variant group-hover:border-primary"
                        )}>
                          {dl.status === 'Completed' ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : dl.status === 'In Progress' ? (
                            <div className="w-2.5 h-2.5 rounded-none bg-white animate-pulse"></div>
                          ) : (
                            <div className="w-2 h-2 rounded-none bg-transparent"></div>
                          )}
                        </div>
                        <div className="w-0.5 h-full bg-outline-variant/50 mt-2"></div>
                      </div>

                      <div className="pb-4 flex-1">
                        <p className={cn(
                          "text-label uppercase font-bold",
                          dl.status === 'Completed' && "text-success",
                          dl.status === 'In Progress' && "text-orange-600",
                          dl.status === 'Not Started' && "text-on-surface-variant"
                        )}>
                          {dl.day}
                        </p>
                        <p className={cn(
                          "text-h4 text-[14px] mt-1 font-bold",
                          dl.status === 'Completed' && "line-through text-on-surface-variant/70"
                        )}>
                          {dl.title}
                        </p>
                        <p className="text-label text-on-surface-variant font-normal mt-1 italic">
                          {dl.timeInfo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </section>

          {/* Section: Comments & Mentions */}
          <section className={cn(
            "space-y-4",
            activeFilter === 'deadlines' ? "hidden" : ""
          )}>
            <div className="flex items-center justify-between px-1">
              <h2 className="font-h4 text-h4 text-on-surface">Comments &amp; Mentions</h2>
              <button className="text-label text-on-surface-variant hover:underline font-bold">
                Clear All
              </button>
            </div>

            <div className="space-y-4">
              {mentions.map((mention) => (
                <div 
                  key={mention.id} 
                  className="bg-white border border-outline-variant rounded-none p-4 hover:border-primary/30 transition-colors shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    {mention.avatarUrl ? (
                      <img 
                        className="w-10 h-10 rounded-none bg-outline-variant object-cover border border-outline-variant" 
                        src={mention.avatarUrl} 
                        alt={mention.author}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs rounded-none">
                        {mention.author[0]}
                      </div>
                    )}
                    
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-start">
                        <p className="text-body font-bold text-on-surface">
                          {mention.author} <span className="font-normal text-on-surface-variant">mentioned you</span>
                        </p>
                        <span className="text-label text-on-surface-variant font-normal">{mention.timeAgo}</span>
                      </div>
                      
                      <p className="text-primary font-h4 text-[13px] truncate mt-0.5 font-bold">
                        {mention.project}
                      </p>
                      
                      <p className="text-on-surface-variant text-label font-normal mt-2 italic leading-relaxed bg-slate-50 p-2 border-l-2 border-primary/30">
                        {mention.content}
                      </p>

                      {/* Display replies */}
                      {mention.replies && mention.replies.length > 0 && (
                        <div className="mt-3 pl-4 border-l border-outline-variant/60 space-y-3">
                          {mention.replies.map((rep) => (
                            <div key={rep.id} className="text-xs bg-slate-50/50 p-2 border-l border-primary/20">
                              <p className="font-bold text-on-surface">
                                {rep.author} <span className="font-normal text-on-surface-variant">({rep.timeAgo})</span>
                              </p>
                              <p className="text-on-surface-variant mt-1 font-medium">{rep.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Form Trigger & Form */}
                      <div className="flex flex-col gap-2 mt-3">
                        {replyToId === mention.id ? (
                          <div className="flex flex-col gap-2 bg-slate-50 p-2 border border-outline-variant/40">
                            <textarea
                              rows={2}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a response..."
                              className="w-full text-xs p-2 bg-white border border-outline-variant focus:outline-none focus:ring-1 focus:ring-primary rounded-none text-on-surface"
                            />
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => setReplyToId(null)}
                                className="px-2 py-1 text-[11px] text-on-surface-variant hover:underline font-bold uppercase"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={() => handleSendReply(mention.id)}
                                className="px-3 py-1 bg-primary text-on-primary font-bold text-[11px] hover:bg-primary/90 rounded-none flex items-center gap-1 uppercase tracking-wider"
                              >
                                <Send className="w-3 h-3" />
                                Send
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-4">
                            <button 
                              onClick={() => {
                                setReplyToId(mention.id);
                                setReplyText('');
                              }}
                              className="text-primary text-label font-bold hover:underline"
                            >
                              [Reply]
                            </button>
                            <button 
                              onClick={() => setActiveDiscussionId(mention.id)}
                              className="text-on-surface-variant text-label font-bold hover:underline"
                            >
                              [View Full Discussion]
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button className="w-full py-3 text-on-surface-variant text-label border border-dashed border-outline-variant rounded-none hover:bg-surface-container transition-colors font-bold uppercase tracking-wide">
                View History
              </button>
            </div>
          </section>
        </aside>
      </div>

      {/* 3. Brutalist FAB (Floating Action Button) */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setIsTaskModalOpen(true)}
          className="w-14 h-14 bg-primary text-on-primary rounded-none shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group border-2 border-black"
          title="Create New Task"
        >
          <Plus className="w-7 h-7 text-white" />
        </button>
      </div>

      {/* 4. Modals / Interactive Overlays (Brutalist style) */}
      
      {/* New Task Overlay */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border-2 border-black rounded-none shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-primary text-on-primary px-6 py-4 flex justify-between items-center border-b-2 border-black">
              <h3 className="font-h3 text-h3 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                CREATE NEW TASK
              </h3>
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                className="text-on-primary hover:text-white p-1 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-label uppercase font-bold text-on-surface mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Publish Marketing Material"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant text-body focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-none text-on-surface"
                />
              </div>

              <div>
                <label className="block text-label uppercase font-bold text-on-surface mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Provide context or constraints..."
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant text-body focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-none text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label uppercase font-bold text-on-surface mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant text-body focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-none text-on-surface"
                  >
                    <option value="critical">🔴 Critical</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label uppercase font-bold text-on-surface mb-1">
                    Time Remaining
                  </label>
                  <input
                    type="text"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    placeholder="e.g. 5 hours left"
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant text-body focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-none text-on-surface"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant text-on-surface hover:bg-slate-50 font-bold rounded-none text-label uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary hover:bg-primary/90 font-bold rounded-none text-label uppercase tracking-wider"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discussion History Modal */}
      {activeDiscussionId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-black rounded-none shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="bg-primary text-on-primary px-6 py-4 flex justify-between items-center border-b-2 border-black">
              <h3 className="font-h3 text-h3 uppercase tracking-wider flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Discussion Thread
              </h3>
              <button 
                onClick={() => setActiveDiscussionId(null)}
                className="text-on-primary hover:text-white p-1 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
              {mentions.filter(m => m.id === activeDiscussionId).map(m => (
                <div key={m.id} className="space-y-4">
                  <div className="flex items-start gap-3 bg-slate-50 p-4 border border-outline-variant">
                    <img 
                      className="w-10 h-10 rounded-none bg-outline-variant object-cover"
                      src={m.avatarUrl}
                      alt={m.author}
                    />
                    <div>
                      <p className="font-bold text-on-surface">{m.author} <span className="font-normal text-on-surface-variant">initiated the thread</span></p>
                      <p className="text-label text-primary font-bold mt-0.5">{m.project}</p>
                      <p className="text-on-surface mt-2 text-body italic bg-white p-2 border-l-2 border-primary">{m.content}</p>
                    </div>
                  </div>

                  {m.replies.length === 0 ? (
                    <p className="text-xs text-on-surface-variant italic text-center py-4">No replies yet. Use the reply tool on the main view to start.</p>
                  ) : (
                    <div className="space-y-3 pl-6 border-l-2 border-outline-variant">
                      <p className="text-[10px] uppercase font-bold text-on-surface-variant">Replies</p>
                      {m.replies.map(r => (
                        <div key={r.id} className="bg-slate-50/50 p-3 border border-outline-variant/60">
                          <p className="font-bold text-xs">{r.author} <span className="font-normal text-on-surface-variant">({r.timeAgo})</span></p>
                          <p className="text-on-surface-variant mt-1 text-xs">{r.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-outline-variant bg-slate-50 flex justify-end">
              <button
                onClick={() => setActiveDiscussionId(null)}
                className="px-5 py-2 bg-primary text-on-primary hover:bg-primary/90 font-bold rounded-none text-label uppercase tracking-wider"
              >
                Close Thread
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
