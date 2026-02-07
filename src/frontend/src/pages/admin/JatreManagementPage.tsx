import { useState } from 'react';
import {
  useGetJatres,
  useAddJatre,
  useEditJatre,
  useRemoveJatre,
} from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Loader2, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import type { Jatre } from '../../backend';

export default function JatreManagementPage() {
  const { data: jatres, isLoading } = useGetJatres();
  const addMutation = useAddJatre();
  const editMutation = useEditJatre();
  const removeMutation = useRemoveJatre();

  const [showDialog, setShowDialog] = useState(false);
  const [editingJatre, setEditingJatre] = useState<Jatre | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    activities: '',
  });

  const handleAdd = () => {
    setEditingJatre(null);
    setFormData({
      name: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      activities: '',
    });
    setShowDialog(true);
  };

  const handleEdit = (jatre: Jatre) => {
    setEditingJatre(jatre);
    setFormData({
      name: jatre.name,
      date: new Date(Number(jatre.date) / 1000000).toISOString().split('T')[0],
      description: jatre.description,
      activities: jatre.activities.join('\n'),
    });
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    const dateTimestamp = new Date(formData.date).getTime() * 1000000;
    const activities = formData.activities.split('\n').filter((a) => a.trim());

    try {
      if (editingJatre) {
        await editMutation.mutateAsync({
          jatreId: editingJatre.id,
          name: formData.name,
          date: BigInt(dateTimestamp),
          description: formData.description,
          activities,
        });
      } else {
        await addMutation.mutateAsync({
          name: formData.name,
          date: BigInt(dateTimestamp),
          description: formData.description,
          activities,
        });
      }
      setShowDialog(false);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleRemove = async (jatreId: bigint, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      await removeMutation.mutateAsync(jatreId);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Jatre Management</h1>
          <p className="text-gray-600">Manage temple festivals and events</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Jatre
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : jatres && jatres.length > 0 ? (
        <div className="space-y-4">
          {jatres.map((jatre) => (
            <Card key={jatre.id.toString()} className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-3 rounded-lg">
                      <Calendar className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{jatre.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{formatDate(jatre.date)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(jatre)} variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleRemove(jatre.id, jatre.name)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Description:</p>
                  <p className="text-sm text-gray-600">{jatre.description}</p>
                </div>
                {jatre.activities.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Activities:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {jatre.activities.map((activity, idx) => (
                        <li key={idx}>• {activity}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No jatres added yet</p>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Jatre
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingJatre ? 'Edit Jatre' : 'Add Jatre'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Jatre Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter jatre name"
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="activities">Activities (one per line)</Label>
              <Textarea
                id="activities"
                value={formData.activities}
                onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                placeholder="Enter activities, one per line"
                rows={5}
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
