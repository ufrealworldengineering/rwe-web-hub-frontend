import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { QuestionType } from './QuestionRenderer';

export type InputQuestion = {
  id: string;
  question: string;
  type: QuestionType;
  required: boolean;
  placeholder?: string;
};

interface InputQuestionProps {
  question: InputQuestion;
  isTextarea?: boolean;
}

export const InputQuestionComponent: React.FC<InputQuestionProps> = ({
  question,
  isTextarea = false,
}) => {
  const { register, formState } = useFormContext();
  const errors = formState.errors ?? {};
  const fieldError = errors[question.id];

  const validationRules: any = {};
  if (question.required) {
    validationRules.required = `${question.question} is required`;
  }

  return (
    <div>
      <Label htmlFor={question.id}>{question.question}</Label>
      {isTextarea ? (
        <Textarea
          id={question.id}
          placeholder={question.placeholder}
          {...register(question.id, validationRules)}
          className='mt-1 bg-background-tertiary'
        />
      ) : (
        <Input
          id={question.id}
          placeholder={question.placeholder}
          {...register(question.id, validationRules)}
          className='mt-1 bg-background-tertiary'
        />
      )}
      {fieldError && (
        <p className='text-sm text-background-accent-secondary'>{String(fieldError?.message)}</p>
      )}
    </div>
  );
};
