import { z } from 'zod';

export const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.string().min(1, 'Role is required'),
});

export const milestoneSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  due_date: z.string().optional(),
  status: z.string().default('pending'),
});

export const projectCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  client: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  team_members: z.array(teamMemberSchema).min(1, 'At least one team member is required'),
  milestones: z.array(milestoneSchema).min(1, 'At least one milestone is required'),
});

export const projectUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  client: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export type ProjectCreateFormData = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateFormData = z.infer<typeof projectUpdateSchema>;
export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
export type MilestoneFormData = z.infer<typeof milestoneSchema>;
