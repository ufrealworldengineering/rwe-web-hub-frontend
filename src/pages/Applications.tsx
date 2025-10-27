import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { FormStepper } from '@/components/form-stepper/formstepper';
import type { FormStepDefinition } from '@/components/form-stepper/formstepper';

import { defaultSteps } from '@/components/form-stepper/Teams/Default/steps';
import { generalSteps } from '@/components/form-stepper/Teams/General/steps';
import { droneSteps } from '@/components/form-stepper/Teams/Drone/steps';
import { webSteps } from '@/components/form-stepper/Teams/Web/steps';
import { ebikeSteps } from '@/components/form-stepper/Teams/EBike/steps';
import { armSteps } from '@/components/form-stepper/Teams/RobotArm/steps';

// Import all steps from each team to dynamically render steps
const teamMap: Record<string, FormStepDefinition[]> = {
    general: generalSteps,
    drone: droneSteps,
    web: webSteps,
    ebike: ebikeSteps,
    robotarm: armSteps,
};

const Applications = () => {
    const methods = useForm({ defaultValues: { team: 'default' } });
    const { watch, reset } = methods;

    const [steps, setSteps] = useState<FormStepDefinition[]>([...defaultSteps]);

    // Watch 'team' field to detect when selected team changes
    const selectedTeam = watch('team');

    // If <Select>'ed team changes, swap step array to new team
    useEffect(() => {
        const selected = selectedTeam ?? 'default';
        const newSteps = [...defaultSteps, ...(teamMap[selected] ?? [])]; // example: default steps + team-specific
        setSteps(newSteps);

        // Reset form the prev selected team field so values don't carry over
        const prev = { team: selected };
        reset(prev);
    }, [selectedTeam, reset]);

    const handleSubmit = (values: any) => {
        console.log('Collected values from all steps:', values);
        // TODO: check if all required information has been filled, redirect or highlight step if not
        // TODO: send form submission to backend/email
    };

    return (
        <section className='py-6'>
            <div className='max-w-3xl mx-auto px-4'>
                <div>
                    <div className='flex flex-col items-center px-6 py-5'>
                        <div>
                            <p className='text-3xl font-semibold text-text-secondary'>join our design teams</p>
                        </div>
                        <div>
                            <h1 className='text-6xl font-bold'>APPLY NOW!</h1>
                        </div>
                    </div>

                    <FormStepper
                        steps={steps}
                        onSubmit={handleSubmit}
                        form={methods}
                    />
                </div>
            </div>
        </section>
    );
}

export default Applications;