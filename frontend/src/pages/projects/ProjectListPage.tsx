import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useProjects, useDeleteProject } from '../../hooks/useProjects';

export default function ProjectListPage() {
  const navigate = useNavigate();
  const { data: projects, isLoading } = useProjects();
  const deleteProject = useDeleteProject();

  const confirmDelete = (id: string, title: string) => {
    confirmDialog({
      message: `Delete "${title}"?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteProject.mutate(id),
    });
  };

  const actionsBody = (row: any) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-eye"
        text
        severity="info"
        tooltip="View"
        onClick={() => navigate(`/projects/${row.id}`)}
      />
      <Button
        icon="pi pi-pencil"
        text
        severity="secondary"
        tooltip="Edit"
        onClick={() => navigate(`/projects/${row.id}/edit`)}
      />
      <Button
        icon="pi pi-trash"
        text
        severity="danger"
        tooltip="Delete"
        onClick={() => confirmDelete(row.id, row.title)}
      />
    </div>
  );

  const dateBody = (row: any, field: string) =>
    row[field] ? new Date(row[field]).toLocaleDateString() : '-';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button
          label="New Project"
          icon="pi pi-plus"
          onClick={() => navigate('/projects/new')}
        />
      </div>
      <Card>
        <DataTable
          value={projects || []}
          loading={isLoading}
          paginator
          rows={10}
          emptyMessage="No projects found"
        >
          <Column field="title" header="Title" sortable />
          <Column field="client" header="Client" sortable />
          <Column
            field="start_date"
            header="Start Date"
            body={(r) => dateBody(r, 'start_date')}
            sortable
          />
          <Column
            field="end_date"
            header="End Date"
            body={(r) => dateBody(r, 'end_date')}
            sortable
          />
          <Column
            header="Team"
            body={(r: any) => (
              <Tag value={`${r.team_members?.length || 0} members`} severity="info" />
            )}
          />
          <Column
            header="Milestones"
            body={(r: any) => (
              <Tag value={`${r.milestones?.length || 0}`} severity="warning" />
            )}
          />
          <Column header="Actions" body={actionsBody} style={{ width: '140px' }} />
        </DataTable>
      </Card>
      <ConfirmDialog />
    </div>
  );
}
