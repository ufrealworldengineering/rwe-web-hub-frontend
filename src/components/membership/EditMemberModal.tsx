import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import { useUpdateMember, useTeams } from '../../hooks/useMembers';
import toast from 'react-hot-toast';
import type { Member } from '../../types/member';

const schema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  team: z.string().uuid('Please select a valid team'),
});

type FormValues = z.infer<typeof schema>;

interface EditMemberModalProps {
  member: Member;
  onClose: () => void;
}

const inputClass =
  'w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring/50 transition-colors';

const errorClass = 'mt-1 text-xs text-destructive';

export const EditMemberModal = ({ member, onClose }: EditMemberModalProps) => {
  const { mutate: updateMember, isPending } = useUpdateMember();
  const { data: teams = [] } = useTeams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
      team: member.team,
    },
  });

  const onSubmit = (data: FormValues) => {
    updateMember(
      { id: member.id, updates: data },
      {
        onSuccess: () => {
          toast.success('Member updated');
          onClose();
        },
        onError: () => toast.error('Failed to update member'),
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
          <h2 className="text-base font-semibold">Edit member</h2>
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
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">First name</label>
              <input {...register('first_name')} className={inputClass} />
              {errors.first_name && <p className={errorClass}>{errors.first_name.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Last name</label>
              <input {...register('last_name')} className={inputClass} />
              {errors.last_name && <p className={errorClass}>{errors.last_name.message}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
            <input {...register('email')} type="email" className={inputClass} />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Team</label>
            <select {...register('team')} className={`${inputClass} cursor-pointer`}>
              <option value="">Select a team…</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
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
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isPending ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
