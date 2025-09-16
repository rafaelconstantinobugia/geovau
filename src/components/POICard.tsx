import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, MapPin, Volume2 } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface POI {
  id: string;
  slug: string;
  title: string;
  lat: number;
  lng: number;
  radius_m: number;
  text: string | null;
  image_url: string | null;
  audio_url: string | null;
  tags: string[];
}

interface UserLocation {
  lat: number;
  lng: number;
}

interface POICardProps {
  poi: POI;
  userLocation: UserLocation | null;
  onClose: () => void;
  onOpen: () => void;
}

// Haversine distance calculation
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const POICard: React.FC<POICardProps> = ({ poi, userLocation, onClose, onOpen }) => {
  const { t } = useTranslation();
  const distance = userLocation 
    ? calculateDistance(userLocation.lat, userLocation.lng, poi.lat, poi.lng)
    : null;

  // Call onOpen when component mounts to log the 'open_card' event
  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const playAudio = () => {
    if (poi.audio_url) {
      const audio = new Audio(poi.audio_url);
      audio.play().catch(console.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm p-4 sm:items-center">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden bg-card border-border shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <CardHeader className="relative pb-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-muted/50 hover:bg-muted"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <CardTitle className="text-xl font-semibold pr-8">
            {poi.title}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <CardDescription>
              {distance !== null 
                ? `${Math.round(distance)}m ${t('distance').toLowerCase()}`
                : t('coordinates')
              }
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {poi.image_url && (
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={poi.image_url}
                alt={poi.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {poi.text && (
            <div className="prose prose-sm prose-invert max-w-none">
              <p className="text-foreground leading-relaxed">
                {poi.text}
              </p>
            </div>
          )}

          {poi.tags && poi.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {poi.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {poi.audio_url && (
            <Button 
              onClick={playAudio}
              variant="outline"
              className="w-full"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              {t('playAudio')}
            </Button>
          )}

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              {t('coordinates')}: {poi.lat.toFixed(4)}, {poi.lng.toFixed(4)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default POICard;