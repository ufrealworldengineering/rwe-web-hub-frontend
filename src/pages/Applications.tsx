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
import { useSubmitApplication } from '@/api/hooks/useApplications';
import type { ApplicationCore } from '@/types/application';

// import all steps from each team to dynamically render steps
const teamMap: Record<string, FormStepDefinition[]> = {
    general: generalSteps,
    drone: droneSteps,
    web: webSteps,
    ebike: ebikeSteps,
    robotarm: armSteps,
};

const Applications = () => {
    const methods = useForm<ApplicationCore>({ defaultValues: { team_id: 'default', year: 'default' } });
    const { watch, reset, getValues } = methods;

    const [steps, setSteps] = useState<FormStepDefinition[]>([...defaultSteps]);

    const { submit, isPending, isSuccess, isError, error, reset: resetSubmit } = useSubmitApplication();

    // watch 'team' field to detect when selected team changes
    const selectedTeam = watch('team_id');

    // if <Select>'ed team changes, swap step array to new team
    useEffect(() => {
        const team_id = selectedTeam ?? 'default';
        // defaultSteps[0]: initial member profile information, 
        // teamMap[selected]: selected team's application, 
        // defaultSteps[1]: submission 
        const newSteps = [defaultSteps[0], ...(teamMap[team_id] ?? []), defaultSteps[1]];
        setSteps(newSteps);

        // preserve Step1Default + Step2Default fields; clear only team-specific fields
        const { first_name, last_name, email, major, year, resume, experience, how_heard, consent } = getValues();
        reset({ first_name, last_name, email, major, year, team_id, resume, experience, how_heard, consent });
        resetSubmit();
    }, [selectedTeam, reset, resetSubmit]);

    const handleSubmit = (values: any) => {
        // extract the File from RHF's FileList (input type="file" returns a FileList)
        const rawFile = values.resume?.[0];
        const file = rawFile instanceof File ? rawFile : undefined;

        submit({ values, file });
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

                    {isSuccess && (
                        <div className='mb-4 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-text-primary'>
                            Application submitted successfully! We'll be in touch soon.
                        </div>
                    )}

                    {isError && (
                        <div className='mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800'>
                            {error?.message ?? 'Something went wrong. Please try again.'}
                        </div>
                    )}

                    <FormStepper
                        steps={steps}
                        onSubmit={handleSubmit}
                        form={methods}
                        disabled={isPending || isSuccess}
                    />

                    {isPending && (
                        <p className='mt-3 text-center text-sm text-muted-foreground'>
                            Submitting your application…
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Applications;