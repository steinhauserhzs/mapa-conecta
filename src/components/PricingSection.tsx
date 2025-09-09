import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const PricingSection = () => {
  const plans = [
    {
      name: "Básico",
      price: "R$ 29",
      period: "/mês",
      description: "Perfeito para uso pessoal",
      features: [
        "5 mapas numerológicos por mês",
        "Mapas pessoais e de assinatura",
        "Análise de telefone e endereço",
        "PDFs básicos",
        "Suporte por email"
      ],
      recommended: false,
      ctaText: "Começar Básico"
    },
    {
      name: "Profissional",
      price: "R$ 79",
      period: "/mês",
      description: "Ideal para numerólogos",
      features: [
        "Mapas ilimitados",
        "Todos os tipos de mapas",
        "Análises completas (telefone, endereço, placa)",
        "PDFs personalizáveis",
        "Templates exclusivos",
        "Suporte prioritário",
        "Backup automático"
      ],
      recommended: true,
      ctaText: "Mais Popular"
    },
    {
      name: "Empresa",
      price: "R$ 149",
      period: "/mês",
      description: "Para equipes e consultórios",
      features: [
        "Tudo do Profissional",
        "5 usuários inclusos",
        "Mapas empresariais avançados",
        "White label personalizado",
        "API para integrações",
        "Suporte dedicado",
        "Treinamento incluído"
      ],
      recommended: false,
      ctaText: "Falar com Vendas"
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 sacred-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 bg-cosmic bg-clip-text text-transparent">
            Planos e Preços
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para suas necessidades. Cancele a qualquer momento.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`relative p-6 bg-card-gradient border transition-mystical hover:scale-105 ${
                plan.recommended 
                  ? 'border-primary mystical-shadow ring-2 ring-primary/20' 
                  : 'border-primary/20 hover:border-primary/40'
              }`}
            >
              {plan.recommended && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cosmic px-4 py-1">
                  Mais Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.recommended ? "cosmic" : "outline"}
                  size="lg"
                >
                  {plan.ctaText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            🎯 <strong>Garantia de 7 dias</strong> • Cancele quando quiser • Sem taxas ocultas
          </p>
          <Button variant="link" className="text-primary">
            Precisa de um plano personalizado? Fale conosco →
          </Button>
        </div>
      </div>
    </section>
  );
};