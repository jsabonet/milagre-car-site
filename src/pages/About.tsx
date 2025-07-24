import React from 'react';
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrustSection } from "@/components/TrustSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Users, 
  Target, 
  Heart,
  Car,
  Shield,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle
} from "lucide-react";

const About = () => {
  const timeline = [
    {
      year: "2010",
      title: "Fundação da Empresa",
      description: "Início das atividades com foco em qualidade e atendimento personalizado"
    },
    {
      year: "2015",
      title: "Primeira Expansão",
      description: "Abertura da segunda unidade e ampliação do showroom"
    },
    {
      year: "2018",
      title: "Certificação Premium",
      description: "Reconhecimento como concessionária de excelência no atendimento"
    },
    {
      year: "2022",
      title: "Transformação Digital",
      description: "Lançamento da plataforma online e serviços digitais"
    },
    {
      year: "2025",
      title: "Liderança Regional",
      description: "Referência em vendas de veículos seminovos na região"
    }
  ];

  const team = [
    {
      name: "João Silva",
      role: "Fundador & CEO",
      description: "15 anos de experiência no mercado automotivo",
      image: "👨‍💼"
    },
    {
      name: "Maria Santos",
      role: "Diretora Comercial",
      description: "Especialista em relacionamento com clientes",
      image: "👩‍💼"
    },
    {
      name: "Carlos Lima",
      role: "Gerente de Vendas",
      description: "Expert em financiamento e negociação",
      image: "👨‍💻"
    },
    {
      name: "Ana Costa",
      role: "Coordenadora de Marketing",
      description: "Responsável pela experiência digital",
      image: "👩‍🎨"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Paixão por Carros",
      description: "Cada veículo é selecionado com cuidado e atenção aos detalhes"
    },
    {
      icon: Shield,
      title: "Confiança",
      description: "Transparência total em todas as negociações e processos"
    },
    {
      icon: Users,
      title: "Relacionamento",
      description: "Construímos relações duradouras com nossos clientes"
    },
    {
      icon: Award,
      title: "Excelência",
      description: "Buscamos sempre superar as expectativas"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
                 backgroundSize: '50px 50px'
               }} />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 border-white/30">
              <Car className="h-4 w-4 mr-2" />
              Nossa História
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sobre a <span className="text-yellow-300">Milagre Cars</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Há mais de 15 anos realizando sonhos e conectando pessoas aos seus carros ideais. 
              Somos mais que uma concessionária, somos parceiros na sua jornada automotiva.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>15+ Anos de Experiência</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>2.500+ Clientes Satisfeitos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>4.8★ de Avaliação</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-blue-900">Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Oferecer veículos de qualidade com transparência, confiança e atendimento 
                  excepcional, tornando o sonho do carro próprio uma realidade acessível.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-purple-900">Visão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Ser a concessionária de referência nacional em vendas de veículos seminovos, 
                  reconhecida pela excelência e inovação no atendimento.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-900">Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Honestidade, comprometimento, paixão automotiva e foco total na 
                  satisfação e realização dos sonhos dos nossos clientes.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Our Values Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              O que nos move
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="pt-6">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nossa Jornada
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uma história de crescimento, superação e compromisso com a excelência
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-blue-200"></div>
              
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center mb-8 ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="border-0 shadow-lg">
                      <CardContent className="pt-6">
                        <Badge className="mb-2 bg-blue-100 text-blue-700">
                          {item.year}
                        </Badge>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nossa Equipe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profissionais apaixonados e experientes, dedicados a oferecer o melhor atendimento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
                <CardContent className="pt-6">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section - Statistics */}
      <TrustSection />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para encontrar seu carro ideal?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Nossa equipe está preparada para ajudar você a realizar o sonho do carro próprio
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Car className="h-5 w-5 mr-2" />
              Ver Carros Disponíveis
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <Phone className="h-5 w-5 mr-2" />
              Falar Conosco
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
