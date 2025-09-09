import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Maria Silva",
      role: "Numeróloga Profissional",
      location: "São Paulo, SP",
      rating: 5,
      text: "A precisão dos cálculos é impressionante! Uso diariamente em meus atendimentos e os clientes ficam maravilhados com a qualidade dos relatórios.",
      highlight: "Precisão impressionante"
    },
    {
      name: "Carlos Roberto",
      role: "Consultor Espiritual",
      location: "Rio de Janeiro, RJ",
      rating: 5,
      text: "Finalmente uma plataforma que entende realmente de numerologia cabalística. Os mapas são completos e as interpretações são muito profundas.",
      highlight: "Mapas completos"
    },
    {
      name: "Ana Paula",
      role: "Coach de Vida",
      location: "Belo Horizonte, MG",
      rating: 5,
      text: "Revolucionou minha prática! Agora consigo oferecer análises muito mais profissionais aos meus clientes. A exportação em PDF é perfeita.",
      highlight: "PDFs profissionais"
    },
    {
      name: "Roberto Mendes",
      role: "Terapeuta Holístico",
      location: "Salvador, BA",
      rating: 5,
      text: "A análise de compatibilidade conjugal tem ajudado muitos casais. A plataforma é intuitiva e os resultados são sempre certeiros.",
      highlight: "Análises certeiras"
    },
    {
      name: "Fernanda Costa",
      role: "Estudiosa de Esoterismo",
      location: "Porto Alegre, RS",
      rating: 5,
      text: "Como alguém que estuda numerologia há anos, posso dizer que esta é a ferramenta mais completa que já usei. Recomendo para todos!",
      highlight: "Ferramenta completa"
    },
    {
      name: "José Antonio",
      role: "Professor de Numerologia",
      location: "Fortaleza, CE",
      rating: 5,
      text: "Uso nas minhas aulas para demonstrar os cálculos aos alunos. A didática dos relatórios facilita muito o aprendizado. Excelente trabalho!",
      highlight: "Excelente para ensino"
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 starfield opacity-20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-4 sm:mb-6 bg-cosmic bg-clip-text text-transparent">
            O Que Dizem Nossos Usuários
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Mais de 10.000 profissionais e entusiastas confiam em nossa plataforma para suas análises numerológicas.
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 mt-8 opacity-80">
            <div className="flex items-center gap-2">
              <div className="flex text-accent text-lg">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">4.9/5 média</span>
            </div>
            <div className="text-sm text-muted-foreground">
              10.000+ mapas criados
            </div>
            <div className="text-sm text-muted-foreground">
              500+ profissionais ativos
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="p-6 bg-card-gradient border-primary/20 hover:border-primary/40 transition-mystical hover:scale-105 group"
            >
              <CardContent className="p-0">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-accent">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {testimonial.highlight}
                  </Badge>
                </div>
                
                {/* Testimonial text */}
                <blockquote className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
                
                {/* Author info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-cosmic flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground opacity-60">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <Card className="max-w-4xl mx-auto p-6 sm:p-8 bg-card-gradient border-primary/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-4xl sm:text-6xl">⭐</div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Junte-se à Nossa Comunidade</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Faça parte do grupo de numerólogos e entusiastas que já transformaram suas práticas com nossa plataforma.
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">10.000+</div>
                <div className="text-sm text-muted-foreground">Usuários Satisfeitos</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};