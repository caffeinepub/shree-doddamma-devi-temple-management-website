import { useState } from 'react';
import {
  useGetGalleryItems,
  useAddGalleryItem,
  useRemoveGalleryItem,
} from '../../hooks/useQueries';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Loader2, Plus, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { ExternalBlob } from '../../backend';

export default function GalleryManagementPage() {
  const { data: items, isLoading } = useGetGalleryItems();
  const addMutation = useAddGalleryItem();
  const removeMutation = useRemoveGalleryItem();

  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaType: 'image',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAdd = () => {
    setFormData({ title: '', description: '', mediaType: 'image' });
    setSelectedFile(null);
    setUploadProgress(0);
    setShowDialog(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const mediaType = file.type.startsWith('video') ? 'video' : 'image';
      setFormData({ ...formData, mediaType });
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const externalBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await addMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        mediaType: selectedFile.type,
        externalBlob,
      });

      setShowDialog(false);
      setUploadProgress(0);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      setUploadProgress(0);
    }
  };

  const handleRemove = async (itemId: bigint, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}"?`)) return;
    try {
      await removeMutation.mutateAsync(itemId);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
          <p className="text-gray-600">Manage temple photos and videos</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Media
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : items && items.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const mediaUrl = item.externalBlob.getDirectURL();
            const isVideo = item.mediaType.startsWith('video');

            return (
              <Card key={item.id.toString()} className="border-2 overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  {isVideo ? (
                    <video src={mediaUrl} className="w-full h-full object-cover" />
                  ) : (
                    <img src={mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  )}
                  <Button
                    onClick={() => handleRemove(item.id, item.title)}
                    variant="destructive"
                    size="sm"
                    className="w-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No gallery items added yet</p>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Item
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Gallery Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Select File (Image or Video)</Label>
              <Input
                id="file"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                rows={3}
              />
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={addMutation.isPending || !selectedFile}
                className="flex-1"
              >
                {addMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
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
