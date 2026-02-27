export type EffortSize = 'S' | 'M' | 'L' | 'XL';

export type ProjectStatus =
  | 'draft'
  | 'analyzing'
  | 'approved'
  | 'backlog'
  | 'in_progress'
  | 'qa'
  | 'prod';

export interface Project {
  id: string;
  created_at: string;
  title: string;
  description: string;
  business_value: string;
  impact_score: number;
  urgency_score: number;
  effort_size: EffortSize;
  calculated_priority: number;
  status: ProjectStatus;
}
