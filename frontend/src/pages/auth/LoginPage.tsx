import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../../schemas/authSchema';
import { useLogin } from '../../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data, {
      onSuccess: () => navigate('/'),
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card title="Sign In" className="w-full max-w-md shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              Email
            </label>
            <InputText id="email" {...register('email')} className="w-full" />
            {errors.email && (
              <Message severity="error" text={errors.email.message} className="mt-1" />
            )}
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">
              Password
            </label>
            <Password
              id="password"
              {...register('password')}
              className="w-full"
              feedback={false}
              toggleMask
            />
            {errors.password && (
              <Message severity="error" text={errors.password.message} className="mt-1" />
            )}
          </div>
          {login.isError && (
            <Message
              severity="error"
              text={(login.error as any)?.response?.data?.detail || 'Login failed'}
            />
          )}
          <Button type="submit" label="Sign In" loading={login.isPending} className="w-full" />
          <p className="text-sm text-center">
            Don't have an account?{' '}
            <Button link label="Register" onClick={() => navigate('/register')} />
          </p>
        </form>
      </Card>
    </div>
  );
}
