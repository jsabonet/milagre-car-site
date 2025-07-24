import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Award, 
  Users, 
  Calendar,
  Star,
  CheckCircle,
  Phone,
  MapPin
} from "lucide-react";

export const TrustSection: React.FC = () => {
  const stats = [
    {
      icon: Calendar,
      value: "15+",
      label: "Anos no Mercado",
      color: "text-blue-600"
    },
    {
      icon: Users,
      value: "2.500+",
      label: "Clientes Satisfeitos",
      color: "text-green-600"
    },
    {
      icon: Shield,
      value: "1.200+",
      label: "Carros Vendidos",
      color: "text-purple-600"
    },
    {
      icon: Award,
      value: "4.8★",
      label: "Avaliação Média",
      color: "text-yellow-600"
    }
  ];

  const certifications = [
    {
      title: "Garantia Estendida",
      description: "12 meses de garantia em todos os veículos",
      icon: Shield
    },
    {
      title: "Procedência Verificada",
      description: "Histórico completo e documentação em dia",
      icon: CheckCircle
    },
    {
      title: "Suporte 24/7",
      description: "Atendimento especializado sempre disponível",
      icon: Phone
    },
    {
      title: "Múltiplas Unidades",
      description: "Localizações estratégicas para seu conforto",
      icon: MapPin
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
            Confiança e Qualidade
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Por que escolher a Milagre Cars?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos referência no mercado automotivo, oferecendo as melhores condições 
            e o atendimento mais especializado para sua próxima compra.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                    <cert.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {cert.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {cert.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Customer Reviews Preview */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            O que nossos clientes dizem
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Carlos Silva",
                rating: 5,
                comment: "Atendimento excepcional! Encontrei o carro dos meus sonhos com facilidade.",
                car: "Honda Civic 2023"
              },
              {
                name: "Ana Santos",
                rating: 5,
                comment: "Processo transparente e sem burocracia. Recomendo para todos!",
                car: "Toyota Corolla 2022"
              },
              {
                name: "Roberto Lima",
                rating: 5,
                comment: "Equipe profissional e preços justos. Voltarei sempre!",
                car: "Volkswagen Jetta 2023"
              }
            ].map((review, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{review.comment}"
                  </p>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500">Comprou: {review.car}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
