import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Início", href: "#home" },
    { name: "Recursos", href: "#features" },
    { name: "Planos", href: "#pricing" },
    { name: "Como Funciona", href: "#how-it-works" },
    { name: "Contato", href: "#contact" }
  ];

  const userLinks = user ? [
    { name: "Calculadora", href: "/numerology" }
  ] : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-primary/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="text-xl sm:text-2xl">🔮</div>
            <span className="text-base sm:text-lg lg:text-xl font-bold bg-cosmic bg-clip-text text-transparent">
              <span className="hidden xs:inline">Jé Fêrraz </span>Numerologia
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-mystical hover:scale-105"
              >
                {link.name}
              </a>
            ))}
            {userLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-muted-foreground hover:text-primary transition-mystical hover:scale-105"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
                {profile?.name && (
                  <span className="text-sm text-muted-foreground">
                    {profile.name}
                  </span>
                )}
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="cosmic" size="sm">
                    Começar Agora
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-primary/20 bg-background/95 backdrop-blur-lg">
            <div className="py-4 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-4 py-2 text-muted-foreground hover:text-primary transition-mystical"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              {userLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block px-4 py-2 text-muted-foreground hover:text-primary transition-mystical"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="px-4 py-2 space-y-2">
                {user ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="outline" className="w-full" size="sm">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full" size="sm" onClick={signOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </Button>
                    {profile?.name && (
                      <div className="px-2 py-1 text-sm text-muted-foreground text-center">
                        {profile.name}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button variant="outline" className="w-full" size="sm">
                        Entrar
                      </Button>
                    </Link>
                    <Link to="/auth">
                      <Button variant="cosmic" className="w-full" size="sm">
                        Começar Agora
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};