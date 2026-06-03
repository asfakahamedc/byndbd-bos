'use client';

import React, { useState, useTransition } from 'react';
import { createProject } from '@/actions/work';
import { Icon } from '@/components/ui/icon';

interface CreateProjectModalProps {
  onClose: () => void;
}

export function CreateProjectModal({ onClose }: CreateProjectModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const department = formData.get('department') as string;
    const priority = formData.get('priority') as string;
    const dueDate = formData.get('due_date') as string;

    if (!title) {
      setError('Project name is required');
      return;
    }

    startTransition(async () => {
      try {
        await createProject({
          title,
          description,
          department,
          priority,
          due_date: dueDate || null,
          status: 'Planning', // default status
          progress: 0
        });
        onClose();
      } catch (err: unknown) {
        console.error('Project creation failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to create project');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-md font-sans text-on-surface">
      <div className="bg-white border-2 border-outline w-full max-w-lg rounded-[6px] shadow-2xl relative flex flex-col">
        {/* Modal Header */}
        <div className="px-xl py-md border-b border-[#E0E0E0] flex items-center justify-between bg-surface-container-low">
          <h3 className="text-h3 font-bold text-on-background">Create New Project</h3>
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

          {/* Project Name */}
          <div className="space-y-xs">
            <label className="text-label text-on-surface-variant block" htmlFor="title">
              Project Name
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Sajek Route Optimization"
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
              placeholder="Provide a brief summary of project objectives..."
              rows={3}
              disabled={isPending}
              className="w-full p-md border border-[#E0E0E0] bg-surface focus:ring-2 focus:ring-primary/20 focus:border-sunrise transition-all text-body outline-none rounded-[6px] resize-none"
            />
          </div>

          {/* Department Selector */}
          <div className="space-y-xs">
            <label className="text-label text-on-surface-variant block" htmlFor="department">
              Department
            </label>
            <select
              id="department"
              name="department"
              disabled={isPending}
              className="w-full h-[40px] px-md border border-[#E0E0E0] bg-surface focus:ring-2 focus:ring-primary/20 focus:border-sunrise transition-all text-body outline-none rounded-[6px]"
            >
              <option value="Operations">Operations</option>
              <option value="Finance">Finance</option>
              <option value="Tech">Tech</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
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
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
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
                <span>Save Project</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
