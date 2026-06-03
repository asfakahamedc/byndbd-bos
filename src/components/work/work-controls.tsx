'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { CreateProjectModal } from './create-project-modal';
import { CreateTaskModal } from './create-task-modal';

interface ProjectOption {
  id: string;
  title: string;
}

interface UserOption {
  id: string;
  full_name: string;
}

interface WorkControlsProps {
  projects: ProjectOption[];
  users: UserOption[];
}

export function WorkControls({ projects, users }: WorkControlsProps) {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-md">
      {/* + New Project button: Blue primary button */}
      <button 
        onClick={() => setIsProjectModalOpen(true)}
        className="flex items-center gap-xs bg-sunrise hover:bg-sunrise/90 text-white px-xl py-sm rounded-[6px] border border-sunrise/20 hover:shadow-md transition-all text-h4 font-bold tracking-wide active:scale-95 h-[40px]"
      >
        <Icon name="add" className="w-5 h-5" />
        <span>New Project</span>
      </button>

      {/* + New Task button: White border button */}
      <button 
        onClick={() => setIsTaskModalOpen(true)}
        className="flex items-center gap-xs bg-white hover:bg-surface-container-low text-sunrise px-xl py-sm rounded-[6px] border border-sunrise hover:shadow-md transition-all text-h4 font-bold tracking-wide active:scale-95 h-[40px]"
      >
        <Icon name="add" className="w-5 h-5" />
        <span>New Task</span>
      </button>

      {/* Conditionally rendered Project Creation Modal */}
      {isProjectModalOpen && (
        <CreateProjectModal 
          onClose={() => setIsProjectModalOpen(false)} 
        />
      )}

      {/* Conditionally rendered Task Creation Modal */}
      {isTaskModalOpen && (
        <CreateTaskModal 
          onClose={() => setIsTaskModalOpen(false)} 
          projects={projects}
          users={users}
        />
      )}
    </div>
  );
}
