'use client';

import React, { useState, useTransition } from 'react';
import { createTask } from '@/actions/work';
import { Icon } from '@/components/ui/icon';

interface ProjectOption {
  id: string;
  title: string;
}

interface UserOption {
  id: string;
  full_name: string;
}

interface CreateTaskModalProps {
  onClose: () => void;
  projects: ProjectOption[];
  users: UserOption[];
}

export function CreateTaskModal({ onClose, projects, users }: CreateTaskModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const projectId = formData.get('project_id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const assignedTo = formData.get('assigned_to') as string;
    const priority = formData.get('priority') as string;
    const dueDate = formData.get('due_date') as string;

    if (!projectId) {
      setError('Project selection is required');
      return;
    }
    if (!title) {
      setError('Task title is required');
      return;
    }

    startTransition(async () => {
      try {
        await createTask({
          project_id: projectId,
          title,
          description,
          assigned_to: assignedTo || null,
          priority,
          due_date: dueDate || null,
          status: 'Not Started' // default status
        });
        onClose();
      } catch (err: unknown) {
        console.error('Task creation failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to create task');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-md font-sans text-on-surface">
      <div className="bg-white border-2 border-outline w-full max-w-lg rounded-[6px] shadow-2xl relative flex flex-col">
        {/* Modal Header */}
        <div className="px-xl py-md border-b border-[#E0E0E0] flex items-center justify-between bg-surface-container-low">
          <h3 className="text-h3 font-bold text-on-background">Create New Task</h3>
          <button 
            onClick={onClose}
            className="text-outline hover:text-on-surface transition-colors focus:outline-none"
            disabled={isPending}
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-xl space-y-lg flex-1">
          {error && (
            <div className="p-md bg-ember/10 border border-error text-error text-body rounded-[6px]">
              {error}
            </div>
          )}

          {/* Project Selection */}
          <div className="space-y-xs">
            <label className="text-label text-on-surface-variant block" htmlFor="project_id">
              Select Project
            </label>
            <select
              id="project_id"
              name="project_id"
              required
              disabled={isPending}
              className="w-full h-[40px] px-md border border-[#E0E0E0] bg-surface focus:ring-2 focus:ring-primary/20 focus:border-sunrise transition-all text-body outline-none rounded-[6px]"
            >
              <option value="">-- Choose a Project --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Task Title */}
          <div className="space-y-xs">
            <label className="text-label text-on-surface-variant block" htmlFor="title">
              Task Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Conduct security validation audit"
              required
              disabled={isPending}
              className="w-full h-[40px] px-md border border-[#E0E0E0] bg-surface focus:ring-2 focus:ring-primary/20 focus:border-sunrise transition-all text-body outline-none rounded-[6px]"
            />
          </div>

          {/* Description */}
          <div className="space-y-xs">
            <label className="text-label text-on-surface-variant block" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Provide clear steps, metrics, or contexts for the assignee..."
              rows={3}
              disabled={isPending}
              className="w-full p-md border border-[#E0E0E0] bg-surface focus:ring-2 focus:ring-primary/20 focus:border-sunrise transition-all text-body outline-none rounded-[6px] resize-none"
            />
          </div>

          {/* Assigned To User */}
          <div className="space-y-xs">
            <label className="text-label text-on-surface-variant block" htmlFor="assigned_to">
              Assigned To
            </label>
            <select
              id="assigned_to"
              name="assigned_to"
              disabled={isPending}
              className="w-full h-[40px] px-md border border-[#E0E0E0] bg-surface focus:ring-2 focus:ring-primary/20 focus:border-sunrise transition-all text-body outline-none rounded-[6px]"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority & Due Date Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            {/* Priority */}
            <div className="space-y-xs">
              <label className="text-label text-on-surface-variant block" htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                disabled={isPending}
                className="w-full h-[40px] px-md border border-[#E0E0E0] bg-surface focus:ring-2 focus:ring-primary/20 focus:border-sunrise transition-all text-body outline-none rounded-[6px]"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="space-y-xs">
              <label className="text-label text-on-surface-variant block" htmlFor="due_date">
                Due Date
              </label>
              <input
                id="due_date"
                name="due_date"
                type="date"
                disabled={isPending}
                className="w-full h-[40px] px-md border border-[#E0E0E0] bg-surface focus:ring-2 focus:ring-primary/20 focus:border-sunrise transition-all text-body outline-none rounded-[6px]"
              />
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-end gap-md pt-md border-t border-[#E0E0E0]">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-lg h-[40px] border border-outline bg-white hover:bg-surface-container-low text-on-surface font-bold text-body active:scale-[0.98] transition-all rounded-[6px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-lg h-[40px] bg-sunrise hover:bg-sunrise/90 text-white font-bold text-body active:scale-[0.98] transition-all rounded-[6px] shadow-md flex items-center justify-center gap-sm disabled:opacity-70 disabled:pointer-events-none"
            >
              {isPending ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Task</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
