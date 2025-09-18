import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  pt: {
    translation: {
      // Landing page
      "appTitle": "Geo Vau",
      "appDescription": "Descobre a Lagoa de Óbidos com histórias que se desbloqueiam à medida que caminhas.",
      "openApp": "Abrir mapa",
      
      // Instructions section
      "instructions": "Ativa a localização, passeia junto à Lagoa e recebe curiosidades sobre aves, plantas e tradições locais.",
      
      // Footer
      "contact": "info@rafaelconstantinobugia.pt",
      "projectInfo": "Projeto piloto - GeoVau - feedback bem-vindo.",
      
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
      "dismiss": "Dispensar",
      
      // Create POI
      "createPOIHere": "Criar POI aqui",
      "createPOI": "Criar ponto de interesse",
      "title": "Título",
      "description": "Descrição",
      "radius": "Raio",
      "imageURL": "URL da imagem",
      "audioURL": "URL do áudio",
      "tags": "Tags",
      "location": "Localização",
      "enterTitle": "Introduz o título",
      "enterDescription": "Introduz a descrição",
      "addTag": "Adicionar tag",
      "add": "Adicionar",
      "cancel": "Cancelar",
      "create": "Criar",
      "creating": "A criar...",
      "success": "Sucesso",
      "titleRequired": "O título é obrigatório",
      "locationRequiredForPOI": "Localização necessária para criar POI",
      "createPOIError": "Erro ao criar ponto de interesse",
      "poiCreatedSuccess": "Ponto de interesse criado com sucesso"
    }
  },
  en: {
    translation: {
      // Landing page
      "appTitle": "Geo Vau",
      "appDescription": "Explore the Óbidos Lagoon with stories that unlock as you walk.",
      "openApp": "Start exploring",
      
      // Instructions section
      "instructions": "Turn on location, walk by the Lagoon, and receive stories about birds, plants and traditions.",
      
      // Footer
      "contact": "info@rafaelconstantinobugia.pt",
      "projectInfo": "Pilot project - GeoVau - feedback welcome.",
      
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
      "dismiss": "Dismiss",
      
      // Create POI
      "createPOIHere": "Create POI here",
      "createPOI": "Create point of interest",
      "title": "Title",
      "description": "Description",
      "radius": "Radius",
      "imageURL": "Image URL",
      "audioURL": "Audio URL",
      "tags": "Tags",
      "location": "Location",
      "enterTitle": "Enter title",
      "enterDescription": "Enter description",
      "addTag": "Add tag",
      "add": "Add",
      "cancel": "Cancel",
      "create": "Create",
      "creating": "Creating...",
      "success": "Success",
      "titleRequired": "Title is required",
      "locationRequiredForPOI": "Location required to create POI",
      "createPOIError": "Error creating point of interest",
      "poiCreatedSuccess": "Point of interest created successfully"
    }
  },
  es: {
    translation: {
      // Landing page
      "appTitle": "Geo Vau",
      "appDescription": "Explora la Laguna de Óbidos con historias que se desbloquean mientras caminas.",
      "openApp": "Comenzar a explorar",
      
      // Instructions section
      "instructions": "Activa la ubicación, camina junto a la Laguna y recibe curiosidades sobre aves, plantas y tradiciones locales.",
      
      // Footer
      "contact": "info@rafaelconstantinobugia.pt",
      "projectInfo": "Proyecto piloto - GeoVau - comentarios bienvenidos.",
      
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
      "dismiss": "Descartar",
      
      // Create POI
      "createPOIHere": "Crear POI aquí",
      "createPOI": "Crear punto de interés",
      "title": "Título",
      "description": "Descripción",
      "radius": "Radio",
      "imageURL": "URL de imagen",
      "audioURL": "URL de audio",
      "tags": "Etiquetas",
      "location": "Ubicación",
      "enterTitle": "Introduce el título",
      "enterDescription": "Introduce la descripción",
      "addTag": "Añadir etiqueta",
      "add": "Añadir",
      "cancel": "Cancelar",
      "create": "Crear",
      "creating": "Creando...",
      "success": "Éxito",
      "titleRequired": "El título es obligatorio",
      "locationRequiredForPOI": "Ubicación necesaria para crear POI",
      "createPOIError": "Error al crear punto de interés",
      "poiCreatedSuccess": "Punto de interés creado con éxito"
    }
  },
  fr: {
    translation: {
      // Landing page
      "appTitle": "Geo Vau",
      "appDescription": "Explorez la lagune d'Óbidos avec des histoires qui se débloquent au fur et à mesure que vous marchez.",
      "openApp": "Commencer à explorer",
      
      // Instructions section
      "instructions": "Activez la localisation, promenez-vous près de la lagune et recevez des curiosités sur les oiseaux, les plantes et les traditions locales.",
      
      // Footer
      "contact": "info@rafaelconstantinobugia.pt",
      "projectInfo": "Projet pilote - GeoVau - commentaires bienvenus.",
      
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
      "dismiss": "Ignorer",
      
      // Create POI
      "createPOIHere": "Créer POI ici",
      "createPOI": "Créer point d'intérêt",
      "title": "Titre",
      "description": "Description",
      "radius": "Rayon",
      "imageURL": "URL de l'image",
      "audioURL": "URL audio",
      "tags": "Tags",
      "location": "Localisation",
      "enterTitle": "Entrez le titre",
      "enterDescription": "Entrez la description",
      "addTag": "Ajouter tag",
      "add": "Ajouter",
      "cancel": "Annuler",
      "create": "Créer",
      "creating": "Création...",
      "success": "Succès",
      "titleRequired": "Le titre est obligatoire",
      "locationRequiredForPOI": "Localisation nécessaire pour créer POI",
      "createPOIError": "Erreur lors de la création du point d'intérêt",
      "poiCreatedSuccess": "Point d'intérêt créé avec succès"
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