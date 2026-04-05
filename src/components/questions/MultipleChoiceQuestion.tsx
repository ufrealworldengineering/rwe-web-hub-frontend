import { useFormContext, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
export type MultipleChoiceQuestion = {
  id: string;
  question: string;
  type: 'multiple_choice';
  options: Array<string>;
  required: boolean
};

interface MultipleChoiceQuestionProps {
  question: MultipleChoiceQuestion;
}

export const MultipleChoiceQuestionComponent: React.FC<
  MultipleChoiceQuestionProps
> = ({ question }) => {
  const { control, formState } = useFormContext();
  const errors = formState.errors ?? {};
  const fieldError = errors[question.id];

  return (
    <div>
      <Label>{question.question}</Label>
      <Controller
        control={control}
        name={question.id}
        defaultValue='default'
        rules={{
          validate: (value) =>
            value !== 'default' || `Please select an option for ${question.question}`,
        }}
        render={({ field: { value, onChange } }) => (
          <Select onValueChange={onChange} value={value}>
            <SelectTrigger className='mt-1 bg-background-tertiary'>
              <SelectValue placeholder='Choose...' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='default'>Choose...</SelectItem>
              {question.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {fieldError && (
        <p className='text-sm text-background-accent-secondary'>{String(fieldError?.message)}</p>
      )}
    </div>
  );
};
