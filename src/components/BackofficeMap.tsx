import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";

interface BackofficeMapProps {
  lat: number;
  lng: number;
  onCoordinatesChange: (lat: number, lng: number) => void;
  isOpen: boolean;
}

const BackofficeMap: React.FC<BackofficeMapProps> = ({ 
  lat, 
  lng, 
  onCoordinatesChange, 
  isOpen 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);

  useEffect(() => {
    if (!mapContainer.current || !isOpen) return;

    const initializeMap = async () => {
      try {
        // Get Mapbox token from Supabase secrets
        const { data } = await supabase.functions.invoke('get-mapbox-token');
        
        let mapboxToken = '';
        if (data && data.token) {
          mapboxToken = data.token;
        } else {
          mapboxToken = 'pk.eyJ1IjoidmF1ZXhwbG9yZXIiLCJhIjoiY20xZmRuYzI0MGZkOTJxczR2aDlnbGt6MyJ9.demo-token-for-development';
          console.warn('Using demo Mapbox token. Please configure MAPBOX_PUBLIC_TOKEN in Supabase secrets.');
        }

        mapboxgl.accessToken = mapboxToken;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [lng || -9.2200, lat || 39.4070],
          zoom: 15,
          minZoom: 5,
          maxZoom: 20,
        });

        // Add navigation controls
        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: false,
          }),
          'top-right'
        );

        // Add geolocation control
        map.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: false,
            showUserHeading: false
          }),
          'top-right'
        );

        // Wait for map to load
        map.current.on('load', () => {
          setMapReady(true);
        });

        // Handle map clicks to set coordinates
        map.current.on('click', (e) => {
          const { lng: newLng, lat: newLat } = e.lngLat;
          onCoordinatesChange(newLat, newLng);
        });

      } catch (error) {
        console.error('Failed to initialize backoffice map:', error);
      }
    };

    initializeMap();

    return () => {
      if (map.current && map.current.getCanvas()) {
        try {
          map.current.remove();
        } catch (error) {
          console.warn('Error removing backoffice map:', error);
        }
      }
      map.current = null;
      setMapReady(false);
    };
  }, [isOpen]);

  // Update marker when coordinates change
  useEffect(() => {
    if (!mapReady || !map.current) return;

    // Remove existing marker
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }

    // Add new marker if coordinates are valid
    if (lat && lng && lat !== 0 && lng !== 0) {
      // Create custom marker element
      const el = document.createElement('div');
      el.style.cssText = `
        background-color: #ef4444;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid #ffffff;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.6);
        transform: translate(-50%, -50%);
        margin: 0;
        padding: 0;
      `;

      marker.current = new mapboxgl.Marker({
        element: el,
        anchor: 'center',
        draggable: true
      })
        .setLngLat([lng, lat])
        .addTo(map.current);

      // Handle marker drag
      marker.current.on('dragend', () => {
        if (marker.current) {
          const lngLat = marker.current.getLngLat();
          onCoordinatesChange(lngLat.lat, lngLat.lng);
        }
      });

      // Center map on marker
      map.current.flyTo({
        center: [lng, lat],
        zoom: Math.max(map.current.getZoom(), 15),
        duration: 500
      });
    }
  }, [mapReady, lat, lng, onCoordinatesChange]);

  if (!isOpen) return null;

  return (
    <div className="relative w-full h-64 border rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Carregando mapa...</p>
          </div>
        </div>
      )}
      
      <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-muted-foreground">
        Clique no mapa para definir coordenadas
      </div>
    </div>
  );
};

export default BackofficeMap;