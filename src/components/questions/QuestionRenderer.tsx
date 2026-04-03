import { MultipleChoiceQuestionComponent } from './MultipleChoiceQuestion';
import { InputQuestionComponent } from './InputQuestion';
import type { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import type { InputQuestion } from './InputQuestion';

export type QuestionType = 'multiple_choice' | 'input';
export type Question = MultipleChoiceQuestion | InputQuestion;

interface QuestionRendererProps {
  question: Question;
  isTextarea?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  isTextarea = false,
}) => {
  switch (question.type) {
    case 'multiple_choice':
      return <MultipleChoiceQuestionComponent question={question} />;
    case 'input':
      return <InputQuestionComponent question={question} isTextarea={isTextarea} />;
    default:
      const _exhaustive: never = question;
      return _exhaustive;
  }
};
