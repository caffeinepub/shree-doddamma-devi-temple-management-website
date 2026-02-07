import { useGetGalleryItems } from '../../hooks/useQueries';
import { Card, CardContent } from '../../components/ui/card';
import { Image as ImageIcon, Loader2, Video } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

export default function GalleryPage() {
  const { data: items, isLoading } = useGetGalleryItems();
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-temple-primary mb-2">
          ಗ್ಯಾಲರಿ / Gallery
        </h1>
        <p className="text-temple-text">Temple photos and videos</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-temple-primary" />
        </div>
      ) : items && items.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const mediaUrl = item.externalBlob.getDirectURL();
            const isVideo = item.mediaType.startsWith('video');

            return (
              <Card
                key={item.id.toString()}
                className="border-2 border-temple-accent hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                onClick={() => setSelectedItem(item)}
              >
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {isVideo ? (
                    <>
                      <video src={mediaUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Video className="h-12 w-12 text-white" />
                      </div>
                    </>
                  ) : (
                    <img src={mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-2 border-gray-200">
          <CardContent className="py-12 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No gallery items added yet</p>
          </CardContent>
        </Card>
      )}

      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedItem.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedItem.mediaType.startsWith('video') ? (
                <video
                  src={selectedItem.externalBlob.getDirectURL()}
                  controls
                  className="w-full rounded-lg"
                />
              ) : (
                <img
                  src={selectedItem.externalBlob.getDirectURL()}
                  alt={selectedItem.title}
                  className="w-full rounded-lg"
                />
              )}
              {selectedItem.description && (
                <p className="text-gray-700">{selectedItem.description}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
