import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  HelpCircle, 
  MessageCircle, 
  FileText, 
  Mail, 
  Phone,
  ExternalLink,
  Book,
  Video,
  Users
} from "lucide-react";

const faqItems = [
  {
    pergunta: "Como gerar um mapa numerológico?",
    resposta: "Acesse a seção 'Mapas', preencha os dados da pessoa e clique em 'Gerar Mapa'. Você poderá editar o conteúdo antes de exportar para PDF."
  },
  {
    pergunta: "Posso editar o conteúdo do mapa?",
    resposta: "Sim! Após gerar o mapa, você pode ativar o modo de edição para personalizar textos e explicações antes de exportar."
  },
  {
    pergunta: "Como salvar os dados dos clientes?",
    resposta: "Na seção 'Clientes', você pode cadastrar e gerenciar informações dos seus clientes para facilitar futuras consultas."
  },
  {
    pergunta: "As análises rápidas são precisas?",
    resposta: "As ferramentas de análise rápida (telefones, endereços, placas) seguem os princípios tradicionais da numerologia e são ideais para consultas pontuais."
  }
];

export default function Ajuda() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <HelpCircle className="h-8 w-8" />
          Central de Ajuda
        </h1>
        <p className="text-muted-foreground mt-2">
          Encontre respostas, tutoriais e entre em contato conosco
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Perguntas Frequentes
              </CardTitle>
              <CardDescription>
                Respostas para as dúvidas mais comuns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <h4 className="font-medium mb-2">{item.pergunta}</h4>
                    <p className="text-sm text-muted-foreground">{item.resposta}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Tutoriais em Vídeo
              </CardTitle>
              <CardDescription>
                Aprenda a usar o sistema com nossos vídeos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Video className="mr-2 h-4 w-4" />
                  Como gerar seu primeiro mapa
                  <ExternalLink className="ml-auto h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Video className="mr-2 h-4 w-4" />
                  Editando conteúdo dos mapas
                  <ExternalLink className="ml-auto h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Video className="mr-2 h-4 w-4" />
                  Gerenciando clientes
                  <ExternalLink className="ml-auto h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Envie sua Dúvida
              </CardTitle>
              <CardDescription>
                Não encontrou o que procurava? Entre em contato conosco
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assunto">Assunto</Label>
                <Input id="assunto" placeholder="Qual é sua dúvida?" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mensagem">Mensagem</Label>
                <Textarea 
                  id="mensagem" 
                  placeholder="Descreva sua dúvida ou problema..."
                  rows={4}
                />
              </div>
              
              <Button className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                Enviar Mensagem
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contatos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">suporte@numerologia.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">(11) 99999-9999</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Comunidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Fórum da Comunidade
                <ExternalLink className="ml-auto h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                Grupo no WhatsApp
                <ExternalLink className="ml-auto h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recursos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Manual do Usuário
                <ExternalLink className="ml-auto h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Book className="mr-2 h-4 w-4" />
                Guia de Numerologia
                <ExternalLink className="ml-auto h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}