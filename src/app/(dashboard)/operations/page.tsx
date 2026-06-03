'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface TeamTask {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  timeLeft: string;
  status: 'overdue' | 'due_today' | 'upcoming' | 'completed';
}

interface ApprovalRequest {
  id: string;
  requesterName: string;
  requesterAvatar: string;
  title: string;
  timeMeta: string;
  type: 'document' | 'expense';
  amount?: string;
  description?: string;
}

interface DepartmentStats {
  teamMembersCount: number;
  activeProjectsCount: number;
  budgetSpentPercent: number;
  budgetAllocated: string;
  budgetSpent: string;
  budgetRemaining: string;
  teamHealthScore: string;
  riskStatus: string;
  activeBlockersCount: number;
}

interface ActivityLogItem {
  id: string;
  userName: string;
  actionText: string;
  targetText: string;
  timeText: string;
  type: 'success' | 'warning' | 'primary';
}

// ============================================================================
// INITIAL MOCK DATA
// ============================================================================

const INITIAL_TASKS: TeamTask[] = [
  { id: 'task-1', title: 'Vendor Transport Agreement Signoff', assignee: 'Ali Hassan', dueDate: 'Today', priority: 'Critical', timeLeft: '1 hour left', status: 'due_today' },
  { id: 'task-2', title: 'Verify Dhaka-Sylhet Tour Guide Credentials', assignee: 'Sarah Rahman', dueDate: 'Today', priority: 'Medium', timeLeft: '4 hours left', status: 'due_today' },
  { id: 'task-3', title: 'Finalize Q3 Budget Allocation Sheet', assignee: 'Maruf Ahmed', dueDate: 'Yesterday', priority: 'Critical', timeLeft: '1 day overdue', status: 'overdue' },
  { id: 'task-4', title: 'Update Operations Manual v2', assignee: 'Ali Hassan', dueDate: 'In 2 days', priority: 'Low', timeLeft: '48 hours left', status: 'upcoming' },
  { id: 'task-5', title: 'Q3 Resource Audit', assignee: 'Sarah Rahman', dueDate: 'Completed', priority: 'High', timeLeft: 'Completed', status: 'completed' }
];

const INITIAL_APPROVALS: ApprovalRequest[] = [
  { 
    id: 'app-1', 
    requesterName: 'Ali', 
    requesterAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdnuRN_nx1hXEaGDKVbWTaIIkVK_lGz14c03nBhVIwwE76Z0r-L3lRN2Jp42gbZFhP1BUYE59NB8hyqihwjzMWLnMauyCdo1IYHjbglpH1snHg3ynEf8PRR3ebsssIjY6t8ChmoEOOjCxNhybZpARJmP1s6RZH5C9pCa1s3uvmoCZCpsfoHmtbNQgvZtz53H7XtLoFNOTWDU3TAkezA7-zFpOaC1j4bVVRht4oN5K0HP__fGviYkAvV69tsMzhnOOOEjAVFXSMiiWQ',
    title: 'Vendor Agreement', 
    timeMeta: 'From Ali • 2h ago', 
    type: 'document',
    description: 'Sajek logistics vendor transport contract SLA approval.'
  },
  { 
    id: 'app-2', 
    requesterName: 'Maruf', 
    requesterAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHZGYWIIzKl3MIaciQ0P4X_WyP0wpgpu956CDMLpEIaQ1-90Oo5PFAfWGEXeYxqizsJTmcu7liCksJ2-QNSwlYjE6bcPdXc04J0bvBhGweI3KYvMK-0Ss5MjI2nb57ELKCZd7MBnphQ_CO1gcicwtqcQx9MuhD9t0HKb4Gn0v1VZlx7pV-cFG6gHLPZS7yFvFALSRMkYxvhZQYNiu2xMrCICt3Q3ywrF4eVOMM3v9nGa66Fay4LAJNCT3Ai4XBwKtZIwX4DfLYdXUE',
    title: 'Expense Reimbursement', 
    timeMeta: 'From Maruf • 5h ago', 
    type: 'expense',
    amount: '8,000 ৳',
    description: 'Travel expenses for client onsite visit in Chittagong.'
  }
];

const DEPARTMENT_STATS: DepartmentStats = {
  teamMembersCount: 4,
  activeProjectsCount: 3,
  budgetSpentPercent: 64,
  budgetAllocated: '500,000 BDT',
  budgetSpent: '320,000 BDT',
  budgetRemaining: '180,000 BDT',
  teamHealthScore: 'A',
  riskStatus: 'Low',
  activeBlockersCount: 0
};

