import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Phone, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Mensagem Enviada!",
      description: "Entraremos em contato em breve. Obrigado pelo seu interesse!",
    });
    
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      description: "Resposta em até 24h",
      contact: "contato@jeferraznumerologia.com.br",
      action: "Enviar Email"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "WhatsApp",
      description: "Atendimento direto",
      contact: "+55 (11) 9 9999-9999",
      action: "Chamar no WhatsApp"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Telefone",
      description: "Seg à Sex, 9h às 18h",
      contact: "+55 (11) 3333-3333",
      action: "Ligar Agora"
    }
  ];

  return (
    <section className="py-24 relative" id="contact">
      <div className="absolute inset-0 starfield opacity-20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-4 sm:mb-6 bg-cosmic bg-clip-text text-transparent">
            Entre em Contato
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Tem dúvidas sobre numerologia ou precisa de ajuda com nossa plataforma? Estamos aqui para ajudar!
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <Card className="bg-card-gradient border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Envie sua Mensagem
              </CardTitle>
              <CardDescription>
                Preencha o formulário e entraremos em contato o mais breve possível.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Como podemos ajudar?"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Descreva sua dúvida ou necessidade..."
                    rows={5}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <Card key={index} className="bg-card-gradient border-primary/20 hover:border-primary/40 transition-mystical">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="text-primary">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{method.title}</h3>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                        <p className="font-medium">{method.contact}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        {method.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Business Hours */}
            <Card className="bg-card-gradient border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Horário de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Segunda à Sexta</span>
                    <span className="font-medium">09h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado</span>
                    <span className="font-medium">09h00 - 14h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo</span>
                    <span className="text-muted-foreground">Fechado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Location */}
            <Card className="bg-card-gradient border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Atendemos clientes de todo o Brasil através da nossa plataforma digital.
                </p>
                <div className="text-sm">
                  <p className="font-medium">São Paulo, SP - Brasil</p>
                  <p className="text-muted-foreground">
                    Atendimento 100% online para sua comodidade
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* FAQ Quick Links */}
            <Card className="bg-card-gradient border-primary/20">
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
                <CardDescription>
                  Encontre respostas rápidas para as dúvidas mais comuns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <Button variant="ghost" className="w-full justify-start text-left h-auto p-2">
                    Como funciona a numerologia cabalística?
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-left h-auto p-2">
                    Posso cancelar minha assinatura a qualquer momento?
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-left h-auto p-2">
                    Os mapas são baseados em fontes tradicionais?
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-left h-auto p-2">
                    Como exportar meus relatórios em PDF?
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};