import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { MemberTable } from '../../components/membership/MemberTable';
import { AddMemberModal } from '../../components/membership/AddMemberModal';
import { useMembers } from '../../hooks/useMembers';
import rweLogo from '../../assets/rwe-logo.svg';
import { PageHeader } from '@/components/admin/PageHeader';
import { ImageWithLoader } from '@/components/ui/image-with-loader';

export default function MembershipPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: members = [], isLoading, isError } = useMembers();

  return (
    <div className="space-y-4 bg-background text-foreground">
      <Toaster position="top-right" />

      <PageHeader
        title="Membership"
        rightSlot={
          <ImageWithLoader
            src={rweLogo}
            alt="RWE Logo"
            wrapperClassName="h-10 w-auto"
            className="h-10 w-auto"
            loading="eager"
          />
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin" />
        </div>
      ) : isError ? (
        <div className="text-destructive">Failed to load members. Please refresh and try again.</div>
      ) : (
        <MemberTable data={members} onAddMember={() => setIsModalOpen(true)} />
      )}

      {isModalOpen && (
        <AddMemberModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}