import { useFormContext, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    RadioGroup,
    RadioGroupItem,
} from '@/components/ui/radio-group';
import type { FormStepDefinition } from '@/components/form-stepper/formstepper';
import { Bot } from 'lucide-react';

// NOTE: These are the ROBOT ARM STEPS, meaning they are the served only if ROBOT ARM team is selected

type StepInfoSectionProps = {
    heading: string;
    content: React.ReactNode;
    className?: string;
};

export const StepInfoSection: React.FC<StepInfoSectionProps> = ({ heading, content, className }) => {
    return (
        <div className={`${className ?? ''}`}>
            <h3 className="text-md">{heading}</h3>
            <div className="text-sm">
                {content}
            </div>
        </div>
    );
};

export const Step1RobotArm = () => {
    const methods = useFormContext();
    const { formState, control } = methods;
    const errors = formState.errors ?? {};
    return (
        <div className='space-y-4'>
            <h2 className='text-lg font-medium'>Robot Arm Design Team</h2>
            <StepInfoSection
                heading="Roles"
                content={
                    <>
                        <strong>Mechatronics Engineer</strong>
                        <p>
                            Mechatronics Engineers oversee the general development of the robotic arm and integration of electrical systems to each component.
                        </p>
                        <br />
                        <strong>Payload Engineer</strong>
                        <p>
                            Payload Engineers will design and develop the 3D printing systems for the robotic arm, and any future payloads.
                        </p>
                        <br />
                        <strong>Controls Engineer</strong>
                        <p>
                            Controls Engineers will be responsible for developing, implementing, and updating the robotic arm’s control, electrical hardware and related software systems.
                        </p>
                    </>
                }
            />
            <div>
                <Label>Which role(s) are you applying for?</Label>
                <Controller
                    control={control}
                    name='arm_role'
                    defaultValue='default'
                    rules={{
                        validate: value => value !== 'default' || 'Please choose a role'
                    }}
                    render={({ field: { value, onChange } }) => (
                        <Select onValueChange={onChange} value={value}>
                            <SelectTrigger className='mt-1 bg-background-tertiary'>
                                <SelectValue placeholder='Choose...' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='default'>Choose...</SelectItem>
                                <SelectItem value='mechatronics'>Mechatronics Engineer</SelectItem>
                                <SelectItem value='payload'>Payload Engineer</SelectItem>
                                <SelectItem value='controls'>Controls Engineer</SelectItem>
                                <SelectItem value='project'>Project Engineer</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.arm_role && <p className='text-sm text-red-500'>{String(errors.arm_role?.message)}</p>}
            </div>
            <div>
                <Label htmlFor='arm_availability'>Are you available Tuesdays and Thursdays from 5 PM to 7 PM?</Label>
                <Controller
                    control={control}
                    name='arm_availability'
                    rules={{ required: 'Availability is required' }}
                    render={({ field: { value, onChange } }) => (
                        <RadioGroup
                            value={value}
                            onValueChange={onChange}
                            className='mt-1'
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
                {errors.arm_availability && <p className='text-sm text-red-500'>{String(errors.arm_availability?.message)}</p>}
            </div>
        </div >
    );
};

export const armSteps: FormStepDefinition[] = [
    {
        id: 'details',
        label: { icon: Bot, label: 'Robot Arm Team', subcontent: 'Team application details' },
        Component: Step1RobotArm
    }
];