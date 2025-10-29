import { useFormContext, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    RadioGroup,
    RadioGroupItem,
} from '@/components/ui/radio-group';
import type { FormStepDefinition } from '@/components/form-stepper/formstepper';
import { Drone } from 'lucide-react';
import { Input } from '@/components/ui/input';

// NOTE: These are the EBIKE STEPS, meaning they are the served only if EBIKE team is selected

export const Step1Drone = () => {
    const methods = useFormContext();
    const { register, formState, control } = methods;
    const errors = formState.errors ?? {};

    return (
        <div className='space-y-4'>
            <h2 className='text-lg font-medium'>Drone Design Team</h2>
            <div>
                <Label>Do you have solidworks (or other relevant CAD software) experience?</Label>
                <Textarea
                    id='drone_experience1'
                    placeholder='Describe briefly...'
                    {...register('drone_experience1', { maxLength: { value: 100, message: 'Maximum 100 characters' } })}
                    className='mt-1 bg-background-tertiary'
                />
                {errors.drone_experience1 && <p className='text-sm text-red-500'>{String(errors.drone_experience1?.message)}</p>}
            </div>
            <div>
                <Label>Do you have experience with Arduino or STM32 Microcontrollers?</Label>
                <Textarea
                    id='drone_experience2'
                    placeholder='Describe briefly...'
                    {...register('drone_experience2', { maxLength: { value: 100, message: 'Maximum 100 characters' } })}
                    className='mt-1 bg-background-tertiary'
                />
                {errors.drone_experience2 && <p className='text-sm text-red-500'>{String(errors.drone_experience2?.message)}</p>}
            </div>
            <div>
                <Label>Do you have 3D printing experience?</Label>
                <Textarea
                    id='drone_experience3'
                    placeholder='Describe briefly...'
                    {...register('drone_experience3', { maxLength: { value: 100, message: 'Maximum 100 characters' } })}
                    className='mt-1 bg-background-tertiary'
                />
                {errors.drone_experience3 && <p className='text-sm text-red-500'>{String(errors.drone_experience3?.message)}</p>}
            </div>
            <div>
                <Label>Do you have experience piloting?</Label>
                <Textarea
                    id='drone_experience4'
                    placeholder='Describe briefly...'
                    {...register('drone_experience4', { maxLength: { value: 100, message: 'Maximum 100 characters' } })}
                    className='mt-1 bg-background-tertiary'
                />
                {errors.drone_experience4 && <p className='text-sm text-red-500'>{String(errors.drone_experience4?.message)}</p>}
            </div>
            <div>
                <Label htmlFor='drone_availability'>Are you available on Wednesdays at 5:15pm-7pm?</Label>
                <Controller
                    control={control}
                    defaultValue=""
                    name='drone_availability'
                    rules={{ required: 'Availability is required' }}
                    render={({ field: { value, onChange } }) => (
                        <>
                            <RadioGroup
                                value={value}
                                onValueChange={onChange}
                                className='mt-1'
                                aria-label="Drone availability"
                            >
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="yes" id="r1" />
                                    <Label htmlFor="r1">Yes</Label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="no" id="r2" />
                                    <Label htmlFor="r2">No</Label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="other" id="r3" />
                                    <Label htmlFor="r3">Other</Label>
                                </div>
                            </RadioGroup>

                            {/* Show other input option when 'other' is selected */}
                            {value === 'other' && (
                                <>
                                    <Controller
                                        control={control}
                                        name="drone_availability_other"
                                        defaultValue=""
                                        rules={{
                                            validate: (val) => {
                                                // require text only when 'other' is selected
                                                const availability = methods.getValues('drone_availability');
                                                if (availability === 'other') {
                                                    return (val && val.trim().length > 0) || 'Please describe your availability';
                                                }
                                                return true;
                                            }
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="drone_availability_other"
                                                placeholder="Please describe your availability (days/times)"
                                                className="mt-1 bg-background-tertiary"
                                            />
                                        )}
                                    />
                                    {errors.drone_availability_other && (
                                        <p className='text-sm text-red-500'>{String(errors.drone_availability_other?.message)}</p>
                                    )}
                                </>
                            )}
                        </>
                    )}
                />
                {errors.drone_availability && <p className='text-sm text-red-500'>{String(errors.drone_availability?.message)}</p>}
            </div>
        </div >
    );
};

export const droneSteps: FormStepDefinition[] = [
    {
        id: 'details',
        label: { icon: Drone, label: 'Drone Team', subcontent: 'Team application details' },
        Component: Step1Drone
    }
];