import { QuestionRenderer, type Question } from '@/components/questions/QuestionRenderer';
import type { UseFormReturn } from 'react-hook-form';

interface DynamicQuestionStepProps {
  questions: Question[];
  title: string;
  index: number;
  form: UseFormReturn<any>;
  goNext: () => void;
  goPrev: () => void;
  submit: () => void;
}

export const DynamicQuestionStep: React.FC<DynamicQuestionStepProps> = ({
  questions,
  title,
}) => {
  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-medium'>{title}</h2>
      {questions.map((question) => (
        <QuestionRenderer key={question.id} question={question} />
      ))}
    </div>
  );
};
