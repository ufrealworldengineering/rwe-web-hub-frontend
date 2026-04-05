import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { FormStepDefinition } from '@/components/form-stepper/formstepper';
import { useTeams } from '@/api/hooks/useTeams';
import { User, FileInput } from 'lucide-react';

// NOTE: These are the DEFAULT STEPS, meaning they are the first step for all applications
//       rendered through the /Applications.tsx page.

export const Step1Default = () => {
    const methods = useFormContext();
    const { register, formState, control } = methods;
    const errors = formState.errors ?? {};

    // Fetch available teams
    const { data: teams = [] } = useTeams({ active_only: true });

    return (
        <div className='space-y-4' id='default_1'>
            <h2 className='text-lg font-medium'>Member Profile</h2>
            <div>
                <Label htmlFor='first_name'>First Name</Label>
                <Input
                    id='first_name'
                    placeholder='e.g., John'
                    {...register('first_name', { required: 'First name is required' })}
                    className='mt-1 bg-background-tertiary'
                />
                {errors.first_name && <p className='text-sm text-background-accent-secondary'>{String(errors.first_name?.message)}</p>}
            </div>
            <div>
                <Label htmlFor='last_name'>Last Name</Label>
                <Input
                    id='last_name'
                    placeholder='e.g., Smith'
                    {...register('last_name', { required: 'Last name is required' })}
                    className='mt-1 bg-background-tertiary'
                />
                {errors.last_name && <p className='text-sm text-background-accent-secondary'>{String(errors.last_name?.message)}</p>}
            </div>
            <div>
                <Label htmlFor='email'>UFL Email</Label>
                <Input
                    id='email'
                    placeholder='e.g., john.smith@ufl.edu'
                    {...register('email', { required: 'Email is required', minLength: { value: 3, message: 'At least 3 characters' } })}
                    className='mt-1 bg-background-tertiary'
                />
                {errors.email && <p className='text-sm text-background-accent-secondary'>{String(errors.email?.message)}</p>}
            </div>
            <div>
                <Label>Major</Label>
                <Input
                    id='major'
                    placeholder='e.g., Mechanical Engineering'
                    {...register('major', { required: 'Major is required' })}
                    className='mt-1 bg-background-tertiary'
                />
                {errors.major && <p className='text-sm text-background-accent-secondary'>{String(errors.major?.message)}</p>}
            </div>
            <div>
                <Label>Year</Label>
                <Controller
                    control={control}
                    name='year'
                    defaultValue='default'
                    rules={{
                        validate: value => value !== 'default' || 'Please choose your year'
                    }}
                    render={({ field: { value, onChange } }) => (
                        <Select onValueChange={onChange} value={value}>
                            <SelectTrigger className='mt-1 bg-background-tertiary'>
                                <SelectValue placeholder='Choose...' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='default'>Choose...</SelectItem>
                                <SelectItem value='first'>First</SelectItem>
                                <SelectItem value='second'>Second</SelectItem>
                                <SelectItem value='third'>Third</SelectItem>
                                <SelectItem value='fourth'>Fourth</SelectItem>
                                <SelectItem value='other'>Other</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.year && <p className='text-sm text-background-accent-secondary'>{String(errors.year?.message)}</p>}
            </div>
            <div>
                <Label>Design Team</Label>
                <Controller
                    control={control}
                    name='team_id'
                    defaultValue='default'
                    rules={{
                        validate: value => value !== 'default' || 'Please choose a team'
                    }}
                    render={({ field: { value, onChange } }) => (
                        <Select onValueChange={onChange} value={value}>
                            <SelectTrigger className='mt-1 bg-background-tertiary'>
                                <SelectValue placeholder='Choose...' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='default'>Choose...</SelectItem>
                                {teams.map((team) => (
                                    <SelectItem key={team.id} value={team.id}>
                                        {team.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.team_id && <p className='text-sm text-background-accent-secondary'>{String(errors.team_id?.message)}</p>}
            </div>
        </div>
    );
};

export const Step2Default = () => {
    const methods = useFormContext();
    const { register, formState } = methods;
    const errors = formState.errors ?? {};

    return (
        <div className='space-y-4' id='default_2'>
            <h2 className='text-lg font-medium'>Key Information</h2>
            <div>
                <Label htmlFor='resume'>Please upload your resume</Label>
                {/* py-2 because the "Browse..."" text isn't centered by default */}
                <Input
                    id='resume'
                    type='file'
                    {...register('resume', { required: 'Resume is required' })}
                    className='mt-1 bg-background-tertiary py-2'
                />
                {errors.resume && <p className='text-sm text-background-accent-secondary'>{String(errors.resume?.message)}</p>}
            </div>
            <div>
                <Label htmlFor='experience'>Describe your experiences (past projects, applicable classes, etc.)</Label>
                <Textarea
                    id='experience'
                    placeholder='...'
                    {...register('experience', { required: 'Experience is required', maxLength: { value: 400, message: 'Maximum 400 characters' } })}
                    className='mt-1 bg-background-tertiary'
                />
                {errors.experience && <p className='text-sm text-background-accent-secondary'>{String(errors.experience?.message)}</p>}
            </div>
            <div>
                <Label>How did you hear about us?</Label>
                <Input
                    id='how_heard'
                    placeholder='...'
                    {...register('how_heard', { required: 'Please tell us how you heard about RWE' })}
                    className='mt-1 bg-background-tertiary'
                />
                {errors.how_heard && <p className='text-sm text-background-accent-secondary'>{String(errors.how_heard?.message)}</p>}
            </div>
            <div>
                <Label>
                    By submitting this application, I grant permission for my application materials to be
                    shared with the design team's recruitment committee and/or the Real World
                    Engineering executive committee for the purpose of evaluating my eligibility for the team. I
                    understand that my information will be used only for this selection process and will not be
                    shared beyond the authorized reviewers.
                </Label>
                <Input
                    id='consent'
                    placeholder='e.g., John Smith'
                    {...register('consent', { required: 'Type your full, legal name to consent' })}
                    className='mt-1 bg-background-tertiary'
                />
                {errors.consent && <p className='text-sm text-background-accent-secondary'>{String(errors.consent?.message)}</p>}
            </div>
        </div>
    );
};

export const defaultSteps: FormStepDefinition[] = [
    {
        id: 'member',
        label: { icon: User, label: 'Profile', subcontent: 'Basic personal information' },
        Component: Step1Default
    },
    {
        id: 'submission',
        label: { icon: FileInput, label: 'Submission', subcontent: 'Application review and submission' },
        Component: Step2Default
    }
];