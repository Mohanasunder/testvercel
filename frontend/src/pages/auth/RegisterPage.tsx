import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../../schemas/authSchema';
import { useRegister } from '../../hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data, {
      onSuccess: () => navigate('/'),
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card title="Create Account" className="w-full max-w-md shadow-2xl">
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
            <label htmlFor="username" className="block mb-1 text-sm font-medium">
              Username
            </label>
            <InputText id="username" {...register('username')} className="w-full" />
            {errors.username && (
              <Message severity="error" text={errors.username.message} className="mt-1" />
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
              toggleMask
            />
            {errors.password && (
              <Message severity="error" text={errors.password.message} className="mt-1" />
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium">
              Confirm Password
            </label>
            <Password
              id="confirmPassword"
              {...register('confirmPassword')}
              className="w-full"
              feedback={false}
              toggleMask
            />
            {errors.confirmPassword && (
              <Message severity="error" text={errors.confirmPassword.message} className="mt-1" />
            )}
          </div>
          {registerMutation.isError && (
            <Message
              severity="error"
              text={(registerMutation.error as any)?.response?.data?.detail || 'Registration failed'}
            />
          )}
          <Button
            type="submit"
            label="Register"
            loading={registerMutation.isPending}
            className="w-full"
          />
          <p className="text-sm text-center">
            Already have an account?{' '}
            <Button link label="Sign In" onClick={() => navigate('/login')} />
          </p>
        </form>
      </Card>
    </div>
  );
}
