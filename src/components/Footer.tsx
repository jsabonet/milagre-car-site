import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Linkedin,
  Car,
  CreditCard,
  Shield,
  Award
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">MILAGRE CAR</h3>
              <p className="text-xl text-primary-foreground/80">COMÉRCIO</p>
            </div>
            
            <p className="text-primary-foreground/80 leading-relaxed">
              Há mais de 15 anos no mercado automóvel, oferecendo 
              veículos de qualidade com garantia e financiamento 
              facilitado para todos os nossos clientes.
            </p>

            <div className="flex gap-4">
              <Button variant="secondary" size="icon" className="rounded-full">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Links Rápidos</h4>
            <nav className="space-y-3">
              <a href="#" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Início
              </a>
              <a href="#" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Veículos Usados
              </a>
              <a href="#" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Financiamento
              </a>
              <a href="#" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Vender Carro
              </a>
              <a href="#" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Sobre Nós
              </a>
              <a href="#" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Contacto
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-accent" />
                <div>
                  <p className="text-primary-foreground/80">
                    Av 24 de julho n°329<br />
                    próximo ao 4° cartório-/USTM<br />
                    Maputo, Moçambique
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent" />
                <a href="tel:+258840119527" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  +258 84 011 9527
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent" />
                <a href="mailto:info@milagrecar.mz" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  info@milagrecar.mz
                </a>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 mt-0.5 text-accent" />
                <div className="text-primary-foreground/80">
                  <p>Seg-Sex: 9h-19h</p>
                  <p>Sáb: 9h-18h</p>
                  <p>Dom: Fechado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Newsletter</h4>
            <p className="text-primary-foreground/80">
              Receba as nossas melhores ofertas e novidades diretamente no seu email.
            </p>
            
            <div className="space-y-3">
              <Input 
                type="email" 
                placeholder="Seu email"
                className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button variant="premium" className="w-full">
                Subscrever
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-sm text-primary-foreground/80">Garantia</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-accent" />
                <span className="text-sm text-primary-foreground/80">Financiamento</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-accent" />
                <span className="text-sm text-primary-foreground/80">Test Drive</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-accent" />
                <span className="text-sm text-primary-foreground/80">Certificado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © 2024 Milagre Car Comércio. Todos os direitos reservados.
            </p>
            
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};