import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { MemberTable } from '../../components/membership/MemberTable';
import { AddMemberModal } from '../../components/membership/AddMemberModal';
import { useMembers } from '../../hooks/useMembers';
import rweLogo from '../../assets/rwe-logo.svg';
import './admin.css';

export default function MembershipPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: members = [], isLoading, isError } = useMembers();

  return (
    <div className="p-6 space-y-4">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Membership</h1>
        <img src={rweLogo} alt="RWE Logo" className="h-10 w-auto" />
      </div>

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