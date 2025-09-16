import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import LanguageSelector from "@/components/LanguageSelector";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Language selector in top right */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <div className="max-w-2xl text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          {t('appTitle')}
        </h1>
        <p className="mb-8 text-xl text-muted-foreground leading-relaxed">
          {t('appDescription')}
        </p>
        <Button 
          onClick={() => navigate('/app')}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
        >
          {t('openApp')}
        </Button>
      </div>
    </div>
  );
};

export default Index;
