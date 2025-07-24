import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Calendar, 
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export const TestDriveBooking: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    vehicle: '',
    location: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const availableCars = [
    'Honda Civic 2023',
    'Toyota Corolla 2022',
    'Volkswagen Jetta 2023',
    'Hyundai HB20 2023',
    'Jeep Compass 2022',
    'Chevrolet Onix 2023'
  ];

  const locations = [
    'São Paulo - Loja Centro',
    'São Paulo - Loja Zona Sul',
    'Rio de Janeiro - Barra da Tijuca',
    'Belo Horizonte - Savassi'
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envio
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      preferredDate: '',
      preferredTime: '',
      vehicle: '',
      location: '',
      message: ''
    });
  };

  const isFormValid = formData.name && formData.email && formData.phone && 
                     formData.preferredDate && formData.vehicle && formData.location;

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Car className="h-4 w-4 mr-2" />
            Test Drive Gratuito
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Agende seu Test Drive
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experimente o carro dos seus sonhos sem compromisso. 
            Agendamento rápido e atendimento personalizado.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {isSubmitted ? (
            // Success Message
            <Card className="shadow-xl border-0 bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">
                    Test Drive Agendado com Sucesso!
                  </h3>
                  <p className="text-green-700 mb-6">
                    Recebemos sua solicitação e entraremos em contato em até 30 minutos 
                    para confirmar todos os detalhes.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Próximos Passos:</h4>
                    <ul className="text-left text-green-700 space-y-1">
                      <li>✓ Confirmação por WhatsApp ou telefone</li>
                      <li>✓ Preparação do veículo para test drive</li>
                      <li>✓ Documentação necessária: CNH válida</li>
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
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Informações do Agendamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Personal Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Nome Completo *
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Seu nome completo"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Telefone *
                          </Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="(11) 99999-9999"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          E-mail *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>

                      {/* Vehicle Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="vehicle" className="flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          Veículo de Interesse *
                        </Label>
                        <Select value={formData.vehicle} onValueChange={(value) => handleInputChange('vehicle', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o veículo" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCars.map((car) => (
                              <SelectItem key={car} value={car}>
                                {car}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Date and Time */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Data Preferida *
                          </Label>
                          <Input
                            id="date"
                            type="date"
                            value={formData.preferredDate}
                            onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="time" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Horário Preferido
                          </Label>
                          <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o horário" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Local de Preferência *
                        </Label>
                        <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a loja" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <Label htmlFor="message">Observações</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Alguma observação especial para o test drive?"
                          rows={3}
                        />
                      </div>

                      {/* Submit */}
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700" 
                        size="lg"
                        disabled={!isFormValid}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar Test Drive Gratuito
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Info Sidebar */}
              <div className="space-y-6">
                {/* What to Expect */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">O que esperar?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Test drive de até 30 min</p>
                        <p className="text-sm text-gray-600">Tempo suficiente para conhecer o veículo</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Consultor especializado</p>
                        <p className="text-sm text-gray-600">Tire todas suas dúvidas</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Sem compromisso</p>
                        <p className="text-sm text-gray-600">Experimente sem pressão</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card className="shadow-lg border-0 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      Documentos Necessários
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• CNH válida (obrigatório)</li>
                      <li>• RG ou CPF</li>
                      <li>• Comprovante de renda (se interessado em financiamento)</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Contact */}
                <Card className="shadow-lg border-0 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Precisa de Ajuda?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Phone className="h-4 w-4 mr-2" />
                        (11) 3000-1234
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="h-4 w-4 mr-2" />
                        contato@milagrecars.com
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
  );
};
