import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import { useAddMember, useTeams } from '../../hooks/useMembers';
import toast from 'react-hot-toast';

const schema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  team: z.string().uuid('Please select a valid team'),
});

type FormValues = z.infer<typeof schema>;

interface AddMemberModalProps {
  onClose: () => void;
}

const inputClass =
  'w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring/50 transition-colors';

const errorClass = 'mt-1 text-xs text-destructive';

export const AddMemberModal = ({ onClose }: AddMemberModalProps) => {
  const { mutate: addMember, isPending } = useAddMember();
  const { data: teams = [] } = useTeams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormValues) => {
    addMember(
      {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        team: data.team,
      },
      {
        onSuccess: () => {
          toast.success('Member added successfully!');
          onClose();
        },
        onError: () => {
          toast.error('Failed to add member. Please try again.');
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card text-card-foreground shadow-2xl">

        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold">Add Member</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">First Name</label>
              <input
                {...register('first_name')}
                placeholder="Alice"
                className={inputClass}
              />
              {errors.first_name && <p className={errorClass}>{errors.first_name.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Last Name</label>
              <input
                {...register('last_name')}
                placeholder="Smith"
                className={inputClass}
              />
              {errors.last_name && <p className={errorClass}>{errors.last_name.message}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
            <input
              {...register('email')}
              placeholder="alice@example.com"
              type="email"
              className={inputClass}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Team</label>
            <select
              {...register('team')}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="" className="bg-card">Select a team...</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id} className="bg-card">
                  {team.name}
                </option>
              ))}
            </select>
            {errors.team && <p className={errorClass}>{errors.team.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 transition-colors"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isPending ? 'Adding…' : 'Add Member'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
