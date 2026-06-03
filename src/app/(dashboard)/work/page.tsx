import React from 'react';
import { ProjectCard } from '@/components/work/project-card';
import { TaskList, Task } from '@/components/work/task-list';
import { WorkControls } from '@/components/work/work-controls';
import { Icon } from '@/components/ui/icon';
import { Metadata } from 'next';
import { getProjects, getTasks } from '@/actions/work';
import { getUsers } from '@/actions/users';

export const metadata: Metadata = {
  title: 'Projects & Tasks | Bynd BD BOS',
  description: 'Work Management and Task Tracking operations suite for Bynd BD BOS.'
};

interface DBUser {
  id: string;
  full_name: string;
  layer: number;
  department: string | null;
}

interface DBProject {
  id: string;
  title?: string;
  description?: string;
  progress?: number;
  status?: string;
  iconName?: string;
  icon_name?: string;
  assignees?: Array<{ name: string; avatar: string }>;
}

interface DBTask {
  id: string;
  title?: string;
  project_id?: string;
  project?: string;
  priority?: string;
  status?: string;
  due_date?: string;
  assigned_to?: string | { name: string; avatar: string } | null;
}

export default async function WorkManagementPage() {
  // Await active database records
  const [dbProjectsRaw, dbTasksRaw, dbUsersRaw] = await Promise.all([
    getProjects(),
    getTasks(),
    getUsers()
  ]);

  const dbProjects = dbProjectsRaw as DBProject[];
  const dbTasks = dbTasksRaw as DBTask[];
  const dbUsers = dbUsersRaw as DBUser[];

  const userMap = new Map<string, DBUser>(dbUsers.map((u) => [u.id, u]));
  const projectMap = new Map<string, DBProject>(dbProjects.map((p) => [p.id, p]));

  // Normalize status helper for projects
  const normalizeProjectStatus = (status?: string): 'Healthy' | 'At Risk' | 'Planning' => {
    if (status === 'Healthy' || status === 'At Risk' || status === 'Planning') {
      return status;
    }
    const lower = (status || '').toLowerCase();
    if (lower === 'healthy') return 'Healthy';
    if (lower === 'at_risk' || lower === 'at-risk') return 'At Risk';
    if (lower === 'planning') return 'Planning';
    return 'Planning';
  };

  // Normalize priority helper for tasks
  const normalizePriority = (p?: string): 'Critical' | 'High' | 'Medium' | 'Low' => {
    if (p === 'Critical' || p === 'High' || p === 'Medium' || p === 'Low') {
      return p;
    }
    const lower = (p || '').toLowerCase();
    if (lower === 'critical') return 'Critical';
    if (lower === 'high') return 'High';
    if (lower === 'medium') return 'Medium';
    if (lower === 'low') return 'Low';
    return 'Medium';
  };

  // Normalize status helper for tasks
  const normalizeTaskStatus = (s?: string): 'Not Started' | 'In Progress' | 'Review' | 'Completed' => {
    if (s === 'Not Started' || s === 'In Progress' || s === 'Review' || s === 'Completed') {
      return s;
    }
    const lower = (s || '').toLowerCase();
    if (lower === 'not_started' || lower === 'not-started') return 'Not Started';
    if (lower === 'in_progress' || lower === 'in-progress') return 'In Progress';
    if (lower === 'review') return 'Review';
    if (lower === 'completed') return 'Completed';
    return 'Not Started';
  };

  // Format projects safely for components
  const formattedProjects = dbProjects.map((project) => {
    return {
      id: project.id,
      title: project.title || '',
      description: project.description || '',
      progress: typeof project.progress === 'number' ? project.progress : 0,
      status: normalizeProjectStatus(project.status),
      iconName: project.iconName || project.icon_name || 'Folder',
      assignees: Array.isArray(project.assignees) ? project.assignees : []
    };
  });

  // Format tasks safely and resolve assignees in memory
  const formattedTasks: Task[] = dbTasks.map((task) => {
    let assignedToObj = {
      name: 'Unassigned',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8olNfEvBdt7fTPDHbdco-V_khuL21hdjnk75_kucK7vvHxX0m6BeuRLV2dM313epKxtb09FX3oJKa2-jBu6ASPoU4t14IYudmsX9qBFsAzodwgRRue1rRH1PRMfHJAA98S5AOtO-TV6jXdtzxPEoLwLNbXzfQFzwRp0non8E6-cNsPcCkia3x-oSFnkdMnyFLUbengZYJKYX5aKkSHaJbBtEgvdAn-GGm-Xu9MSvRr5JyxOI_zVkfaMltRq56a5e8HvxLvWacukrG'
    };

    if (task.assigned_to) {
      if (typeof task.assigned_to === 'object') {
        const obj = task.assigned_to as { name?: string; avatar?: string };
        assignedToObj = {
          name: obj.name || 'Unassigned',
          avatar: obj.avatar || assignedToObj.avatar
        };
      } else if (typeof task.assigned_to === 'string') {
        const matchedUser = userMap.get(task.assigned_to);
        if (matchedUser) {
          assignedToObj = {
            name: matchedUser.full_name,
            avatar: assignedToObj.avatar
          };
        }
      }
    }

    // Resolve project name from ID or use text column
    let projectName = 'General';
    if (task.project_id) {
      const proj = projectMap.get(task.project_id);
      if (proj) {
        projectName = proj.title || 'General';
      }
    } else if (task.project) {
      projectName = task.project;
    }

    return {
      id: task.id,
      title: task.title || '',
      project: projectName,
      priority: normalizePriority(task.priority),
      status: normalizeTaskStatus(task.status),
      due_date: task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date',
      assigned_to: assignedToObj
    };
  });

  return (
    <div className="space-y-xl">
      {/* Page Header Breadcrumbs & Action Bar */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xxl">
        <div>
          <nav className="flex items-center text-xs font-poppins text-[#9E9E9E] mb-xs">
            <span>Work</span>
            <Icon name="chevron_right" size={14} color="#9E9E9E" className="mx-xs" />
            <span className="text-dusk font-medium">Projects & Tasks</span>
          </nav>
          <h2 className="text-3xl font-poppins font-bold text-dusk">Projects & Tasks</h2>
        </div>
        
        {/* Actions Buttons / Work Controls */}
        <WorkControls 
          projects={formattedProjects} 
          users={dbUsers} 
        />
      </section>

      {/* Project Overview Cards Grid or Brutalist Empty State */}
      {formattedProjects.length === 0 ? (
        <div className="p-8 border border-[#E0E0E0] bg-white rounded-lg shadow-sm text-center text-[#555555] font-poppins font-semibold uppercase text-xs mb-xxl">
          No Active Projects. Initialize Database.
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xxl">
          {formattedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              progress={project.progress}
              status={project.status}
              iconName={project.iconName}
              assignees={project.assignees}
            />
          ))}
        </section>
      )}

      {/* Active Tasks list table section */}
      <section className="mt-xxl">
        <TaskList tasks={formattedTasks} />
      </section>

      {/* Contextual Floating Action Button (FAB) */}
      <button 
        className="fixed bottom-xl right-xl w-14 h-14 bg-sunrise hover:bg-ember rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all z-50 focus:outline-none focus:ring-2 focus:ring-sunrise focus:ring-offset-2"
        title="Add new task"
      >
        <Icon name="add" size={28} color="#FFFFFF" />
      </button>
    </div>
  );
}

export const dynamic = 'force-dynamic';
