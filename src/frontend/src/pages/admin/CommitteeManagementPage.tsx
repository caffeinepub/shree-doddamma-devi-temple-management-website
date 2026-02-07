import { useState } from 'react';
import {
  useGetCommitteeMembersAdmin,
  useAddCommitteeMember,
  useEditCommitteeMember,
  useRemoveCommitteeMember,
} from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Loader2, Plus, Edit, Trash2, Users } from 'lucide-react';
import { formatCommitteeRole } from '../../utils/formatters';
import type { CommitteeMember, CommitteeRole } from '../../backend';

export default function CommitteeManagementPage() {
  const { data: members, isLoading } = useGetCommitteeMembersAdmin();
  const addMutation = useAddCommitteeMember();
  const editMutation = useEditCommitteeMember();
  const removeMutation = useRemoveCommitteeMember();

  const [showDialog, setShowDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '' as CommitteeRole | '',
    mobileNumber: '',
  });

  const handleAdd = () => {
    setEditingMember(null);
    setFormData({ name: '', role: '', mobileNumber: '' });
    setShowDialog(true);
  };

  const handleEdit = (member: CommitteeMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      mobileNumber: member.mobileNumber,
    });
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.role) {
      alert('Please select a role');
      return;
    }

    try {
      if (editingMember) {
        await editMutation.mutateAsync({
          memberId: editingMember.id,
          name: formData.name,
          role: formData.role,
          mobileNumber: formData.mobileNumber,
        });
      } else {
        await addMutation.mutateAsync({
          name: formData.name,
          role: formData.role,
          mobileNumber: formData.mobileNumber,
        });
      }
      setShowDialog(false);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleRemove = async (memberId: bigint, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the committee?`)) {
      return;
    }

    try {
      await removeMutation.mutateAsync(memberId);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Committee Management</h1>
          <p className="text-gray-600">Manage temple committee members</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : members && members.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {members.map((member) => (
            <Card key={member.id.toString()} className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatCommitteeRole(member.role)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(member)} variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleRemove(member.id, member.name)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Mobile:</span> {member.mobileNumber}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No committee members added yet</p>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Member
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Edit Member' : 'Add Member'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter member name"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as CommitteeRole })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="president">President</SelectItem>
                  <SelectItem value="secretary">Secretary</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                placeholder="Enter mobile number"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={addMutation.isPending || editMutation.isPending}
                className="flex-1"
              >
                {(addMutation.isPending || editMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
              <Button onClick={() => setShowDialog(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
