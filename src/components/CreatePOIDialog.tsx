import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { supabase } from "@/integrations/supabase/client";
import { getTagColor } from "@/lib/tagColors";

interface CreatePOIDialogProps {
  userLocation: { lat: number; lng: number } | null;
  onPOICreated?: () => void;
  children: React.ReactNode;
}

const CreatePOIDialog = ({ userLocation, onPOICreated, children }: CreatePOIDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [radius, setRadius] = useState(60);

  const { toast } = useToast();
  const { t } = useTranslation();

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userLocation) {
      toast({
        title: t('error'),
        description: t('locationRequiredForPOI'),
        variant: "destructive"
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: t('error'),
        description: t('titleRequired'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Generate a unique ID from title
      const generateId = (title: string) => {
        return title.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 50) + '-' + Date.now();
      };

      const poiData = {
        id: generateId(title.trim()),
        title: title.trim(),
        text: text.trim() || null,
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius_m: radius,
        image_url: imageUrl.trim() || null,
        audio_url: audioUrl.trim() || null,
        tags: tags.length > 0 ? tags : null,
        published: true
      };

      const { error } = await supabase
        .from('pois')
        .insert(poiData);

      if (error) {
        console.error('Error creating POI:', error);
        toast({
          title: t('error'),
          description: t('createPOIError'),
          variant: "destructive"
        });
        return;
      }

      toast({
        title: t('success'),
        description: t('poiCreatedSuccess')
      });

      // Reset form
      setTitle("");
      setText("");
      setImageUrl("");
      setAudioUrl("");
      setTags([]);
      setNewTag("");
      setRadius(60);
      setOpen(false);

      // Notify parent component
      onPOICreated?.();

    } catch (error) {
      console.error('Failed to create POI:', error);
      toast({
        title: t('error'),
        description: t('connectionError'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('createPOI')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">{t('title')} *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('enterTitle')}
              required
            />
          </div>

          <div>
            <Label htmlFor="text">{t('description')}</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('enterDescription')}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="radius">{t('radius')} (m)</Label>
            <Input
              id="radius"
              type="number"
              min="10"
              max="1000"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value) || 60)}
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">{t('imageURL')}</Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="audioUrl">{t('audioURL')}</Label>
            <Input
              id="audioUrl"
              type="url"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label>{t('tags')}</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="cursor-pointer text-white border-0"
                  style={{ backgroundColor: getTagColor(tag) }}
                >
                  {tag}
                  <X 
                    className="ml-1 h-3 w-3" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('addTag')}
              />
              <Button type="button" onClick={addTag} variant="outline">
                {t('add')}
              </Button>
            </div>
          </div>

          {userLocation && (
            <div className="text-sm text-muted-foreground">
              <p>{t('location')}: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !userLocation}
              className="flex-1"
            >
              {isLoading ? t('creating') : t('create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePOIDialog;