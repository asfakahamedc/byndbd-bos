import React from 'react';
import { ProjectCard } from '@/components/work/project-card';
import { TaskList } from '@/components/work/task-list';
import { ChevronRight, Plus, PlusCircle } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects & Tasks | Bynd BD BOS',
  description: 'Work Management and Task Tracking operations suite for Bynd BD BOS.'
};

// ============================================================================
// MOCK DATA STRUCTURES (Prepared for seamless replacement with Supabase hooks)
// ============================================================================

const MOCK_PROJECTS = [
  {
    id: 'proj-1',
    title: 'Q2 Marketing Campaign',
    description: 'Brand awareness and lead generation via social channels.',
    progress: 68,
    status: 'Healthy' as const,
    iconName: 'Megaphone',
    assignees: [
      {
        name: 'Jane Smith',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNMudSCNPAJ1kbouS_zbDrTG6apLjx08COmk2Pf05Ii6363MypxxUChM6BL5gu8trj_cN26gSddX87pQi1901l8NtlyJfot3jkIbCq4UQM7VP-cfEM7E7MFcU3U3Flv1GlBNnebu_RZWg69dDhEGnPqssu9Qn5hlhqA-VyR5ZSOmXaiNDXpNBfTFqybnyz0G52LlLEQEFevJAcTh1J9P-nUW9-pu3u5jZPcp6B5eVpi-elkoUyKQByo4UEwZ2xAg83ZmqV_S3qLS9B'
      },
      {
        name: 'Marcus Reed',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoct_ILq-9VwV7HOnca-h6qyL7KpRVdqq2EJ39OGuTwR-TCDZAethKGycZFw1KGTW8wFB8mtt5iJ3m9hz7WaS8f5WV8A0Y0pgBwI2_z1ZcqoYfyJBf5SdnSarU831n5BCysFWtlFlEVRQOClEbFE2q454HKS8HvUod7TodDyzOxvFVo5OfxjuRW-BdOsI4-tUtiRJYGbZDVZ438lx0uS_0FyWzXl8Z1v_cubRHDdJEwf3H25ouMOc6DkngzmX9VaKo8tW-HAoLmMRd'
      }
    ]
  },
  {
    id: 'proj-2',
    title: 'Website Redesign',
    description: 'Complete overhaul of the customer-facing dashboard.',
    progress: 32,
    status: 'At Risk' as const,
    iconName: 'Laptop',
    assignees: [
      {
        name: 'Alex Rivera',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmuKIdjaRjFjcn3G4hBox2tvmorQ7v7xa7C4Jce2HHV-AcD3SwaDRgPW1gdX1B4DwnIaHO_FlfC3ycRUVvQZhAcUbebSwc4tGU6ApIG_JOni70TgSzB7QF4rwLbht4mGtcFvl_axfhjk1g0nuqV9SDY0J57gzTTqu3cu_RHTJjXOTswNw-zJQDcGfSWhTh6RQ_Bj0q2ZmC5tDrHKjQgNiqrXNegp3RyM69BzlvtUgb2CZw4kD2AiQxE24ajFhSWUpYHEBpxLy8_qcC'
      }
    ]
  },
  {
    id: 'proj-3',
    title: 'Sajek Valley Logistics',
    description: 'Optimizing supply routes for high-altitude operations.',
    progress: 12,
    status: 'Planning' as const,
    iconName: 'Truck',
    assignees: [
      {
        name: 'Aron Khan',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhRytWhO0JSCKbMOCzA2vV03AQzVEUSRjNfmr_W52r1fyp8QjDUyTko8kEyCI9vcqUVoiHCTWTl8EtgB66sEx8B-UzMRkgrQKJNs_MKMpBUfN6d2ioAOFqxEnomoMIxizAuxpQJRE_IRDebCOxANjEG3-iP2_luGVysWeNjdhLgbTZ2FwlekYZ4-RRJJ_TpkC3tRkJUSMOm_-3f8N_d5a3Pzgc_Do7eqvj4z3WeTZvYeXAmDzHhil4PMLiO5H6WrfE-iP56YtleTn2'
      },
      {
        name: 'Tania Das',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA88-4JhtY-2tmhNXHq8gWRl8p55DvbIabo49uKAftAX-qROaq6yV_F-Lij-Bl5gcQ5_q0xb5GBcAltK006M63H6V6UYGylLlBMKqfHZ653cxMbAFkSHVNz7gIxBQJuw4M_P6ELHbik1SfULfKpf-LXES8prXG-B44Q-quspk7kmNAPILr8ZBRBV878bmSCGs9Sy9bGZaRxYBoJACdn2LzLEK3eAbFF1wphod75avKe66_Gcj6xpcBE3y7gUg41YSkF8nf9vaDGrg6F'
      }
    ]
  }
];

