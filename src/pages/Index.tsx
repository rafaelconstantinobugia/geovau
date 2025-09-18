import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import LanguageSelector from "@/components/LanguageSelector";
import appMockup from "@/assets/app-mockup.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Language selector in top right */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            {t('appTitle')}
          </h1>
          <p className="mb-8 text-xl text-muted-foreground leading-relaxed">
            {t('appDescription')}
          </p>
          
          {/* App Mockup */}
          <div className="mb-8 flex justify-center">
            <img 
              src={appMockup} 
              alt="Geo Vau app interface showing map with POI markers"
              className="max-w-xs w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          
          <Button 
            onClick={() => navigate('/app')}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
          >
            {t('openApp')}
          </Button>
        </div>
        
        {/* Instructions Section */}
        <div className="mt-12 max-w-xl text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('instructions')}
          </p>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-4 text-center border-t border-border">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground mb-2">
            <a href="mailto:info@rafaelconstantinobugia.pt" className="text-primary hover:text-primary/80">
              {t('contact')}
            </a>
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            <a href="https://geovau.lovable.app" className="text-primary hover:text-primary/80">
              geovau.lovable.app
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            {t('projectInfo')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
