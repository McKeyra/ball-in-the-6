'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Users } from 'lucide-react';

// TODO: Replace with actual auth hook
function useAuth(): { user: { id: string } | null } {
  return { user: { id: 'mock-user' } };
}

interface SeniorProfile {
  id: string;
}

interface FamilyContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  photo_url?: string;
}

export function FamilyContactsPage(): React.ReactElement {
  const { user } = useAuth();

  const { data: profile = {} as SeniorProfile } = useQuery<SeniorProfile>({
    queryKey: ['vtf', 'senior-profile'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/senior/profile')
      return {} as SeniorProfile;
    },
    enabled: !!user?.id,
  });

  const { data: contacts = [] } = useQuery<FamilyContact[]>({
    queryKey: ['vtf', 'family-contacts'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/senior/family-contacts')
      return [];
    },
    enabled: !!profile?.id,
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Family Contacts</h1>
        <p className="text-xl text-slate-500 mt-1">Tap to call.</p>
      </div>

      {contacts.length === 0 ? (
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="py-12 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">No Contacts</h3>
            <p className="text-xl text-slate-500">Ask a family member to add contacts for you.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {contacts.map((contact) => (
            <a
              key={contact.id}
              href={`tel:${contact.phone}`}
              className="flex items-center gap-5 p-6 rounded-xl bg-white border-2 border-slate-200 shadow-sm hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {contact.photo_url ? (
                  <img src={contact.photo_url} alt={contact.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-blue-500">
                    {(contact.name || 'C').charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold text-slate-900 truncate">{contact.name}</p>
                <p className="text-xl text-slate-500">{contact.relationship ?? 'Family'}</p>
                <p className="text-lg text-blue-600 mt-1">{contact.phone}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Phone className="w-8 h-8 text-white" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
