import { Outlet, useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../hooks/useAuth';

export default function Layout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const items = [
    {
      label: 'Projects',
      icon: 'pi pi-folder',
      command: () => navigate('/projects'),
    },
    {
      label: 'New Project',
      icon: 'pi pi-plus',
      command: () => navigate('/projects/new'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Menubar
        model={items}
        start={
          <span
            className="text-xl font-bold ml-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            Consenz
          </span>
        }
        end={
          <div className="flex items-center gap-3 mr-2">
            <span className="text-sm text-gray-600">{user?.username || user?.email}</span>
            <Button
              icon="pi pi-sign-out"
              text
              severity="secondary"
              tooltip="Logout"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            />
          </div>
        }
      />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
