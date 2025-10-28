import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    RadioGroup,
    RadioGroupItem,
} from '@/components/ui/radio-group';
import type { FormStepDefinition } from '@/components/form-stepper/formstepper';
import { FileText } from 'lucide-react';

export const Step1General = () => {
    const methods = useFormContext();
    const { register, formState, control } = methods;
    const errors = formState.errors ?? {};

    return (
        <div className='space-y-4'>
            <h2 className='text-lg font-medium'>General Application</h2>
            <div>
                <Label htmlFor='onboarding' className='font-semibold'>Would you like to join an onboarding team?</Label>
                <Label className='mt-1'>
                    The RWE onboarding process is a 4 week process where you'll be walked through a basic engineering project. Perfect for freshmen or anyone looking for an introduction to engineering design a low-stakes learning environment.
                </Label>
                <Controller
                    control={control}
                    defaultValue=""
                    name='onboarding'
                    rules={{ required: 'Please select an onboarding option' }}
                    render={({ field: { value, onChange } }) => (
                        <RadioGroup
                            value={value}
                            onValueChange={onChange}
                            className='mt-1'
                            aria-label="Team onboarding"
                        >
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="yes" id="r1" />
                                <Label htmlFor="r1">Yes</Label>
                            </div>

                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="no" id="r2" />
                                <Label htmlFor="r2">No</Label>
                            </div>
                        </RadioGroup>
                    )}
                />
                {errors.onboarding && <p className='text-sm text-red-500'>{String(errors.onboarding?.message)}</p>}
            </div>
            <div>
                <Label htmlFor='first_choice_team' className='font-semibold'>What is your first chice team?</Label>
                <Controller
                    control={control}
                    defaultValue=""
                    name='first_choice_team'
                    rules={{ required: 'First choice is required' }}
                    render={({ field: { value, onChange } }) => (
                        <RadioGroup
                            value={value}
                            onValueChange={onChange}
                            className='mt-1'
                            aria-label="first_choice_team"
                        >
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="drone" id="r1" />
                                <Label htmlFor="r1">Drone Design Team</Label>
                            </div>

                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="robot_arm" id="r2" />
                                <Label htmlFor="r2">Robot Arm Design Team</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="ebike" id="r3" />
                                <Label htmlFor="r1">E-Bike Design Team</Label>
                            </div>

                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="software" id="r4" />
                                <Label htmlFor="r2">Software Design Team</Label>
                            </div>
                        </RadioGroup>
                    )}
                />
                {errors.first_choice_team && <p className='text-sm text-red-500'>{String(errors.first_choice_team?.message)}</p>}
            </div>
            <div>
                <Label htmlFor='second_choice_team' className='font-semibold'>What is your second choice team?</Label>
                <Controller
                    control={control}
                    defaultValue=""
                    name='second_choice_team'
                    rules={{ required: 'Second choice is required' }}
                    render={({ field: { value, onChange } }) => (
                        <RadioGroup
                            value={value}
                            onValueChange={onChange}
                            className='mt-1'
                            aria-label="Cecond choice team"
                        >
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="drone" id="r1" />
                                <Label htmlFor="r1">Drone Design Team</Label>
                            </div>

                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="robot_arm" id="r2" />
                                <Label htmlFor="r2">Robot Arm Design Team</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="ebike" id="r3" />
                                <Label htmlFor="r1">E-Bike Design Team</Label>
                            </div>

                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="software" id="r4" />
                                <Label htmlFor="r2">Software Design Team</Label>
                            </div>
                        </RadioGroup>
                    )}
                />
                {errors.second_choice_team && <p className='text-sm text-red-500'>{String(errors.second_choice_team?.message)}</p>}
            </div>
            <div>
                <Label htmlFor='team_choice_explanation'>Why did you choose these options?</Label>
                <Input
                    id='team_choice_explanation'
                    placeholder='...'
                    {...register('team_choice_explanation', { required: 'Explanation is required', maxLength: { value: 50, message: 'Maximum 50 words' } })}
                    className='mt-1 bg-background-tertiary'
                />
                {errors.team_choice_explanation && <p className='text-sm text-red-500'>{String(errors.team_choice_explanation?.message)}</p>}
            </div>
        </div>
    );
};

export const generalSteps: FormStepDefinition[] = [
    {
        id: 'details',
        label: { icon: FileText, label: 'General Application', subcontent: 'Team application details' },
        Component: Step1General
    }
];