const INITIAL_ACTIVITY_LOG: ActivityLogItem[] = [
  { id: 'log-1', userName: 'Ali Hassan', actionText: 'completed the task', targetText: '"Q3 Resource Audit"', timeText: '15 minutes ago', type: 'success' },
  { id: 'log-2', userName: 'Sarah Rahman', actionText: 'requested changes on', targetText: '"Operations Manual v2"', timeText: '2 hours ago', type: 'warning' },
  { id: 'log-3', userName: 'System', actionText: 'assigned a new task "Budget Review" to', targetText: 'Maruf Ahmed', timeText: 'Yesterday at 4:30 PM', type: 'primary' }
];

export default function OperationsDashboard() {
  const [filter, setFilter] = React.useState<'team' | 'tasks' | 'deadlines'>('team');
  const [tasks, setTasks] = React.useState<TeamTask[]>(INITIAL_TASKS);
  const [approvals, setApprovals] = React.useState<ApprovalRequest[]>(INITIAL_APPROVALS);
  const [activityLog, setActivityLog] = React.useState<ActivityLogItem[]>(INITIAL_ACTIVITY_LOG);

  const handleApprove = (id: string, title: string, requester: string) => {
    setApprovals(prev => prev.filter(app => app.id !== id));
    setActivityLog(prev => [
      {
        id: `log-new-${Date.now()}`,
        userName: 'You',
        actionText: `approved ${requester}'s request:`,
        targetText: `"${title}"`,
        timeText: 'Just now',
        type: 'success'
      },
      ...prev
    ]);
  };

  const handleReject = (id: string, title: string, requester: string) => {
    setApprovals(prev => prev.filter(app => app.id !== id));
    setActivityLog(prev => [
      {
        id: `log-new-${Date.now()}`,
        userName: 'You',
        actionText: `rejected ${requester}'s request:`,
        targetText: `"${title}"`,
        timeText: 'Just now',
        type: 'warning'
      },
      ...prev
    ]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const isComp = task.status === 'completed';
        return {
          ...task,
          status: isComp ? 'due_today' : 'completed',
          timeLeft: isComp ? '4 hours left' : 'Completed'
        };
      }
      return task;
    }));
  };

  // Derived stats
  const dueTodayTasks = tasks.filter(t => t.status === 'due_today');
  const overdueTasks = tasks.filter(t => t.status === 'overdue');
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const thisWeekProgressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-xl">
      {/* PAGE HEADER */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-sm">
        <div className="space-y-sm">
          <div className="flex items-center gap-3">
            <span className="bg-sunrise/10 text-sunrise px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
              Operations
            </span>
            <span className="text-on-surface-variant text-label font-bold flex items-center gap-1">
              <Icon name="groups" className="w-4 h-4 text-on-surface-variant" />
              {DEPARTMENT_STATS.teamMembersCount} members
            </span>
          </div>
          <h2 className="text-h1 font-h1 text-on-surface">Dashboard — Operations Lead</h2>
        </div>
        
        <div className="flex gap-sm">
          {/* Filters Toggles */}
          <div className="flex bg-surface-container-low border border-[#E0E0E0] p-1 gap-1">
            {(['team', 'tasks', 'deadlines'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={cn(
                  "px-3 py-1.5 text-label font-bold transition-all uppercase rounded-[6px]",
                  filter === tab
                    ? "bg-sunrise text-white font-bold shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40"
                )}
              >
                {tab === 'team' ? 'My Team' : tab === 'tasks' ? 'My Tasks' : 'My Deadlines'}
              </button>
            ))}
          </div>

          <button className="h-10 flex items-center gap-2 bg-white border border-outline px-4 rounded-[6px] text-label font-bold hover:bg-slate-50 transition-colors">
            <Icon name="groups" className="w-4 h-4" />
            View Team
          </button>
          <button className="h-10 flex items-center gap-2 bg-sunrise text-white px-4 rounded-[6px] text-label font-bold hover:opacity-90 transition-opacity">
            <Icon name="add" className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </section>

      {/* RENDER DYNAMIC FILTER VIEWS */}

      {filter === 'team' && (
        <>
          {/* STATS OVERVIEW SECTION */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-sm">
            <Card className="p-lg flex items-center gap-4 h-24">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                <Icon name="schedule" className="w-6 h-6" />
              </div>
              <div>
                <p className="text-label font-bold text-on-surface-variant uppercase tracking-wider">Due Today</p>
                <p className="text-h2 font-extrabold text-orange-600">
                  {dueTodayTasks.length} <span className="text-xs font-medium text-on-surface-variant uppercase">items</span>
                </p>
              </div>
            </Card>

            <Card className="p-lg flex items-center gap-4 h-24 border-l-4 border-l-error">
              <div className="w-12 h-12 rounded-full bg-ember/5 flex items-center justify-center text-error shrink-0">
                <Icon name="warning" className="w-6 h-6" />
              </div>
              <div>
                <p className="text-label font-bold text-on-surface-variant uppercase tracking-wider">Overdue</p>
                <p className="text-h2 font-extrabold text-error">
                  {overdueTasks.length} <span className="text-xs font-medium text-on-surface-variant uppercase">item</span>
                </p>
              </div>
            </Card>

            <Card className="p-lg space-y-2 h-24 flex flex-col justify-center">
              <div className="flex justify-between items-center w-full">
                <p className="text-label font-bold text-on-surface-variant uppercase tracking-wider">This Week</p>
                <span className="text-xs font-bold text-on-surface">{tasks.length} items</span>
              </div>
              <div className="w-full bg-outline-variant/30 h-2 rounded-[6px] overflow-hidden border border-[#E0E0E0]/10">
                <div className="bg-sunrise h-full rounded-[6px]" style={{ width: `${thisWeekProgressPercent}%` }}></div>
              </div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">{thisWeekProgressPercent}% Progress</p>
            </Card>

            <Card className="p-lg flex items-center gap-4 h-24 border-l-4 border-l-success">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
                <Icon name="check_circle" className="w-6 h-6" />
              </div>
              <div>
                <p className="text-label font-bold text-on-surface-variant uppercase tracking-wider">On Time Rate</p>
                <p className="text-h2 font-extrabold text-success">75%</p>
              </div>
            </Card>
          </section>

          {/* TWO COLUMN CONTENT SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
            {/* Approvals Needed Column */}
            <section className="space-y-md">
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-bold text-on-surface flex items-center gap-2">
                  My Approvals
                </h3>
                {approvals.length > 0 && (
                  <span className="bg-ember text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {approvals.length} PENDING
                  </span>
                )}
              </div>

              <div className="space-y-sm">
                {approvals.length === 0 ? (
                  <Card className="p-lg text-center">
                    <Icon name="check_circle" size={40} color="#2E7D32" className="mx-auto mb-2" />
                    <p className="text-xs font-bold text-success">All approvals completed!</p>
                  </Card>
                ) : (
                  approvals.map((app) => (
                    <Card key={app.id} className="p-lg flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4 w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[6px] overflow-hidden relative shrink-0 border border-[#E0E0E0]/30">
                            <Image
                              src={app.requesterAvatar}
                              alt={app.requesterName}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-body font-bold text-on-surface leading-tight">{app.title}</p>
                            <p className="text-[10px] font-medium text-on-surface-variant">{app.timeMeta}</p>
                          </div>
                        </div>
                        
                        {app.type === 'expense' ? (
                          <span className="text-body font-bold text-sunrise shrink-0">{app.amount}</span>
                        ) : (
                          <Icon name="description" size={20} color="#555555" className="shrink-0" />
                        )}
                      </div>

                      {app.description && (
                        <p className="text-xs text-on-surface-variant leading-tight mb-4">{app.description}</p>
                      )}

                      <div className="grid grid-cols-2 gap-2 w-full pt-1">
                        <button 
                          onClick={() => handleReject(app.id, app.title, app.requesterName)}
                          className="h-9 bg-white border border-error text-error text-[11px] font-bold rounded-[6px] hover:bg-ember/5 transition-all"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleApprove(app.id, app.title, app.requesterName)}
                          className="h-9 bg-sunrise text-white text-[11px] font-bold rounded-[6px] hover:bg-blue-700 transition-all"
                        >
                          Approve
                        </button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </section>

            {/* Department Snapshot Column (col-span 2) */}
            <section className="lg:col-span-2 space-y-md">
              <h3 className="text-h3 font-bold text-on-surface flex items-center gap-2">
                Department Snapshot
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-sm">
                {/* Team Members */}
                <Card className="p-lg flex flex-col justify-between aspect-square">
                  <Icon name="groups" className="w-6 h-6 text-sunrise" />
                  <div>
                    <p className="text-display font-extrabold leading-none">{DEPARTMENT_STATS.teamMembersCount}</p>
                    <p className="text-label font-bold text-on-surface-variant mt-2 uppercase tracking-wider">Team Members</p>
                  </div>
                </Card>

                {/* Active Projects */}
                <Card className="p-lg flex flex-col justify-between aspect-square">
                  <Icon name="account_tree" size={24} color="#FF5F0F" />
                  <div>
                    <p className="text-display font-extrabold leading-none">{DEPARTMENT_STATS.activeProjectsCount}</p>
                    <p className="text-label font-bold text-on-surface-variant mt-2 uppercase tracking-wider">Projects Active</p>
                  </div>
                </Card>

                {/* Budget Spent circular indicator */}
                <Card className="p-lg flex flex-col justify-between aspect-square">
                  <div className="relative w-12 h-12 shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path 
                        className="text-outline-variant/30" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="3.5"
                      />
                      <path 
                        className="text-sunrise" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeDasharray={`${DEPARTMENT_STATS.budgetSpentPercent}, 100`} 
                        strokeWidth="3.5"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-on-surface">
                      {DEPARTMENT_STATS.budgetSpentPercent}%
                    </div>
                  </div>
                  <div>
                    <div className="text-display font-extrabold leading-none text-on-surface">
                      {DEPARTMENT_STATS.budgetSpentPercent}%
                    </div>
                    <p className="text-label font-bold text-on-surface-variant mt-2 uppercase tracking-wider">Budget Spent</p>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                      Spent: {DEPARTMENT_STATS.budgetSpent}
                    </p>
                  </div>
                </Card>

                {/* Team Health Score */}
                <Card className="p-lg flex flex-col justify-between aspect-square bg-sunrise/5 border border-sunrise/10">
                  <Icon name="favorite" size={24} color="#FF5F0F" />
                  <div>
                    <p className="text-display font-extrabold leading-none text-sunrise">{DEPARTMENT_STATS.teamHealthScore}</p>
                    <p className="text-label font-bold text-sunrise mt-2 uppercase tracking-wider">Team Health Score</p>
                  </div>
                </Card>

                {/* Risk Status */}
                <Card className="p-lg flex flex-col justify-between aspect-square">
                  <Icon name="security" className="w-6 h-6 text-success" />
                  <div>
                    <p className="text-h1 font-extrabold text-success leading-none">{DEPARTMENT_STATS.riskStatus}</p>
                    <p className="text-label font-bold text-on-surface-variant mt-2 uppercase tracking-wider">Risk Status</p>
                  </div>
                </Card>

                {/* Active Blockers */}
                <Card className="p-lg flex flex-col justify-between aspect-square">
                  <Icon name="block" size={24} color="#9E9E9E" />
                  <div>
                    <p className="text-display font-extrabold leading-none text-on-surface-variant/60">
                      {DEPARTMENT_STATS.activeBlockersCount}
                    </p>
                    <p className="text-label font-bold text-on-surface-variant mt-2 uppercase tracking-wider">Active Blockers</p>
                  </div>
                </Card>
              </div>
            </section>
          </div>

          {/* RECENT ACTIVITY TIMELINE */}
          <section className="space-y-md pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-h3 font-bold text-on-surface flex items-center gap-2">
                Recent Activity
              </h3>
              <button className="text-sunrise text-label font-bold hover:underline">View All Log</button>
            </div>

            <Card className="p-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sunrise/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              <div className="relative space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/30 w-full">
                {activityLog.map((log) => (
                  <div key={log.id} className="relative flex gap-xl items-start pl-8 w-full">
                    <span className={cn(
                      "absolute left-0 top-1 w-6 h-6 rounded-[6px] border-4 border-white z-10",
                      log.type === 'success' && "bg-success",
                      log.type === 'warning' && "bg-[#F59E0B]",
                      log.type === 'primary' && "bg-sunrise"
                    )}></span>
                    <div className="flex-1 pb-4 border-b border-[#E0E0E0]/20 last:border-b-0 last:pb-0">
                      <p className="text-body font-medium">
                        <span className="font-bold text-on-surface">{log.userName}</span>{' '}
                        <span className="text-on-surface-variant">{log.actionText}</span>{' '}
                        <span className="text-sunrise italic font-bold">{log.targetText}</span>
                      </p>
                      <p className="text-label text-on-surface-variant mt-1">{log.timeText}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </>
      )}

      {/* FILTER: MY TASKS */}
      {filter === 'tasks' && (
        <Card className="flex flex-col">
          <div className="bg-slate-50 px-lg py-md border-b border-[#E0E0E0] flex justify-between items-center">
            <h3 className="text-h3 font-bold text-on-surface flex items-center gap-2">
              <CheckSquare2 className="w-5 h-5 text-sunrise" />
              My Tasks
            </h3>
            <span className="text-xs font-bold text-on-surface-variant">
              {completedCount} of {tasks.length} Completed
            </span>
          </div>

          <div className="p-lg space-y-md">
            <div className="divide-y divide-outline-variant/40">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => handleToggleTask(task.id)}
                      className="w-4 h-4 border border-outline focus:ring-0 text-sunrise cursor-pointer rounded-[6px]"
                    />
                    <div>
                      <p className={cn(
                        "text-body font-bold leading-tight",
                        task.status === 'completed' && "line-through text-on-surface-variant/50"
                      )}>
                        {task.title}
                      </p>
                      <p className="text-label text-on-surface-variant mt-0.5">
                        Assignee: {task.assignee} • Due: {task.dueDate}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      task.priority === 'Critical' ? 'critical' :
                      task.priority === 'High' ? 'warning' : 'neutral'
                    }>
                      {task.priority}
                    </Badge>
                    <span className={cn(
                      "text-xs font-bold font-mono",
                      task.status === 'overdue' && "text-error",
                      task.status === 'due_today' && "text-orange-600",
                      task.status === 'completed' && "text-success",
                      task.status === 'upcoming' && "text-on-surface-variant"
                    )}>
                      {task.timeLeft}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* FILTER: MY DEADLINES */}
      {filter === 'deadlines' && (
        <Card className="flex flex-col">
          <div className="bg-slate-50 px-lg py-md border-b border-[#E0E0E0] flex justify-between items-center">
            <h3 className="text-h3 font-bold text-on-surface flex items-center gap-2">
              <Icon name="schedule" className="w-5 h-5 text-sunrise" />
              Critical Deadlines & Alerts
            </h3>
            <Badge variant="critical">Urgent Action Required</Badge>
          </div>

          <div className="p-lg space-y-md">
            <div className="space-y-md">
              {tasks.filter(t => t.status === 'overdue' || t.status === 'due_today').map((task) => (
                <div 
                  key={task.id} 
                  className={cn(
                    "p-4 border-l-4 bg-slate-50 flex flex-col md:flex-row justify-between md:items-center gap-md",
                    task.status === 'overdue' ? "border-l-error bg-ember/5" : "border-l-orange-500 bg-orange-500/5"
                  )}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={task.status === 'overdue' ? 'critical' : 'warning'}>
                        {task.status === 'overdue' ? 'Overdue' : 'Due Today'}
                      </Badge>
                      <span className="text-xs text-on-surface-variant font-medium">({task.priority} Priority)</span>
                    </div>
                    <h4 className="text-body font-bold text-on-surface">{task.title}</h4>
                    <p className="text-label text-on-surface-variant">Assignee: {task.assignee} • Deadline: {task.dueDate}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <Icon name="warning" className={cn(
                      "w-4 h-4",
                      task.status === 'overdue' ? "text-error" : "text-orange-500"
                    )} />
                    <span className={cn(
                      "text-xs font-bold font-mono",
                      task.status === 'overdue' ? "text-error" : "text-orange-600"
                    )}>
                      {task.timeLeft}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* FOOTER BLOCK */}
      <footer className="pt-xl pb-lg border-t border-[#E0E0E0] bg-slate-50 flex justify-between items-center text-on-surface-variant text-label mt-xl">
        <p>© 2024 Bynd BD Travel Ops. All rights reserved.</p>
        <div className="flex gap-xl">
          <a className="hover:text-sunrise transition-colors font-bold" href="#">Privacy Policy</a>
          <a className="hover:text-sunrise transition-colors font-bold" href="#">System Status: 100%</a>
        </div>
      </footer>
    </div>
  );
}

// Local helper icon component to avoid build errors
function CheckSquare2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export const dynamic = 'force-dynamic';
