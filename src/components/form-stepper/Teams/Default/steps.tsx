import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { FormStepDefinition } from '@/components/form-stepper/formstepper';
import { User } from 'lucide-react';

// NOTE: These are the DEFAULT STEPS, meaning they are the first step for all applications
//       rendered through the /Applications.tsx page.

export const Step1Default = () => {
    const methods = useFormContext();
    const { register, formState, control } = methods;
    const errors = formState.errors ?? {};

    return (
        <div className='space-y-4'>
            <h2 className='text-lg font-medium'>Member Profile</h2>
            <div>
                <Label htmlFor='fullName'>Full Name</Label>
                <Input
                    id='fullName'
                    placeholder='e.g., John Smith'
                    {...register('fullName', { required: 'Full name is required' })}
                    className='mt-1 bg-background-tertiary'
                />
                {errors.fullName && <p className='text-sm text-red-500'>{String(errors.fullName?.message)}</p>}
            </div>
            <div>
                <Label htmlFor='email'>UFL Email</Label>
                <Input
                    id='email'
                    placeholder='e.g., john.smith@ufl.edu'
                    {...register('email', { required: 'Email is required', minLength: { value: 3, message: 'At least 3 characters' } })}
                    className='mt-1 bg-background-tertiary'
                />
                {errors.email && <p className='text-sm text-red-500'>{String(errors.email?.message)}</p>}
            </div>
            <div>
                <Label>Major</Label>
                <Input
                    id='major'
                    placeholder='e.g., Mechanical Engineering'
                    {...register('major', { required: 'Major is required' })}
                    className='mt-1 bg-background-tertiary'
                />
                {errors.major && <p className='text-sm text-red-500'>{String(errors.major?.message)}</p>}
            </div>
            <div>
                <Label>Design Team</Label>
                <Controller
                    control={control}
                    name="team"
                    defaultValue="default"
                    rules={{
                      validate: value => value !== 'default' || 'Please choose a team'
                    }}
                    render={({ field: { value, onChange } }) => (
                        <Select onValueChange={onChange} value={value}>
                            <SelectTrigger className='mt-1 bg-background-tertiary'>
                                <SelectValue placeholder="Choose..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">Choose...</SelectItem>
                                <SelectItem value="general">General</SelectItem>
                                <SelectItem value="drone">Drone</SelectItem>
                                <SelectItem value="robotarm">Robot Arm</SelectItem>
                                <SelectItem value="ebike">E-Bike</SelectItem>
                                <SelectItem value="web">Web Dev</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.team && <p className="text-sm text-red-500">{String(errors.team?.message)}</p>}
            </div>
        </div>
    );
};

export const defaultSteps: FormStepDefinition[] = [
    {
        id: 'member',
        label: { icon: User, label: 'Profile', subcontent: 'Basic personal information' },
        Component: Step1Default
    }
];