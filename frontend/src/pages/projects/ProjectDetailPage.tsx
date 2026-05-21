import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProject, useDeleteProject } from '../../hooks/useProjects';
import {
  useTeamMembers,
  useCreateTeamMember,
  useDeleteTeamMember,
} from '../../hooks/useTeamMembers';
import {
  useMilestones,
  useCreateMilestone,
  useDeleteMilestone,
} from '../../hooks/useMilestones';
import { teamMemberSchema, milestoneSchema } from '../../schemas/projectSchema';
import type { TeamMemberFormData, MilestoneFormData } from '../../schemas/projectSchema';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProject(id!);
  const deleteProject = useDeleteProject();
  const { data: teamMembers, refetch: refetchMembers } = useTeamMembers(id!);
  const { data: milestones, refetch: refetchMilestones } = useMilestones(id!);
  const createMember = useCreateTeamMember(id!);
  const deleteMember = useDeleteTeamMember(id!);
  const createMilestone = useCreateMilestone(id!);
  const deleteMilestone = useDeleteMilestone(id!);

  const [memberDialog, setMemberDialog] = useState(false);
  const [milestoneDialog, setMilestoneDialog] = useState(false);

  const memberForm = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: { name: '', email: '', role: '' },
  });

  const milestoneForm = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: { title: '', description: '', due_date: '', status: 'pending' },
  });

  const handleDeleteProject = () => {
    confirmDialog({
      message: `Delete "${project?.title}" permanently?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () =>
        deleteProject.mutate(id!, {
          onSuccess: () => navigate('/projects'),
        }),
    });
  };

  const handleAddMember = (data: TeamMemberFormData) => {
    createMember.mutate(data, {
      onSuccess: () => {
        setMemberDialog(false);
        memberForm.reset();
        refetchMembers();
      },
    });
  };

  const handleDeleteMember = (memberId: string) => {
    deleteMember.mutate(memberId, { onSuccess: () => refetchMembers() });
  };

  const handleAddMilestone = (data: MilestoneFormData) => {
    createMilestone.mutate(data, {
      onSuccess: () => {
        setMilestoneDialog(false);
        milestoneForm.reset();
        refetchMilestones();
      },
    });
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    deleteMilestone.mutate(milestoneId, { onSuccess: () => refetchMilestones() });
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!project) return <p className="text-center text-red-500">Project not found</p>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <p className="text-gray-500">
            {project.client && `Client: ${project.client} | `}
            {new Date(project.start_date).toLocaleDateString()} 
            {project.end_date && ` - ${new Date(project.end_date).toLocaleDateString()}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            label="Edit"
            icon="pi pi-pencil"
            severity="secondary"
            onClick={() => navigate(`/projects/${id}/edit`)}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            onClick={handleDeleteProject}
          />
        </div>
      </div>

      {project.description && (
        <Card title="Description" className="mb-4">
          <p>{project.description}</p>
        </Card>
      )}

      <Divider />

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Team Members</h2>
          <Button
            label="Add Member"
            icon="pi pi-plus"
            size="small"
            onClick={() => setMemberDialog(true)}
          />
        </div>
        <DataTable value={teamMembers || []} emptyMessage="No team members">
          <Column field="name" header="Name" />
          <Column field="email" header="Email" />
          <Column field="role" header="Role" />
          <Column
            header="Actions"
            body={(r: any) => (
              <Button
                icon="pi pi-trash"
                text
                severity="danger"
                size="small"
                onClick={() => handleDeleteMember(r.id)}
              />
            )}
            style={{ width: '80px' }}
          />
        </DataTable>
      </div>

      <Divider />

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Milestones</h2>
          <Button
            label="Add Milestone"
            icon="pi pi-plus"
            size="small"
            onClick={() => setMilestoneDialog(true)}
          />
        </div>
        <DataTable value={milestones || []} emptyMessage="No milestones">
          <Column field="title" header="Title" />
          <Column field="description" header="Description" />
          <Column
            field="due_date"
            header="Due Date"
            body={(r: any) =>
              r.due_date ? new Date(r.due_date).toLocaleDateString() : '-'
            }
          />
          <Column
            field="status"
            header="Status"
            body={(r: any) => (
              <Tag
                value={r.status}
                severity={
                  r.status === 'completed'
                    ? 'success'
                    : r.status === 'in_progress'
                    ? 'info'
                    : 'warn'
                }
              />
            )}
          />
          <Column
            header="Actions"
            body={(r: any) => (
              <Button
                icon="pi pi-trash"
                text
                severity="danger"
                size="small"
                onClick={() => handleDeleteMilestone(r.id)}
              />
            )}
            style={{ width: '80px' }}
          />
        </DataTable>
      </div>

      <Dialog
        header="Add Team Member"
        visible={memberDialog}
        onHide={() => setMemberDialog(false)}
        className="w-full max-w-md"
      >
        <form
          onSubmit={memberForm.handleSubmit(handleAddMember)}
          className="flex flex-col gap-3"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <InputText {...memberForm.register('name')} className="w-full" />
            {memberForm.formState.errors.name && (
              <Message severity="error" text={memberForm.formState.errors.name.message} className="mt-1" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <InputText {...memberForm.register('email')} className="w-full" />
            {memberForm.formState.errors.email && (
              <Message severity="error" text={memberForm.formState.errors.email.message} className="mt-1" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <InputText {...memberForm.register('role')} className="w-full" />
            {memberForm.formState.errors.role && (
              <Message severity="error" text={memberForm.formState.errors.role.message} className="mt-1" />
            )}
          </div>
          <Button type="submit" label="Add" loading={createMember.isPending} />
        </form>
      </Dialog>

      <Dialog
        header="Add Milestone"
        visible={milestoneDialog}
        onHide={() => setMilestoneDialog(false)}
        className="w-full max-w-md"
      >
        <form
          onSubmit={milestoneForm.handleSubmit(handleAddMilestone)}
          className="flex flex-col gap-3"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <InputText {...milestoneForm.register('title')} className="w-full" />
            {milestoneForm.formState.errors.title && (
              <Message severity="error" text={milestoneForm.formState.errors.title.message} className="mt-1" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <InputText {...milestoneForm.register('description')} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <InputText type="date" {...milestoneForm.register('due_date')} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <InputText {...milestoneForm.register('status')} className="w-full" />
          </div>
          <Button type="submit" label="Add" loading={createMilestone.isPending} />
        </form>
      </Dialog>

      <ConfirmDialog />
    </div>
  );
}
