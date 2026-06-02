import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TaskCardProps {
  title: string;
  project: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Review' | 'Completed';
  dueDate: string;
  assignee: {
    name: string;
    avatar: string;
  };
  className?: string;
}

/**
 * TaskCard is a reusable card representing an individual task,
 * built using brutalist (0px border-radius) design guidelines.
 */
export function TaskCard({
  title,
  project,
  priority,
  status,
  dueDate,
  assignee,
  className
}: TaskCardProps) {
  // Mapping priorities to Badge variants
  const priorityVariant = {
    Critical: 'critical',
    High: 'warning',
    Medium: 'secondary',
    Low: 'neutral'
  } as const;

  // Mapping statuses to Badge variants
  const statusVariant = {
    'Not Started': 'neutral',
    'In Progress': 'primary',
    'Review': 'secondary',
    'Completed': 'success'
  } as const;

  return (
    <Card className={cn("p-md flex flex-col justify-between hover:shadow-md transition-shadow bg-white", className)}>
      <div>
        {/* Header: Project and Priority */}
        <div className="flex justify-between items-center mb-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">
            {project}
          </span>
          <Badge variant={priorityVariant[priority]}>{priority}</Badge>
        </div>

        {/* Task Title */}
        <h4 className="text-body font-bold text-on-background line-clamp-2 hover:text-primary transition-colors cursor-pointer">
          {title}
        </h4>
      </div>

      {/* Footer: Assignee, Due Date, and Status */}
      <div className="mt-md pt-sm border-t border-outline-variant/30 flex items-center justify-between text-caption">
        <div className="flex items-center gap-sm">
          {assignee.avatar ? (
            <Image
              src={assignee.avatar}
              alt={assignee.name}
              width={20}
              height={20}
              className="rounded-full object-cover border border-outline-variant"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant">
              <User className="w-3 h-3 text-on-surface-variant" />
            </div>
          )}
          <span className="text-on-surface-variant max-w-[80px] truncate">{assignee.name}</span>
        </div>

        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <Calendar className="w-3.5 h-3.5" />
          <span>{dueDate}</span>
        </div>
      </div>
      
      {/* Status indicator pill at bottom */}
      <div className="mt-sm flex justify-end">
        <Badge variant={statusVariant[status]} className="text-[9px] px-1.5 py-0.5">
          {status}
        </Badge>
      </div>
    </Card>
  );
}
