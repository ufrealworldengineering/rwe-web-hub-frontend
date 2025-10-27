import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FormStepDefinition } from '@/components/form-stepper/formstepper';
import { FileText } from 'lucide-react';

export const Step1General = () => {
    const methods = useFormContext();
    const { register, formState } = methods;
    const errors = formState.errors ?? {};

    return (
        <div className='space-y-4'>
            <h2 className='text-lg font-medium'>Member Profile</h2>
            <div>
                <Label htmlFor='fullName'>Full name</Label>
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
        </div>
    );
};

export const generalSteps: FormStepDefinition[] = [
    {
        id: 'details',
        label: { icon: FileText, label: 'Details', subcontent: 'More details' },
        Component: Step1General
    }
];