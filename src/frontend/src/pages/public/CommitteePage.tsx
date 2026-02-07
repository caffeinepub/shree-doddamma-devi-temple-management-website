import { useGetCommitteeMembers } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Loader2 } from 'lucide-react';
import { formatCommitteeRole } from '../../utils/formatters';

export default function CommitteePage() {
  const { data: members, isLoading } = useGetCommitteeMembers();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'president':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'secretary':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-temple-primary mb-2">
          ಸಮಿತಿ / Committee
        </h1>
        <p className="text-temple-text">Temple management committee members</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-temple-primary" />
        </div>
      ) : members && members.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {members.map((member) => (
            <Card key={member.id.toString()} className="border-2 border-temple-accent hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-temple-light p-3 rounded-full">
                      <Users className="h-6 w-6 text-temple-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                      member.role
                    )}`}
                  >
                    {formatCommitteeRole(member.role)}
                  </span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-gray-200">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No committee members added yet</p>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8 border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Privacy Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-800 leading-relaxed">
            For privacy reasons, mobile numbers of committee members are not displayed publicly. If you
            need to contact a committee member, please use the contact numbers provided in the Contact
            section.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
