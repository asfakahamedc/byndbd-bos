import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProjectCardProps {
  title: string;
  description: string;
  progress: number;
  status: 'Healthy' | 'At Risk' | 'Planning';
  iconName: string; // Lucide icon component name (e.g. Megaphone, Globe, Truck)
  assignees: Array<{
    name: string;
    avatar: string;
  }>;
  className?: string;
}

/**
 * ProjectCard represents an individual project panel displaying progress,
 * status health badges, and active project team members.
 */
export function ProjectCard({
  title,
  description,
  progress,
  status,
  iconName,
  assignees,
  className
}: ProjectCardProps) {
  // Extract icon dynamically or fallback to Folder
  const LucideIcon = (Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>) || Icons.Folder;

  // Map health statuses to badge variants
  const healthVariants = {
    Healthy: 'success',
    'At Risk': 'warning',
    Planning: 'primary'
  } as const;

  const bgIconColor = {
    Healthy: 'bg-primary/10 text-primary',
    'At Risk': 'bg-secondary-container/10 text-secondary',
    Planning: 'bg-tertiary/10 text-tertiary'
  } as const;

  return (
    <Card className={cn("p-xl rounded-none bg-white flex flex-col justify-between group", className)}>
      <div>
        {/* Top Header: Icon & Health Status */}
        <div className="flex justify-between items-start mb-md">
          <div className={cn("p-sm rounded-lg", bgIconColor[status] || 'bg-primary/10 text-primary')}>
            <LucideIcon className="w-5 h-5" />
          </div>
          <Badge variant={healthVariants[status]}>{status}</Badge>
        </div>

        {/* Project Title */}
        <h3 className="text-h3 font-h3 text-on-background mb-xs group-hover:text-primary transition-colors cursor-pointer">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-body text-on-surface-variant mb-lg line-clamp-2">
          {description}
        </p>
      </div>

      {/* Progress Section */}
      <div className="space-y-sm">
        <div className="flex justify-between text-label">
          <span className="text-on-surface-variant">Progress</span>
          <span className="font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-surface-container rounded-none h-2 overflow-hidden border border-outline-variant/10">
          <div 
            className={cn(
              "h-full rounded-none transition-all duration-500",
              status === 'Healthy' ? 'bg-primary' : status === 'At Risk' ? 'bg-secondary' : 'bg-tertiary'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stack of Assignees */}
        <div className="flex items-center -space-x-2 pt-sm">
          {assignees.slice(0, 3).map((assignee, idx) => (
            <Image
              key={idx}
              src={assignee.avatar}
              alt={assignee.name}
              width={24}
              height={24}
              className="rounded-full border-2 border-white object-cover"
            />
          ))}
          {assignees.length > 3 && (
            <div className="w-6 h-6 rounded-full border-2 border-white bg-surface-variant flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
              +{assignees.length - 3}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
