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
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 bg-cosmic bg-clip-text text-transparent">
            Numerologia Cabalística
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Descubra os segredos do seu destino através da Numerologia Cabalística. 
            Mapas completos, análises personalizadas e relatórios profissionais.
          </p>
          
          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 bg-card-gradient border-primary/20 hover:border-primary/40 transition-mystical">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="text-lg font-semibold mb-2">Mapas Completos</h3>
              <p className="text-muted-foreground text-sm">
                Pessoais, empresariais, conjugais e infantis
              </p>
            </Card>
            
            <Card className="p-6 bg-card-gradient border-primary/20 hover:border-primary/40 transition-mystical">
              <div className="text-3xl mb-4">🔮</div>
              <h3 className="text-lg font-semibold mb-2">Análises Precisas</h3>
              <p className="text-muted-foreground text-sm">
                Telefones, endereços, placas e assinaturas
              </p>
            </Card>
            
            <Card className="p-6 bg-card-gradient border-primary/20 hover:border-primary/40 transition-mystical">
              <div className="text-3xl mb-4">📄</div>
              <h3 className="text-lg font-semibold mb-2">PDFs Profissionais</h3>
              <p className="text-muted-foreground text-sm">
                Relatórios personalizáveis e compartilháveis
              </p>
            </Card>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="hero" className="text-lg">
              🌟 Criar Meu Primeiro Mapa
            </Button>
            <Button variant="outline" size="lg" className="border-primary/30 hover:border-primary">
              Ver Planos e Preços
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm mb-4">
              Mais de 10.000 mapas criados • Precisão Cabalística Garantida
            </p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="text-primary">⭐⭐⭐⭐⭐</div>
              <div className="text-sm">4.9/5 avaliação média</div>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
};