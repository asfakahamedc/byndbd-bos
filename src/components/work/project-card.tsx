import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

export interface ProjectCardProps {
  title: string;
  description: string;
  progress: number;
  status: 'Healthy' | 'At Risk' | 'Planning';
  iconName: string; // Lucide icon name (e.g. Megaphone, Globe, Truck)
  assignees: Array<{
    name: string;
    avatar: string;
  }>;
  className?: string;
}

const mapLucideToMaterial = (lucideName: string): string => {
  const map: Record<string, string> = {
    Megaphone: 'campaign',
    Globe: 'public',
    Truck: 'local_shipping',
    Folder: 'folder',
  };
  return map[lucideName] || 'folder';
};

export function ProjectCard({
  title,
  description,
  progress,
  status,
  iconName,
  assignees,
  className
}: ProjectCardProps) {
  // Map health statuses to badge variants
  const healthVariants = {
    Healthy: 'success',
    'At Risk': 'warning',
    Planning: 'primary'
  } as const;

  const bgIconColor = {
    Healthy: 'bg-sunrise/10 text-sunrise',
    'At Risk': 'bg-golden-hour/10 text-golden-hour',
    Planning: 'bg-dusk/10 text-dusk'
  } as const;

  const iconColorHex = {
    Healthy: '#FF5F0F',
    'At Risk': '#E8A830',
    Planning: '#1D1D1B'
  } as const;

  return (
    <Card className={cn("p-xl bg-white flex flex-col justify-between group", className)}>
      <div>
        {/* Top Header: Icon & Health Status */}
        <div className="flex justify-between items-start mb-md">
          <div className={cn("p-sm rounded-lg flex items-center justify-center", bgIconColor[status] || 'bg-sunrise/10')}>
            <Icon name={mapLucideToMaterial(iconName)} size={20} color={iconColorHex[status] || '#FF5F0F'} />
          </div>
          <Badge variant={healthVariants[status]}>{status}</Badge>
        </div>

        {/* Project Title */}
        <h3 className="text-lg font-poppins font-semibold text-dusk mb-xs group-hover:text-sunrise transition-colors cursor-pointer">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-sm font-ubuntu text-[#555555] mb-lg line-clamp-2">
          {description}
        </p>
      </div>

      {/* Progress Section */}
      <div className="space-y-sm">
        <div className="flex justify-between text-xs font-ubuntu text-[#555555]">
          <span>Progress</span>
          <span className="font-semibold text-dusk">{progress}%</span>
        </div>
        <div className="w-full bg-[#F5F5F5] rounded-full h-2 overflow-hidden border border-[#E0E0E0]/30">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              status === 'Healthy' ? 'bg-sunrise' : status === 'At Risk' ? 'bg-[#E8A830]' : 'bg-dusk'
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
              className="rounded-full border-2 border-white object-cover shadow-sm"
            />
          ))}
          {assignees.length > 3 && (
            <div className="w-6 h-6 rounded-full border-2 border-white bg-[#F5F5F5] flex items-center justify-center text-[10px] font-poppins font-semibold text-[#555555]">
              +{assignees.length - 3}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
