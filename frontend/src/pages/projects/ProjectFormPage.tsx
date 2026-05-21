import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectCreateSchema, type ProjectCreateFormData } from '../../schemas/projectSchema';
import { useCreateProject, useProject, useUpdateProject } from '../../hooks/useProjects';

export default function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { data: existingProject } = useProject(id || '');
  const createProject = useCreateProject();
  const updateProject = useUpdateProject(id || '');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectCreateFormData>({
    resolver: zodResolver(projectCreateSchema),
    defaultValues: {
      title: '',
      description: '',
      client: '',
      start_date: '',
      end_date: '',
      team_members: [{ name: '', email: '', role: '' }],
      milestones: [{ title: '', description: '', due_date: '', status: 'pending' }],
    },
  });

  const {
    fields: memberFields,
    append: appendMember,
    remove: removeMember,
  } = useFieldArray({ control, name: 'team_members' });

  const {
    fields: milestoneFields,
    append: appendMilestone,
    remove: removeMilestone,
  } = useFieldArray({ control, name: 'milestones' });

  useEffect(() => {
    if (isEdit && existingProject) {
      reset({
        title: existingProject.title || '',
        description: existingProject.description || '',
        client: existingProject.client || '',
        start_date: existingProject.start_date
          ? new Date(existingProject.start_date).toISOString().split('T')[0]
          : '',
        end_date: existingProject.end_date
          ? new Date(existingProject.end_date).toISOString().split('T')[0]
          : '',
        team_members:
          existingProject.team_members?.map((m: any) => ({
            name: m.name,
            email: m.email,
            role: m.role,
          })) || [],
        milestones:
          existingProject.milestones?.map((m: any) => ({
            title: m.title,
            description: m.description || '',
            due_date: m.due_date ? new Date(m.due_date).toISOString().split('T')[0] : '',
            status: m.status,
          })) || [],
      });
    }
  }, [isEdit, existingProject, reset]);

  const onSubmit = (data: ProjectCreateFormData) => {
    const payload = {
      ...data,
      team_members: data.team_members.map((m) => ({
        ...m,
        email: m.email,
      })),
      milestones: data.milestones.map((m) => ({
        ...m,
        due_date: m.due_date || null,
      })),
    };

    if (isEdit) {
      updateProject.mutate(payload, {
        onSuccess: () => navigate(`/projects/${id}`),
      });
    } else {
      createProject.mutate(payload, {
        onSuccess: (created) => navigate(`/projects/${created.id}`),
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? 'Edit Project' : 'New Project'}
      </h1>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Title *</label>
            <InputText {...register('title')} className="w-full" />
            {errors.title && (
              <Message severity="error" text={errors.title.message} className="mt-1" />
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Description</label>
            <InputTextarea {...register('description')} className="w-full" rows={3} />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Client</label>
            <InputText {...register('client')} className="w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Start Date *</label>
              <InputText type="date" {...register('start_date')} className="w-full" />
              {errors.start_date && (
                <Message severity="error" text={errors.start_date.message} className="mt-1" />
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">End Date</label>
              <InputText type="date" {...register('end_date')} className="w-full" />
            </div>
          </div>

          <Divider align="left">Team Members *</Divider>
          {errors.team_members && (
            <Message severity="error" text="At least one team member is required" className="mb-2" />
          )}
          {memberFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-3 gap-2 items-start p-2 border rounded">
              <div>
                <label className="block text-xs font-medium">Name</label>
                <InputText {...register(`team_members.${index}.name`)} className="w-full" />
                {errors.team_members?.[index]?.name && (
                  <Message severity="error" text={errors.team_members[index]?.name?.message} className="mt-1" />
                )}
              </div>
              <div>
                <label className="block text-xs font-medium">Email</label>
                <InputText {...register(`team_members.${index}.email`)} className="w-full" />
                {errors.team_members?.[index]?.email && (
                  <Message severity="error" text={errors.team_members[index]?.email?.message} className="mt-1" />
                )}
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium">Role</label>
                  <InputText {...register(`team_members.${index}.role`)} className="w-full" />
                </div>
                <Button
                  icon="pi pi-trash"
                  text
                  severity="danger"
                  className="mt-5"
                  onClick={() => removeMember(index)}
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            label="Add Team Member"
            icon="pi pi-plus"
            text
            onClick={() => appendMember({ name: '', email: '', role: '' })}
          />

          <Divider align="left">Milestones *</Divider>
          {errors.milestones && (
            <Message severity="error" text="At least one milestone is required" className="mb-2" />
          )}
          {milestoneFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-4 gap-2 items-start p-2 border rounded">
              <div>
                <label className="block text-xs font-medium">Title</label>
                <InputText {...register(`milestones.${index}.title`)} className="w-full" />
                {errors.milestones?.[index]?.title && (
                  <Message severity="error" text={errors.milestones[index]?.title?.message} className="mt-1" />
                )}
              </div>
              <div>
                <label className="block text-xs font-medium">Description</label>
                <InputText {...register(`milestones.${index}.description`)} className="w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium">Due Date</label>
                <InputText type="date" {...register(`milestones.${index}.due_date`)} className="w-full" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium">Status</label>
                  <InputText {...register(`milestones.${index}.status`)} className="w-full" />
                </div>
                <Button
                  icon="pi pi-trash"
                  text
                  severity="danger"
                  className="mt-5"
                  onClick={() => removeMilestone(index)}
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            label="Add Milestone"
            icon="pi pi-plus"
            text
            onClick={() =>
              appendMilestone({ title: '', description: '', due_date: '', status: 'pending' })
            }
          />

          <div className="flex gap-2 justify-end mt-4">
            <Button
              type="button"
              label="Cancel"
              severity="secondary"
              onClick={() => navigate(-1)}
            />
            <Button
              type="submit"
              label={isEdit ? 'Update' : 'Create'}
              loading={createProject.isPending || updateProject.isPending}
            />
          </div>
        </form>
      </Card>
    </div>
  );
}
