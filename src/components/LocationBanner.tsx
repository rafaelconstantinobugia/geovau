import { X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

interface LocationBannerProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const LocationBanner = ({ isVisible, onDismiss }: LocationBannerProps) => {
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-fade-in">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <MapPin className="h-5 w-5 text-geofence-active" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              {t('locationTracking')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('locationTrackingDesc')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0 flex-shrink-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t('dismiss')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationBanner;