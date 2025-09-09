import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const FeaturesSection = () => {
  const features = [
    {
      icon: "👤",
      title: "Mapas Pessoais",
      description: "Análise completa da personalidade, destino, ciclos de vida e números cabalísticos.",
      details: ["Números da Expressão, Alma e Personalidade", "Desafios e Pináculos", "Ciclos de Vida", "Dívidas Kármicas"]
    },
    {
      icon: "💼",
      title: "Mapas Empresariais",
      description: "Avalie a energia de marcas, empresas e nomes comerciais para o sucesso nos negócios.",
      details: ["Análise de razão social", "Nome fantasia", "Data de abertura", "Sugestões de melhoria"]
    },
    {
      icon: "💑",
      title: "Harmonia Conjugal",
      description: "Compatibilidade entre casais, análise de relacionamentos e escolha de datas especiais.",
      details: ["Compatibilidade numerológica", "Análise de relacionamento", "Melhor data para casar", "Números em comum"]
    },
    {
      icon: "👶",
      title: "Mapas Infantis",
      description: "Escolha o melhor nome para bebês, analisando potenciais e evitando dívidas kármicas.",
      details: ["Análise de nomes", "Potencial da criança", "Evitar dívidas kármicas", "Orientações para pais"]
    },
    {
      icon: "📱",
      title: "Análise de Telefones",
      description: "Verifique se seu número de telefone traz energias positivas ou negativas.",
      details: ["Vibração do número", "Energia favorável/desfavorável", "Sugestões de mudança", "Compatibilidade pessoal"]
    },
    {
      icon: "🏠",
      title: "Análise de Endereços",
      description: "Descubra como seu endereço influencia sua vida e relacionamentos.",
      details: ["Energia da residência", "Harmonia familiar", "Prosperidade", "Recomendações"]
    },
    {
      icon: "🚗",
      title: "Análise de Placas",
      description: "Avalie se a placa do seu veículo está em harmonia com sua numerologia pessoal.",
      details: ["Compatibilidade com dono", "Energia de proteção", "Vibrações positivas", "Sugestões"]
    },
    {
      icon: "✍️",
      title: "Correção de Assinatura",
      description: "Otimize sua assinatura para atrair mais sucesso, prosperidade e harmonia.",
      details: ["Múltiplas opções", "Score comparativo", "Sugestões de melhoria", "Análise detalhada"]
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 starfield opacity-20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-4 sm:mb-6 bg-cosmic bg-clip-text text-transparent">
            Recursos Completos
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Nossa plataforma oferece todas as ferramentas necessárias para análises numerológicas precisas e profissionais.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="p-4 sm:p-6 bg-card-gradient border-primary/20 hover:border-primary/40 transition-mystical hover:scale-105 group"
            >
              <CardHeader className="pb-3 sm:pb-4">
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-mystical">
                  {feature.icon}
                </div>
                <CardTitle className="text-base sm:text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Card className="max-w-4xl mx-auto p-8 bg-card-gradient border-primary/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-6xl">🔮</div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-bold mb-2">Precisão Cabalística Garantida</h3>
                <p className="text-muted-foreground">
                  Utilizamos as mais tradicionais tabelas de conversão e métodos de cálculo da Numerologia Cabalística, 
                  com validação de numerólogos experientes e mais de 20 anos de prática.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Precisão</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};