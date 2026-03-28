import type { LucideIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import '@/globals.css';

// TODO: formalize individual components (input, radio group, select, text area, text content) 
//       for easier form building

// Content necessary for a form label 
// (the separate card rendered at the top)
export type FormStepLabel = {
    icon: LucideIcon,
    label: string,
    subcontent: string
};

// Content necessary for a form
export type FormStepDefinition = {
    id?: string | number;
    label: FormStepLabel;
    Component: React.ComponentType<{ 
        index: number; 
        form: UseFormReturn<any>; 
        goNext: () => void; 
        goPrev: () => void; 
        submit: () => void 
    }>;
};

export const FormStepper = ({ 
    steps, 
    initialStep = 0, 
    onSubmit,
    form,
    disabled = false,
}: { 
    steps: FormStepDefinition[]; 
    initialStep?: number; 
    onSubmit?: (values: any) => void;
    form?: UseFormReturn<any>;
    // disables navigation and submission controls (while a request pending/successful)
    disabled?: boolean;
}) => {
    // If external form provided, use that one, else generate an internal one.
    // That way `pages/Applications.tsx` can re-render the component while maintaining state for
    // dynamic forms.
    const methods = form ?? useForm({ mode: 'all' });
    const [curStep, setCurStep] = useState<number>(initialStep ?? 0);

    const goNext = () => setCurStep(s => Math.min(s + 1, steps.length - 1));
    const goPrev = () => setCurStep(s => Math.max(s - 1, 0));
    const isLast = curStep === steps.length - 1;

    const handleSubmit = methods.handleSubmit((values) => {
        if (isLast) {
            onSubmit?.(values);
        }
        else {
            goNext();
        }
    });

    return (
        <div className='space-y-6'>
            <Card className='flex items-stretch justify-center gap-3 p-3'>
                {steps.map((step, idx) => {
                    const Icon = step.label.icon as any;
                    const expanded = idx === curStep;
                    return (
                        <button
                            key={step.id ?? idx}
                            type='button'
                            onClick={() => setCurStep(idx)}
                            className={`flex rounded-md items-center gap-3 p-4 ${expanded ? 'bg-muted shadow' : 'bg-transparent hover:bg-muted/40'}`}
                        >
                            <div className='flex items-center justify-center'>
                                <Icon className={`h-6 w-6 ${expanded ? 'text-primary' : 'text-muted-foreground'}`} />
                            </div>
                            {expanded && (
                                <div className='text-left'>
                                    <div className='font-semibold'>{step.label.label}</div>
                                    <div className='text-sm text-muted-foreground'>{step.label.subcontent}</div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </Card>

            <Card>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit} className='p-4'>
                        <div className='mb-4'>
                            {steps.map((s, idx) => {
                                if (idx !== curStep) return null;
                                const StepComponent = s.Component;
                                return (
                                    <div key={s.id ?? idx}>
                                        <StepComponent
                                            index={idx}
                                            form={methods}
                                            goNext={goNext}
                                            goPrev={goPrev}
                                            submit={() => methods.handleSubmit((v) => onSubmit?.(v))()}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        <div className='flex justify-between'>
                            <Button type='button' onClick={goPrev} disabled={curStep === 0 || disabled} className='btn'>
                                Back
                            </Button>
                            <div>
                                {!isLast && (
                                    <Button type='submit' disabled={disabled} className='btn-primary'>
                                        Next
                                    </Button>
                                )}
                                {isLast && (
                                    <Button type='submit' disabled={disabled} className='btn-primary'>
                                        Submit
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </Card>
        </div>
    );
};