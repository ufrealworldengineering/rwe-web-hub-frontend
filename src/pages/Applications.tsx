import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { FormStepper } from '@/components/form-stepper/formstepper';
import type { FormStepDefinition } from '@/components/form-stepper/formstepper';
import { DynamicQuestionStep } from '@/components/questions/DynamicQuestionStep';

import { defaultSteps } from '@/components/form-stepper/Teams/Default/steps';
import { useSubmitApplication } from '@/api/hooks/useApplications';
import { useTeamApplicationTemplate } from '@/api/hooks/useTeams';
import type { ApplicationCore } from '@/types/application';
import { FileText } from 'lucide-react';

const Applications = () => {
    const methods = useForm<ApplicationCore>({ defaultValues: { team_id: 'default', year: 'default' } });
    const { watch, reset, getValues } = methods;

    const [steps, setSteps] = useState<FormStepDefinition[]>([...defaultSteps]);

    const { submit, isPending, isSuccess, isError, error, reset: resetSubmit } = useSubmitApplication();

    // watch 'team' field to detect when selected team changes
    const selectedTeam = watch('team_id');

    // Fetch team application template when team is selected
    const { data: templateData, isLoading: isLoadingTemplate } = useTeamApplicationTemplate(selectedTeam ?? '');

    // Build steps dynamically from template data
    useEffect(() => {
        if (!selectedTeam || selectedTeam === 'default') {
            // Reset to just default steps when no team is selected
            setSteps([...defaultSteps]);
            return;
        }

        if (isLoadingTemplate) {
            // Keep current steps while loading
            return;
        }

        if (templateData?.questions) {
            // Create a team-specific step from the questions
            const teamQuestions = templateData.questions;
            
            const teamStep: FormStepDefinition = {
                id: selectedTeam,
                label: { 
                    icon: FileText, 
                    label: 'Team Questions', 
                    subcontent: 'Team-specific information' 
                },
                Component: ({ index, form, goNext, goPrev, submit }) => (
                    <DynamicQuestionStep
                        questions={teamQuestions}
                        title="Team Application"
                        index={index}
                        form={form}
                        goNext={goNext}
                        goPrev={goPrev}
                        submit={submit}
                    />
                ),
            };

            // defaultSteps[0]: initial member profile information,
            // teamStep: selected team's questions,
            // defaultSteps[1]: submission
            const newSteps = [defaultSteps[0], teamStep, defaultSteps[1]];
            setSteps(newSteps);
        }

        // preserve Step1Default + Step2Default fields; clear only team-specific fields
        const { first_name, last_name, email, major, year, resume, experience, how_heard, consent } = getValues();
        reset({ first_name, last_name, email, major, year, team_id: selectedTeam, resume, experience, how_heard, consent });
        resetSubmit();
    }, [selectedTeam, templateData, isLoadingTemplate, reset, resetSubmit, getValues]);

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
                        disabled={isPending || isSuccess || isLoadingTemplate}
                    />

                    {isPending && (
                        <p className='mt-3 text-center text-sm text-muted-foreground'>
                            Submitting your application…
                        </p>
                    )}

                    {isLoadingTemplate && selectedTeam !== 'default' && (
                        <p className='mt-3 text-center text-sm text-muted-foreground'>
                            Loading team questions…
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Applications;