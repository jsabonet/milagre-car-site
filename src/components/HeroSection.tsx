import { Button } from "@/components/ui/button";
import { Search, Star, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-cars.jpg";

const HeroSection = () => {
  const stats = [
    { icon: Star, label: "Avaliação", value: "4.9/5" },
    { icon: Users, label: "Clientes Satisfeitos", value: "500+" },
    { icon: Award, label: "Anos de Experiência", value: "15+" },
  ];

  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="MILAGRE CAR Showroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Encontre o Seu
            <span className="text-accent block">Carro dos Sonhos</span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Na MILAGRE CAR COMÉRCIO, oferecemos os melhores veículos com 
            qualidade garantida e atendimento personalizado há mais de 15 anos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button variant="hero" size="lg" className="text-lg px-8">
              <Search className="h-5 w-5 mr-2" />
              Ver Catálogo
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-white/10 text-white border-white/20 hover:bg-white/20">
              Fale Conosco
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <stat.icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/70 text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Cards */}
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
          <h3 className="font-bold mb-2">Financiamento Facilitado</h3>
          <p className="text-sm text-white/80">Aprovação em até 24h</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;