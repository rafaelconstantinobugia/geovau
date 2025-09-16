import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  pt: {
    translation: {
      // Landing page
      "appTitle": "Geo Vau",
      "appDescription": "Descobre micro-histórias baseadas na localização ao redor da Lagoa de Óbidos. Caminha, explora e deixa os lugares contarem as suas histórias.",
      "openApp": "Abrir aplicação",
      
      // App header
      "locationActive": "Localização ativa",
      "enableLocation": "Ativar localização",
      "demoMode": "Demo Mode",
      "filters": "Filtros:",
      
      // Location messages
      "nearbyPOI": "Ponto de interesse próximo!",
      "locationEnabled": "Localização ativada",
      "locationEnabledDesc": "A aplicação está agora a monitorizar a tua localização",
      "locationDisabled": "Localização desativada",
      "locationDisabledDesc": "A monitorização foi pausada",
      "demoModeEnabled": "Modo demo ativado",
      "demoModeEnabledDesc": "Localização simulada no Covão dos Mezaranhos",
      
      // Error messages
      "error": "Erro",
      "loadPOIError": "Não foi possível carregar os pontos de interesse",
      "connectionError": "Falha na conexão com o servidor",
      "geolocationNotSupported": "Geolocalização não suportada neste dispositivo",
      "locationError": "Erro de localização",
      "locationErrorDesc": "Não foi possível aceder à localização. Verifica as permissões.",
      
      // Map
      "loadingPOIs": "A carregar pontos de interesse...",
      "mapUnavailable": "Mapa indisponível",
      "configureMapbox": "Configure MAPBOX_PUBLIC_TOKEN",
      "clickToOpen": "Clica para abrir",
      
      // POI Card
      "distance": "Distância",
      "coordinates": "Coordenadas",
      "playAudio": "Reproduzir áudio",
      "pauseAudio": "Pausar áudio",
      "close": "Fechar",
      
      // Language selector
      "selectLanguage": "Selecionar idioma",
      "language": "Idioma",
      
      // Location banner
      "locationTracking": "A localização está a ser utilizada",
      "locationTrackingDesc": "A aplicação está a monitorizar a tua posição",
      "dismiss": "Dispensar"
    }
  },
  en: {
    translation: {
      // Landing page
      "appTitle": "Geo Vau",
      "appDescription": "Discover location-based micro-stories around Óbidos Lagoon. Walk, explore and let places tell their stories.",
      "openApp": "Open application",
      
      // App header
      "locationActive": "Location active",
      "enableLocation": "Enable location",
      "demoMode": "Demo Mode",
      "filters": "Filters:",
      
      // Location messages
      "nearbyPOI": "Nearby point of interest!",
      "locationEnabled": "Location enabled",
      "locationEnabledDesc": "The app is now monitoring your location",
      "locationDisabled": "Location disabled",
      "locationDisabledDesc": "Monitoring has been paused",
      "demoModeEnabled": "Demo mode enabled",
      "demoModeEnabledDesc": "Simulated location at Covão dos Mezaranhos",
      
      // Error messages
      "error": "Error",
      "loadPOIError": "Could not load points of interest",
      "connectionError": "Connection to server failed",
      "geolocationNotSupported": "Geolocation not supported on this device",
      "locationError": "Location error",
      "locationErrorDesc": "Could not access location. Check permissions.",
      
      // Map
      "loadingPOIs": "Loading points of interest...",
      "mapUnavailable": "Map unavailable",
      "configureMapbox": "Configure MAPBOX_PUBLIC_TOKEN",
      "clickToOpen": "Click to open",
      
      // POI Card
      "distance": "Distance",
      "coordinates": "Coordinates",
      "playAudio": "Play audio",
      "pauseAudio": "Pause audio",
      "close": "Close",
      
      // Language selector
      "selectLanguage": "Select language",
      "language": "Language",
      
      // Location banner
      "locationTracking": "Location is being used",
      "locationTrackingDesc": "The app is monitoring your position",
      "dismiss": "Dismiss"
    }
  },
  es: {
    translation: {
      // Landing page
      "appTitle": "Geo Vau",
      "appDescription": "Descubre micro-historias basadas en la ubicación alrededor de la Laguna de Óbidos. Camina, explora y deja que los lugares cuenten sus historias.",
      "openApp": "Abrir aplicación",
      
      // App header
      "locationActive": "Ubicación activa",
      "enableLocation": "Activar ubicación",
      "demoMode": "Modo Demo",
      "filters": "Filtros:",
      
      // Location messages
      "nearbyPOI": "¡Punto de interés cercano!",
      "locationEnabled": "Ubicación activada",
      "locationEnabledDesc": "La aplicación ahora está monitoreando tu ubicación",
      "locationDisabled": "Ubicación desactivada",
      "locationDisabledDesc": "El monitoreo ha sido pausado",
      "demoModeEnabled": "Modo demo activado",
      "demoModeEnabledDesc": "Ubicación simulada en Covão dos Mezaranhos",
      
      // Error messages
      "error": "Error",
      "loadPOIError": "No se pudieron cargar los puntos de interés",
      "connectionError": "Fallo en la conexión con el servidor",
      "geolocationNotSupported": "Geolocalización no soportada en este dispositivo",
      "locationError": "Error de ubicación",
      "locationErrorDesc": "No se pudo acceder a la ubicación. Verifica los permisos.",
      
      // Map
      "loadingPOIs": "Cargando puntos de interés...",
      "mapUnavailable": "Mapa no disponible",
      "configureMapbox": "Configurar MAPBOX_PUBLIC_TOKEN",
      "clickToOpen": "Haz clic para abrir",
      
      // POI Card
      "distance": "Distancia",
      "coordinates": "Coordenadas",
      "playAudio": "Reproducir audio",
      "pauseAudio": "Pausar audio",
      "close": "Cerrar",
      
      // Language selector
      "selectLanguage": "Seleccionar idioma",
      "language": "Idioma",
      
      // Location banner
      "locationTracking": "Se está utilizando la ubicación",
      "locationTrackingDesc": "La aplicación está monitoreando tu posición",
      "dismiss": "Descartar"
    }
  },
  fr: {
    translation: {
      // Landing page
      "appTitle": "Geo Vau",
      "appDescription": "Découvrez des micro-histoires basées sur la localisation autour de la lagune d'Óbidos. Marchez, explorez et laissez les lieux raconter leurs histoires.",
      "openApp": "Ouvrir l'application",
      
      // App header
      "locationActive": "Localisation active",
      "enableLocation": "Activer la localisation",
      "demoMode": "Mode Démo",
      "filters": "Filtres:",
      
      // Location messages
      "nearbyPOI": "Point d'intérêt proche !",
      "locationEnabled": "Localisation activée",
      "locationEnabledDesc": "L'application surveille maintenant votre position",
      "locationDisabled": "Localisation désactivée",
      "locationDisabledDesc": "La surveillance a été mise en pause",
      "demoModeEnabled": "Mode démo activé",
      "demoModeEnabledDesc": "Localisation simulée à Covão dos Mezaranhos",
      
      // Error messages
      "error": "Erreur",
      "loadPOIError": "Impossible de charger les points d'intérêt",
      "connectionError": "Échec de la connexion au serveur",
      "geolocationNotSupported": "Géolocalisation non supportée sur cet appareil",
      "locationError": "Erreur de localisation",
      "locationErrorDesc": "Impossible d'accéder à la localisation. Vérifiez les permissions.",
      
      // Map
      "loadingPOIs": "Chargement des points d'intérêt...",
      "mapUnavailable": "Carte indisponible",
      "configureMapbox": "Configurez MAPBOX_PUBLIC_TOKEN",
      "clickToOpen": "Cliquez pour ouvrir",
      
      // POI Card
      "distance": "Distance",
      "coordinates": "Coordonnées",
      "playAudio": "Lire l'audio",
      "pauseAudio": "Mettre en pause",
      "close": "Fermer",
      
      // Language selector
      "selectLanguage": "Sélectionner la langue",
      "language": "Langue",
      
      // Location banner
      "locationTracking": "La localisation est utilisée",
      "locationTrackingDesc": "L'application surveille votre position",
      "dismiss": "Ignorer"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;