'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  AlertOctagon, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  CheckCircle,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Task {
  id: string;
  title: string;
  project: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Review' | 'Completed';
  due_date: string;
  assigned_to: {
    name: string;
    avatar: string;
  };
}

export interface TaskListProps {
  tasks: Task[];
}

/**
 * TaskList displays the active tasks in a responsive brutalist tabular format,
 * complete with activity filters, search, and pagination.
 */
export function TaskList({ tasks: initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'personal'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  // Toggle task completion locally for rich interactivity
  const toggleComplete = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === 'Completed' ? 'In Progress' : 'Completed' }
          : t
      )
    );
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assigned_to.name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTab = activeFilterTab === 'all' || task.assigned_to.name === 'Alex Rivera'; // Mock personal filter
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;

    return matchesSearch && matchesTab && matchesStatus && matchesPriority;
  });

  // Priority and Status badge variants mapping
  const priorityColors = {
    Critical: 'bg-red-100 text-red-700 border-red-200',
    High: 'bg-orange-100 text-orange-700 border-orange-200',
    Medium: 'bg-blue-100 text-blue-700 border-blue-200',
    Low: 'bg-surface-container text-outline border-outline-variant/30'
  };

  const statusColors = {
    'Not Started': 'bg-surface-container text-outline border-outline-variant/30',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
    'Review': 'bg-purple-100 text-purple-700 border-purple-200',
    'Completed': 'bg-green-100 text-green-700 border-green-200'
  };

  const handleRowClick = (taskName: string) => {
    console.log('Navigating to task details for:', taskName);
  };

  return (
    <div className="space-y-xl">
      {/* Search & Tabs Segment */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div className="flex bg-surface-container rounded-none p-[2px] border border-outline-variant w-fit">
          <button 
            onClick={() => setActiveFilterTab('all')}
            className={cn(
              "px-md py-xs text-label font-bold transition-all",
              activeFilterTab === 'all' 
                ? "bg-white shadow-sm text-primary border border-outline-variant/10 rounded-none" 
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            All Activity
          </button>
          <button 
            onClick={() => setActiveFilterTab('personal')}
            className={cn(
              "px-md py-xs text-label font-bold transition-all",
              activeFilterTab === 'personal' 
                ? "bg-white shadow-sm text-primary border border-outline-variant/10 rounded-none" 
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            Personal
          </button>
        </div>

        {/* Global Task Search bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-md top-1/2 -translate-y-1/2 text-outline-variant" />
          <input
            type="text"
            placeholder="Search tasks, projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-xl pr-md py-xs bg-surface-container-low border border-outline-variant rounded-none focus:border-primary focus:ring-0 outline-none text-body transition-all"
          />
        </div>
      </section>

      {/* Filters Strip */}
      <section className="flex flex-wrap items-center gap-md bg-white p-sm border border-outline-variant">
        <div className="flex items-center gap-sm px-md py-xs border border-outline-variant cursor-pointer hover:bg-surface-container transition-colors">
          <Filter className="w-4 h-4 text-outline" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none text-body font-medium p-0 focus:ring-0 cursor-pointer outline-none"
          >
            <option value="All">Status: All</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-sm px-md py-xs border border-outline-variant cursor-pointer hover:bg-surface-container transition-colors">
          <AlertOctagon className="w-4 h-4 text-outline" />
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-transparent border-none text-body font-medium p-0 focus:ring-0 cursor-pointer outline-none"
          >
            <option value="All">Priority: All</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="ml-auto text-label text-outline px-sm">
          Showing {filteredTasks.length} matching tasks
        </div>
      </section>

      {/* Table Frame Container */}
      <div className="bg-white border border-outline-variant rounded-none overflow-hidden shadow-sm">
        <div className="px-xl py-md border-b border-outline-variant flex items-center justify-between bg-surface-bright">
          <h4 className="text-h3 text-on-background">Active Tasks</h4>
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-outline cursor-pointer"><MoreVertical className="w-4 h-4" /></span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-on-surface-variant text-label uppercase tracking-wider border-b border-outline-variant">
              <tr className="table-row-48">
                <th className="px-xl py-md font-bold">Task Name</th>
                <th className="px-xl py-md font-bold">Project</th>
                <th className="px-xl py-md font-bold">Priority</th>
                <th className="px-xl py-md font-bold">Assignee</th>
                <th className="px-xl py-md font-bold">Due Date</th>
                <th className="px-xl py-md font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-body divide-y divide-outline-variant/30">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const isCompleted = task.status === 'Completed';
                  return (
                    <tr 
                      key={task.id} 
                      onClick={() => handleRowClick(task.title)}
                      className="table-row-48 hover:bg-surface-container-low/50 transition-colors cursor-pointer group"
                    >
                      {/* Task Name & Completion Checkbox */}
                      <td className="px-xl py-md">
                        <div className="flex items-center gap-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Avoid triggering row details click
                              toggleComplete(task.id);
                            }}
                            className="text-outline hover:text-primary transition-colors flex items-center justify-center p-0.5 focus:outline-none"
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            ) : (
                              <Circle className="w-5 h-5 text-outline-variant hover:text-outline" />
                            )}
                          </button>
                          <span 
                            className={cn(
                              "font-medium group-hover:text-primary transition-colors",
                              isCompleted && "text-outline line-through"
                            )}
                          >
                            {task.title}
                          </span>
                        </div>
                      </td>

                      {/* Project Field */}
                      <td className="px-xl py-md text-on-surface-variant">
                        {task.project}
                      </td>

                      {/* Priority Field */}
                      <td className="px-xl py-md">
                        <span className={cn("px-sm py-[2px] border text-label font-bold rounded-none", priorityColors[task.priority])}>
                          {task.priority}
                        </span>
                      </td>

                      {/* Assignee Field */}
                      <td className="px-xl py-md">
                        <div className="flex items-center gap-sm">
                          {task.assigned_to.avatar ? (
                            <Image
                              src={task.assigned_to.avatar}
                              alt={task.assigned_to.name}
                              width={24}
                              height={24}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-[10px] font-bold">
                              <User className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <span className="text-label font-normal">{task.assigned_to.name}</span>
                        </div>
                      </td>

                      {/* Due Date Field */}
                      <td className="px-xl py-md text-on-surface-variant text-label">
                        {task.due_date}
                      </td>

                      {/* Status Field */}
                      <td className="px-xl py-md text-center">
                        <span className={cn("px-sm py-[2px] border text-label font-bold rounded-none", statusColors[task.status])}>
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-xl py-xl text-center text-on-surface-variant">
                    No active tasks found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-xl py-md border-t border-outline-variant flex items-center justify-between bg-surface-bright">
          <span className="text-label text-outline">
            Showing 1 to {filteredTasks.length} of {filteredTasks.length} tasks
          </span>
          <div className="flex items-center gap-xs">
            <button className="p-1 border border-outline-variant hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4 text-outline" />
            </button>
            <button className="px-3 py-1 border border-primary bg-primary-container/10 text-primary text-label font-bold rounded-none">
              1
            </button>
            <button className="p-1 border border-outline-variant hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
              <ChevronRight className="w-4 h-4 text-outline" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
