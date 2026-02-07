import { useState } from 'react';
import {
  useGetContacts,
  useAddContact,
  useEditContact,
  useRemoveContact,
} from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Loader2, Plus, Edit, Trash2, Phone } from 'lucide-react';
import type { TempleContact } from '../../backend';

export default function ContactsManagementPage() {
  const { data: contacts, isLoading } = useGetContacts();
  const addMutation = useAddContact();
  const editMutation = useEditContact();
  const removeMutation = useRemoveContact();

  const [showDialog, setShowDialog] = useState(false);
  const [editingContact, setEditingContact] = useState<TempleContact | null>(null);
  const [formData, setFormData] = useState({
    contactType: '',
    contactNumber: '',
  });

  const handleAdd = () => {
    setEditingContact(null);
    setFormData({ contactType: '', contactNumber: '' });
    setShowDialog(true);
  };

  const handleEdit = (contact: TempleContact) => {
    setEditingContact(contact);
    setFormData({
      contactType: contact.contactType,
      contactNumber: contact.contactNumber,
    });
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingContact) {
        await editMutation.mutateAsync({
          contactId: editingContact.id,
          contactType: formData.contactType,
          contactNumber: formData.contactNumber,
        });
      } else {
        await addMutation.mutateAsync({
          contactType: formData.contactType,
          contactNumber: formData.contactNumber,
        });
      }
      setShowDialog(false);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleRemove = async (contactId: bigint, contactType: string) => {
    if (!confirm(`Are you sure you want to remove ${contactType}?`)) return;
    try {
      await removeMutation.mutateAsync(contactId);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts Management</h1>
          <p className="text-gray-600">Manage temple contact numbers</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : contacts && contacts.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {contacts.map((contact) => (
            <Card key={contact.id.toString()} className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-100 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{contact.contactType}</CardTitle>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(contact)} variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleRemove(contact.id, contact.contactType)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold text-gray-900">{contact.contactNumber}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No contacts added yet</p>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Contact
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingContact ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="contactType">Contact Type</Label>
              <Input
                id="contactType"
                value={formData.contactType}
                onChange={(e) => setFormData({ ...formData, contactType: e.target.value })}
                placeholder="e.g., Temple Contact, Committee Contact"
              />
            </div>
            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="Enter phone number"
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
