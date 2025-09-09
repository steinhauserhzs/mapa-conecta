import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/contexts/SubscriptionContext";

export const PricingSection = () => {
  const { createCheckout, loading } = useSubscription();
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 sacred-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 bg-cosmic bg-clip-text text-transparent">
            Plano Premium
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Acesso completo e ilimitado a todos os recursos de numerologia. Cancele a qualquer momento.
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <Card className="relative p-6 bg-card-gradient border-primary mystical-shadow ring-2 ring-primary/20">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-cosmic px-4 py-1">
                Mais Popular
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold">Premium</CardTitle>
              <CardDescription className="text-muted-foreground text-lg">
                Tudo que você precisa para numerologia profissional
              </CardDescription>
              <div className="mt-6">
                <span className="text-5xl font-bold text-primary">R$ 35</span>
                <span className="text-muted-foreground text-xl">/mês</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Mapas numerológicos ilimitados</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Todos os tipos de análise (pessoal, empresarial, bebê, casamento)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Análise de telefone, endereço e placa</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>PDFs personalizáveis de alta qualidade</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Suporte prioritário</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Backup automático</span>
                </li>
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full" 
                variant="cosmic"
                size="lg"
                onClick={createCheckout}
                disabled={loading}
              >
                {loading ? "Processando..." : "Começar Agora"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            🎯 <strong>Garantia de 7 dias</strong> • Cancele quando quiser • Sem taxas ocultas
          </p>
          <Button variant="link" className="text-primary">
            Dúvidas? Fale conosco →
          </Button>
        </div>
      </div>
    </section>
  );
};