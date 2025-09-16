import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="max-w-2xl text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Vau Explorer
        </h1>
        <p className="mb-8 text-xl text-muted-foreground leading-relaxed">
          Descobre micro-histórias baseadas na localização ao redor da Lagoa de Óbidos. 
          Caminha, explora e deixa os lugares contarem as suas histórias.
        </p>
        <Button 
          onClick={() => navigate('/app')}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
        >
          Abrir aplicação
        </Button>
      </div>
    </div>
  );
};

export default Index;
