import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import Map from "@/components/Map";
import POICard from "@/components/POICard";
import LanguageSelector from "@/components/LanguageSelector";
import LocationBanner from "@/components/LocationBanner";
import CreatePOIDialog from "@/components/CreatePOIDialog";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

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

const App = () => {
  const [pois, setPois] = useState<POI[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [triggeredPOIs, setTriggeredPOIs] = useState<Set<string>>(new Set());
  const [showLocationBanner, setShowLocationBanner] = useState(true);
  
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  // Demo mode location (near Covão dos Mezaranhos)
  const DEMO_LOCATION = { lat: 39.4087, lng: -9.2256 };

  const logHit = useCallback(async (poi: POI, kind: 'enter_radius' | 'open_card' | 'manual_click', distance?: number) => {
    try {
      const response = await supabase.functions.invoke('log-hit', {
        body: {
          poi_id: poi.id,
          kind,
          lat: userLocation?.lat,
          lng: userLocation?.lng,
          dist_m: distance ? Math.round(distance) : null,
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
          ua: navigator.userAgent
        }
      });
      
      if (response.error) {
        console.error('Failed to log hit:', response.error);
      } else {
        console.log(`Logged ${kind} for POI: ${poi.title}`);
      }
    } catch (error) {
      console.error('Error logging hit:', error);
    }
  }, [userLocation]);

  // Fetch POIs from Supabase using localized function
  const fetchPOIs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_pois_localized', { lang: i18n.language });
      
      if (error) {
        console.error('Error fetching POIs:', error);
        toast({
          title: t('error'),
          description: t('loadPOIError'),
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setPois(data);
        console.log(`Loaded ${data.length} POIs`);
        
        // Extract unique tags
        const tags = new Set<string>();
        data.forEach(poi => {
          poi.tags?.forEach(tag => tags.add(tag));
        });
        setAvailableTags(Array.from(tags));
      }
    } catch (error) {
      console.error('Failed to fetch POIs:', error);
      toast({
        title: t('error'),
        description: t('connectionError'),
        variant: "destructive"
      });
    }
  }, [toast, t, i18n.language]);

  useEffect(() => {
    fetchPOIs();
  }, [fetchPOIs]);

  // Check for POIs within radius when location changes
  useEffect(() => {
    if (!userLocation || !pois.length) return;

    pois.forEach(poi => {
      const distance = calculateDistance(
        userLocation.lat, userLocation.lng,
        poi.lat, poi.lng
      );
      
      if (distance <= poi.radius_m && !triggeredPOIs.has(poi.id)) {
        setTriggeredPOIs(prev => new Set([...prev, poi.id]));
        setSelectedPOI(poi);
        logHit(poi, 'enter_radius', distance);
        
        toast({
          title: t('nearbyPOI'),
          description: `${poi.title} - ${Math.round(distance)}m`,
        });
      }
    });
  }, [userLocation, pois, triggeredPOIs, logHit, toast]);

  const enableLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: t('error'),
        description: t('geolocationNotSupported'),
        variant: "destructive"
      });
      return;
    }

    // Show banner when location is first enabled
    setShowLocationBanner(true);
    let isFirstPosition = true;

    const successCallback = (position: GeolocationPosition) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      setUserLocation(newLocation);
      
      // Only set location enabled and show toast on first position update
      if (isFirstPosition) {
        setLocationEnabled(true);
        console.log('Location enabled:', newLocation);
        
        toast({
          title: t('locationEnabled'),
          description: t('locationEnabledDesc')
        });
        isFirstPosition = false;
      }
    };

    const errorCallback = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error);
      toast({
        title: t('locationError'),
        description: t('locationErrorDesc'),
        variant: "destructive"
      });
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000
    };

    // Start watching position
    const id = navigator.geolocation.watchPosition(successCallback, errorCallback, options);
    setWatchId(id);
  };

  const disableLocation = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setLocationEnabled(false);
    setUserLocation(null);
    setTriggeredPOIs(new Set());
    setShowLocationBanner(false); // Reset banner state when location is disabled
    console.log('Location disabled');
    
    toast({
      title: t('locationDisabled'),
      description: t('locationDisabledDesc')
    });
  };

  const enableDemoMode = () => {
    setUserLocation(DEMO_LOCATION);
    setLocationEnabled(true);
    setShowLocationBanner(true);
    
    // Find the demo POI and open it
    const demoPOI = pois.find(poi => poi.slug === 'covao-mezaranhos');
    if (demoPOI) {
      setSelectedPOI(demoPOI);
      logHit(demoPOI, 'manual_click', 0);
    }
    
    toast({
      title: t('demoModeEnabled'),
      description: t('demoModeEnabledDesc')
    });
  };

  const handlePOIClick = (poi: POI) => {
    setSelectedPOI(poi);
    
    if (userLocation) {
      const distance = calculateDistance(
        userLocation.lat, userLocation.lng,
        poi.lat, poi.lng
      );
      logHit(poi, 'manual_click', distance);
    } else {
      logHit(poi, 'manual_click');
    }
  };

  const handleCardOpen = (poi: POI) => {
    if (userLocation) {
      const distance = calculateDistance(
        userLocation.lat, userLocation.lng,
        poi.lat, poi.lng
      );
      logHit(poi, 'open_card', distance);
    } else {
      logHit(poi, 'open_card');
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Filter POIs by selected tags
  const filteredPOIs = selectedTags.length > 0 
    ? pois.filter(poi => poi.tags?.some(tag => selectedTags.includes(tag)))
    : pois;

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground">{t('appTitle')}</h1>
            {locationEnabled ? (
              <Button 
                onClick={disableLocation}
                variant="outline"
                size="sm"
                className="border-geofence-active text-geofence-active hover:bg-geofence-active hover:text-background"
              >
                {t('locationActive')}
              </Button>
            ) : (
              <Button 
                onClick={enableLocation}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {t('enableLocation')}
              </Button>
            )}
            {process.env.NODE_ENV === 'development' && (
              <Button 
                onClick={enableDemoMode}
                variant="secondary"
                size="sm"
              >
                {t('demoMode')}
              </Button>
            )}
            {locationEnabled && (
              <CreatePOIDialog 
                userLocation={userLocation} 
                onPOICreated={fetchPOIs}
              >
                <Button 
                  size="sm"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('createPOIHere')}
                </Button>
              </CreatePOIDialog>
            )}
            <LanguageSelector />
          </div>
          
          {/* Tag filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('filters')}</span>
            {availableTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <Map 
          pois={filteredPOIs}
          userLocation={userLocation}
          onPOIClick={handlePOIClick}
        />
      </div>

      {/* POI Card Modal */}
      {selectedPOI && (
        <POICard
          poi={selectedPOI}
          userLocation={userLocation}
          onClose={() => setSelectedPOI(null)}
          onOpen={() => handleCardOpen(selectedPOI)}
        />
      )}

      {/* Location Banner */}
      <LocationBanner
        isVisible={locationEnabled && showLocationBanner}
        onDismiss={() => setShowLocationBanner(false)}
      />
    </div>
  );
};

export default App;