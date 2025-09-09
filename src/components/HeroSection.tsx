import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-numerology.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0 starfield opacity-30"></div>
      
      {/* Hero background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      
      {/* Sacred geometry pattern overlay */}
      <div className="absolute inset-0 sacred-pattern opacity-10"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold font-heading mb-4 sm:mb-6 bg-cosmic bg-clip-text text-transparent">
            Numerologia Cabalística
          </h1>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed px-2">
            Descubra os segredos do seu destino através da Numerologia Cabalística. 
            Mapas completos, análises personalizadas e relatórios profissionais.
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card className="p-4 sm:p-6 bg-card-gradient border-primary/20 hover:border-primary/40 transition-mystical">
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">✨</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Mapas Completos</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Pessoais, empresariais, conjugais e infantis
              </p>
            </Card>
            
            <Card className="p-4 sm:p-6 bg-card-gradient border-primary/20 hover:border-primary/40 transition-mystical">
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">🔮</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Análises Precisas</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Telefones, endereços, placas e assinaturas
              </p>
            </Card>
            
            <Card className="p-4 sm:p-6 bg-card-gradient border-primary/20 hover:border-primary/40 transition-mystical sm:col-span-2 lg:col-span-1">
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">📄</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">PDFs Profissionais</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Relatórios personalizáveis e compartilháveis
              </p>
            </Card>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button variant="hero" size="hero" className="w-full sm:w-auto text-base sm:text-lg min-h-[48px]">
              🌟 Criar Meu Primeiro Mapa
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-primary/30 hover:border-primary min-h-[48px]">
              Ver Planos e Preços
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-8 sm:mt-12 text-center px-4">
            <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
              Mais de 10.000 mapas criados • Precisão Cabalística Garantida
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 opacity-60">
              <div className="text-primary text-sm sm:text-base">⭐⭐⭐⭐⭐</div>
              <div className="text-xs sm:text-sm">4.9/5 avaliação média</div>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
};