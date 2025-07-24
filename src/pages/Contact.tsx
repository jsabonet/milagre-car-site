import React, { useState } from 'react';
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestDriveBooking } from "@/components/TestDriveBooking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Car,
  Users,
  Calendar,
  AlertCircle,
  Instagram,
  Facebook,
  Youtube
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone",
      primary: "+258 21 300-1234",
      secondary: "+258 84 999-8888",
      description: "Atendimento: Seg-Sex 8h às 18h, Sáb 8h às 14h"
    },
    {
      icon: Mail,
      title: "E-mail",
      primary: "contato@milagrecars.com",
      secondary: "vendas@milagrecars.com",
      description: "Resposta em até 2 horas úteis"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      primary: "+258 84 999-8888",
      secondary: "Chat Online 24/7",
      description: "Resposta imediata durante horário comercial"
    }
  ];

  const locations = [
    {
      name: "Loja Maputo",
      address: "Av. Julius Nyerere, 1500 - Polana",
      city: "Maputo, Moçambique",
      phone: "+258 21 300-1234",
      hours: "Seg-Sex: 8h às 18h | Sáb: 8h às 14h",
      services: ["Vendas", "Financiamento", "Test Drive"]
    },
    {
      name: "Loja Matola",
      address: "Av. de Moçambique, 2000 - Matola",
      city: "Matola, Moçambique",
      phone: "+258 21 300-5678",
      hours: "Seg-Sex: 8h às 18h | Sáb: 8h às 14h",
      services: ["Vendas", "Vistoria", "Documentação"]
    }
  ];

  const subjects = [
    "Informações sobre veículos",
    "Agendamento de test drive",
    "Financiamento e parcelas",
    "Venda do meu carro",
    "Suporte pós-venda",
    "Parcerias comerciais",
    "Outros assuntos"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      preferredContact: ''
    });
  };

  const isFormValid = formData.name && formData.email && formData.subject && formData.message;

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
              <MessageCircle className="h-4 w-4 mr-2" />
              Fale Conosco
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Entre em <span className="text-yellow-300">Contato</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Estamos aqui para ajudar você a encontrar o carro perfeito. 
              Entre em contato e tire todas suas dúvidas!
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>Resposta Rápida</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>Atendimento Especializado</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>Suporte Completo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Canais de Atendimento
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Escolha o canal de sua preferência para entrar em contato conosco
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <info.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-blue-900">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-2xl font-bold text-gray-900">{info.primary}</p>
                    <p className="text-lg text-blue-600">{info.secondary}</p>
                    <p className="text-sm text-gray-600">{info.description}</p>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <info.icon className="h-4 w-4 mr-2" />
                    Entrar em Contato
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Envie sua Mensagem
              </h2>
              <p className="text-xl text-gray-600">
                Preencha o formulário abaixo e entraremos em contato rapidamente
              </p>
            </div>

            {isSubmitted ? (
              <Card className="shadow-xl border-0 bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 mb-2">
                      Mensagem Enviada com Sucesso!
                    </h3>
                    <p className="text-green-700 mb-6">
                      Recebemos sua mensagem e retornaremos em até 2 horas úteis.
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">O que acontece agora:</h4>
                      <ul className="text-left text-green-700 space-y-1">
                        <li>✓ Análise da sua solicitação</li>
                        <li>✓ Contato por WhatsApp ou telefone</li>
                        <li>✓ Agendamento personalizado</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2">
                  <Card className="shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5 text-blue-600" />
                        Formulário de Contato
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Seu nome completo"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Telefone *</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="+258 84 999-9999"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="seu@email.com"
                            required
                          />
                        </div>

                        {/* Subject */}
                        <div className="space-y-2">
                          <Label htmlFor="subject">Assunto *</Label>
                          <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o assunto" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Preferred Contact */}
                        <div className="space-y-2">
                          <Label htmlFor="contact">Preferência de Contato</Label>
                          <Select value={formData.preferredContact} onValueChange={(value) => handleInputChange('preferredContact', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Como prefere ser contatado?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                              <SelectItem value="phone">Telefone</SelectItem>
                              <SelectItem value="email">E-mail</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                          <Label htmlFor="message">Mensagem *</Label>
                          <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            placeholder="Conte-nos como podemos ajudar..."
                            rows={5}
                            required
                          />
                        </div>

                        {/* Submit */}
                        <Button 
                          type="submit" 
                          className="w-full bg-blue-600 hover:bg-blue-700" 
                          size="lg"
                          disabled={!isFormValid}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Mensagem
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Options */}
                <div className="space-y-6">
                  {/* Quick Contact */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="text-lg">Contato Rápido</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start text-green-600 border-green-200 hover:bg-green-50">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp: +258 84 999-8888
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50">
                        <Phone className="h-4 w-4 mr-2" />
                        Telefone: +258 21 300-1234
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-purple-600 border-purple-200 hover:bg-purple-50">
                        <Mail className="h-4 w-4 mr-2" />
                        E-mail
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Office Hours */}
                  <Card className="shadow-lg border-0 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        Horário de Atendimento
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Segunda a Sexta:</span>
                          <span className="font-semibold">8h às 18h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sábado:</span>
                          <span className="font-semibold">8h às 14h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Domingo:</span>
                          <span className="text-gray-500">Fechado</span>
                        </div>
                        <div className="mt-4 p-2 bg-green-100 rounded text-green-800 text-xs">
                          <strong>WhatsApp 24/7</strong> - Resposta automática fora do horário
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Social Media */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="text-lg">Redes Sociais</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Instagram className="h-4 w-4 mr-2" />
                          @milagrecars
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Facebook className="h-4 w-4 mr-2" />
                          Milagre Cars
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Youtube className="h-4 w-4 mr-2" />
                          Milagre Cars
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nossas Lojas
            </h2>
            <p className="text-xl text-gray-600">
              Visite uma de nossas unidades e conheça nosso showroom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {locations.map((location, index) => (
              <Card key={index} className="shadow-xl border-0 hover:shadow-2xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    {location.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900">{location.address}</p>
                    <p className="text-gray-600">{location.city}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold">{location.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">{location.hours}</span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Serviços disponíveis:</p>
                    <div className="flex flex-wrap gap-2">
                      {location.services.map((service, idx) => (
                        <Badge key={idx} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <MapPin className="h-4 w-4 mr-2" />
                    Ver no Mapa
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Test Drive Booking */}
      <TestDriveBooking />

      <Footer />
    </div>
  );
};

export default Contact;
