import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTranslation } from 'react-i18next';
import { supabase } from "@/integrations/supabase/client";

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

interface MapProps {
  pois: POI[];
  userLocation: UserLocation | null;
  onPOIClick: (poi: POI) => void;
}

const Map: React.FC<MapProps> = ({ pois, userLocation, onPOIClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const hasLocationBeenCentered = useRef<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map using environment variable or placeholder
    const initializeMap = async () => {
      try {
        // Try to get the Mapbox token from Supabase secrets
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        let mapboxToken = '';
        if (data && data.token) {
          mapboxToken = data.token;
        } else {
          // Fallback to a demo token for development
          mapboxToken = 'pk.eyJ1IjoidmF1ZXhwbG9yZXIiLCJhIjoiY20xZmRuYzI0MGZkOTJxczR2aDlnbGt6MyJ9.demo-token-for-development';
          console.warn('Using demo Mapbox token. Please configure MAPBOX_PUBLIC_TOKEN in Supabase secrets.');
        }

        mapboxgl.accessToken = mapboxToken;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [-9.2200, 39.4070], // Centered on Vau/Lagoa de Óbidos
          zoom: 14,
          pitch: 0,
        });

        // Add navigation controls
        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: false,
          }),
          'top-right'
        );

        // Disable scroll zoom for better mobile experience
        map.current.scrollZoom.disable();

        // Add geolocation control
        map.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
          })
        );

      } catch (error) {
        console.error('Failed to initialize map:', error);
        // Show fallback message
        if (mapContainer.current) {
          mapContainer.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-muted text-muted-foreground">
              <div class="text-center">
                <p>${t('mapUnavailable')}</p>
                <p class="text-sm">${t('configureMapbox')}</p>
              </div>
            </div>
          `;
        }
      }
    };

    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update POI markers
  useEffect(() => {
    if (!map.current) {
      return;
    }

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add POI markers
    pois.forEach(poi => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'poi-marker';
      el.style.cssText = `
        background-color: #ff6a00;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid #ffffff;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(255, 106, 0, 0.6);
        transition: all 0.2s ease;
        position: relative;
        z-index: 1000;
      `;
      
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.3)';
        el.style.boxShadow = '0 6px 20px rgba(255, 106, 0, 0.8)';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.boxShadow = '0 4px 12px rgba(255, 106, 0, 0.6)';
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([poi.lng, poi.lat])
        .addTo(map.current!);

      // Add click handler
      el.addEventListener('click', () => {
        onPOIClick(poi);
      });

      // Add popup with basic info
      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-sm text-white">${poi.title}</h3>
            <p class="text-xs text-gray-300 mt-1">${t('clickToOpen')}</p>
          </div>
        `);

      marker.setPopup(popup);
      markers.current.push(marker);
    });
  }, [pois, onPOIClick]);

  // Update user location marker
  useEffect(() => {
    if (!map.current) return;

    if (userMarker.current) {
      userMarker.current.remove();
      userMarker.current = null;
    }

    if (userLocation) {
      // Create custom user marker
      const el = document.createElement('div');
      el.style.cssText = `
        background-color: hsl(120 100% 50%);
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 3px solid hsl(0 0% 100%);
        box-shadow: 0 0 0 3px rgba(0, 255, 0, 0.3);
        animation: pulse 2s infinite;
      `;

      // Add pulse animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(0, 255, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0); }
        }
      `;
      document.head.appendChild(style);

      userMarker.current = new mapboxgl.Marker(el)
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map.current);

      // Only center map on user location the first time
      if (!hasLocationBeenCentered.current) {
        map.current.flyTo({
          center: [userLocation.lng, userLocation.lat],
          zoom: 16,
          duration: 1000
        });
        hasLocationBeenCentered.current = true;
      }
    } else {
      // Reset the flag when location is disabled
      hasLocationBeenCentered.current = false;
    }
  }, [userLocation]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Loading overlay when no POIs */}
      {pois.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('loadingPOIs')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;