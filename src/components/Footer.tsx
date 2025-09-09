import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-card-gradient border-t border-primary/20 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl">🔮</div>
              <span className="text-xl font-bold bg-cosmic bg-clip-text text-transparent">
                Jé Fêrraz Numerologia
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Plataforma completa de Numerologia Cabalística com análises precisas, 
              mapas profissionais e relatórios personalizáveis.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" size="sm">📧 Contato</Button>
              <Button variant="outline" size="sm">💬 WhatsApp</Button>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-mystical">Criar Conta</a></li>
              <li><a href="#" className="hover:text-primary transition-mystical">Fazer Login</a></li>
              <li><a href="#" className="hover:text-primary transition-mystical">Planos e Preços</a></li>
              <li><a href="#" className="hover:text-primary transition-mystical">Recursos</a></li>
            </ul>
          </div>
          
          {/* Suporte */}
          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-mystical">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-primary transition-mystical">Tutoriais</a></li>
              <li><a href="#" className="hover:text-primary transition-mystical">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-mystical">Contato</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary/20 mt-12 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Jé Fêrraz Numerologia. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-mystical">Privacidade</a>
              <a href="#" className="hover:text-primary transition-mystical">Termos</a>
              <a href="#" className="hover:text-primary transition-mystical">LGPD</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};