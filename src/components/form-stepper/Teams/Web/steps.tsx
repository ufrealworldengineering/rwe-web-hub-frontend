import { useFormContext, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import {
    RadioGroup,
    RadioGroupItem,
} from '@/components/ui/radio-group';
import type { FormStepDefinition } from '@/components/form-stepper/formstepper';
import { Globe } from 'lucide-react';

// NOTE: These are the SWE STEPS, meaning they are the served only if SWE team is selected

export const Step1SWE = () => {
    const methods = useFormContext();
    const { formState, control } = methods;
    const errors = formState.errors ?? {};

    return (
        <div className='space-y-4'>
            <h2 className='text-lg font-medium'>Software Design Team</h2>
            <div>
                <Label htmlFor='swe_team'>Which team are you applying for?</Label>
                <Controller
                    control={control}
                    name='swe_team'
                    rules={{ required: 'Team is required' }}
                    render={({ field: { value, onChange } }) => (
                        <RadioGroup
                            value={value}
                            onValueChange={onChange}
                            className='mt-1'
                        >
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="web_dev" id="r1" />
                                <Label htmlFor="r1">Web Development</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="smart_glasses" id="r2" />
                                <Label htmlFor="r2">Smart Glasses</Label>
                            </div>
                        </RadioGroup>
                    )}
                />
                {errors.swe_team && <p className='text-sm text-red-500'>{String(errors.swe_team?.message)}</p>}
            </div>
        </div>
    );
};

export const webSteps: FormStepDefinition[] = [
    {
        id: 'details',
        label: { icon: Globe, label: 'Software Team', subcontent: 'Team application details' },
        Component: Step1SWE
    }
];