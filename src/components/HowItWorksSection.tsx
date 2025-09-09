import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Calculator, FileText, Download } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      step: 1,
      icon: <UserPlus className="h-8 w-8" />,
      title: "Crie sua Conta",
      description: "Cadastre-se gratuitamente e acesse nossa plataforma completa de numerologia cabalística.",
      detail: "Processo simples e rápido, sem complicações"
    },
    {
      step: 2,
      icon: <Calculator className="h-8 w-8" />,
      title: "Faça seus Cálculos",
      description: "Use nossa calculadora avançada ou crie mapas completos com base na numerologia tradicional.",
      detail: "Algoritmos validados por numerólogos experientes"
    },
    {
      step: 3,
      icon: <FileText className="h-8 w-8" />,
      title: "Gere Relatórios",
      description: "Crie mapas numerológicos profissionais com interpretações detalhadas e personalizadas.",
      detail: "Templates profissionais e customizáveis"
    },
    {
      step: 4,
      icon: <Download className="h-8 w-8" />,
      title: "Baixe e Compartilhe",
      description: "Exporte seus mapas em PDF profissional ou JSON para uso em outras aplicações.",
      detail: "Formatos compatíveis e de alta qualidade"
    }
  ];

  return (
    <section className="py-24 relative" id="how-it-works">
      <div className="absolute inset-0 starfield opacity-20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-4 sm:mb-6 bg-cosmic bg-clip-text text-transparent">
            Como Funciona
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Em apenas 4 passos simples, você terá acesso completo às análises numerológicas mais precisas do mercado.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-8 h-0.5 bg-gradient-to-r from-primary/60 to-primary/20 transform translate-x-0 z-0"></div>
                )}
                
                <Card className="relative bg-card-gradient border-primary/20 hover:border-primary/40 transition-mystical hover:scale-105 group text-center">
                  <CardHeader className="pb-4">
                    {/* Step number */}
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-cosmic flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-mystical">
                      {step.step}
                    </div>
                    
                    {/* Icon */}
                    <div className="text-primary mb-3 flex justify-center group-hover:scale-110 transition-mystical">
                      {step.icon}
                    </div>
                    
                    <CardTitle className="text-base sm:text-lg mb-2">{step.title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-accent"></div>
                      {step.detail}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          {/* Call to action */}
          <div className="text-center mt-12 sm:mt-16">
            <Card className="max-w-2xl mx-auto p-6 sm:p-8 bg-card-gradient border-primary/20">
              <div className="mb-4">
                <h3 className="text-xl sm:text-2xl font-bold mb-3">Pronto para Começar?</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Junte-se a mais de 10.000 pessoas que já descobriram os segredos da numerologia cabalística.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  🌟 Começar Gratuitamente
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-primary/30 hover:border-primary">
                  Ver Demonstração
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};