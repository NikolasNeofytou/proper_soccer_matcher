'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegister } from '@/lib/hooks/use-auth';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(['player', 'pitch_owner']),
    agreeToTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'player' | 'pitch_owner'>('player');
  const { mutate: register, isPending, error } = useRegister();

  const {
    register: registerField,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'player',
    },
  });

  const handleRoleChange = (role: 'player' | 'pitch_owner') => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, agreeToTerms, ...registerData } = data;
    register(registerData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Create Your Account</CardTitle>
          <CardDescription>Join thousands of soccer enthusiasts worldwide</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-error bg-error/10 border border-error/20 rounded-lg">
                {(error as any)?.response?.data?.message || 'Registration failed'}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange('player')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedRole === 'player'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-semibold mb-1">Player</div>
                  <div className="text-sm text-muted-foreground">Looking to book pitches and find matches</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('pitch_owner')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedRole === 'pitch_owner'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-semibold mb-1">Pitch Owner</div>
                  <div className="text-sm text-muted-foreground">Manage and rent out my pitches</div>
                </button>
              </div>
              <input type="hidden" {...registerField('role')} />
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                error={errors.firstName?.message}
                {...registerField('firstName')}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                error={errors.lastName?.message}
                {...registerField('lastName')}
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...registerField('email')}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              helperText="Optional - for booking confirmations"
              error={errors.phoneNumber?.message}
              {...registerField('phoneNumber')}
            />

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  error={errors.password?.message}
                  {...registerField('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-sm text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                error={errors.confirmPassword?.message}
                {...registerField('confirmPassword')}
              />
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-2">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-border"
                  {...registerField('agreeToTerms')}
                />
                <span className="text-sm text-muted-foreground">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-sm text-error">{errors.agreeToTerms.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isPending}>
              Create Account
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