const MOCK_TASKS = [
  {
    id: 'task-1',
    title: 'Finalize Q2 Media Plan',
    project: 'Q2 Marketing',
    priority: 'Critical' as const,
    status: 'In Progress' as const,
    due_date: 'May 12, 2024',
    assigned_to: {
      name: 'Jane Smith',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAadean69DMUPfMGi3j01jPV9fruDKwoFuXLfYXY17WbRJ4TEtvsts7BMSgYcX6RLE2ocwtAnX3UblhYRxzX-uhTUpbWajMF3ZTbCX14ZjfLeBt08luxMFEDtV39sD-x4WCo2hcIaaIcTRRheWoRW4ZM06B2a5D5zeGvwLOO51f6nmShByOhCKLPOc_RExivMjmjg62hAVJjOGIs9GYILRXzt2oku7b1Uz3sc28b7DRIpOBdtiZSoV502iwq8ZZtsQzp865vnBmyT4S'
    }
  },
  {
    id: 'task-2',
    title: 'UI Design for Auth Flow',
    project: 'Website Redesign',
    priority: 'High' as const,
    status: 'Not Started' as const,
    due_date: 'May 15, 2024',
    assigned_to: {
      name: 'Marcus Reed',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCbUK-eNDXmTDE9NW5Q05gRKKP5XuXfolLD-hKZf5PVyr1Uy0L2T3Ij4LGZ6GjxFcKNjaqtEdtCtKHVqOW51LjJdfam8w97lvo-Gzn9-Q94J7vQa68G6JwJGhiRi-grvBI2QTh_v51hBAx2ZdwbS7N6pHlJSqWKZYT0L9sMp1E5pW9zeCMT9ZF3A5gobTHcLfQnHsjlTtfXIXnxJ5ImGluJd3kmIQOp08ca7CZcKkJNNrI0rz7Jtf1cn5t3oNAvQtxlFiGOcYHf2wO'
    }
  },
  {
    id: 'task-3',
    title: 'Route mapping Sajek Sector 1',
    project: 'Sajek Logistics',
    priority: 'Medium' as const,
    status: 'Completed' as const,
    due_date: 'May 05, 2024',
    assigned_to: {
      name: 'Aron Khan',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhRytWhO0JSCKbMOCzA2vV03AQzVEUSRjNfmr_W52r1fyp8QjDUyTko8kEyCI9vcqUVoiHCTWTl8EtgB66sEx8B-UzMRkgrQKJNs_MKMpBUfN6d2ioAOFqxEnomoMIxizAuxpQJRE_IRDebCOxANjEG3-iP2_luGVysWeNjdhLgbTZ2FwlekYZ4-RRJJ_TpkC3tRkJUSMOm_-3f8N_d5a3Pzgc_Do7eqvj4z3WeTZvYeXAmDzHhil4PMLiO5H6WrfE-iP56YtleTn2'
    }
  },
  {
    id: 'task-4',
    title: 'Security Audit - Batch V2',
    project: 'Internal Systems',
    priority: 'Critical' as const,
    status: 'Review' as const,
    due_date: 'May 18, 2024',
    assigned_to: {
      name: 'Tania Das',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQLroR7M31RmB1uNQJmeeU2ndqs46iGqSeu8oZh2IlksTmLKvdi38A55e9Tj8ZqYoScoXtDQcUwKm9JxASy2iIsq3N6pj8iqv-dVFNm_oHj-zEH0lKRTHsmZmGum6HFkmnGQO_2dyU5mdJY1mSchUiLp6ky_7WEW3cJOOxzMrFycaE7UUwbEiboMH5ozpI8UJdLjFTYRGoI9wUIuV94HaY9fsaq-KUx-D8uolqRpK8LrKql3nAU4N3t0t_TAr9A9W4z7933V_jWAj_'
    }
  }
];

export default function WorkManagementPage() {
  return (
    <div className="space-y-xl">
      {/* Page Header Breadcrumbs & Action Bar */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xxl">
        <div>
          <nav className="flex items-center text-label text-outline mb-xs">
            <span>Work</span>
            <ChevronRight className="w-3.5 h-3.5 mx-xs" />
            <span className="text-on-surface-variant font-medium">Projects & Tasks</span>
          </nav>
          <h2 className="text-h1 text-on-background">Projects & Tasks</h2>
        </div>
        
        {/* Actions Button */}
        <div>
          <button className="flex items-center gap-xs bg-primary hover:bg-primary/90 text-white px-xl py-sm rounded-none border border-primary/20 hover:shadow-md transition-all text-h4 font-bold tracking-wide active:scale-95">
            <Plus className="w-5 h-5" />
            <span>Create New</span>
          </button>
        </div>
      </section>

      {/* Project Overview Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xxl">
        {MOCK_PROJECTS.map((project) => (
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

      {/* Active Tasks list table section */}
      <section className="mt-xxl">
        <TaskList tasks={MOCK_TASKS} />
      </section>

      {/* Contextual Floating Action Button (FAB) */}
      <button 
        className="fixed bottom-xl right-xl w-14 h-14 bg-primary hover:bg-primary-container rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all z-50 focus:outline-none"
        title="Add new task"
      >
        <PlusCircle className="w-7 h-7" />
      </button>
    </div>
  );
}
