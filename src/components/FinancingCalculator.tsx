import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  DollarSign, 
  Percent, 
  Calendar,
  TrendingDown,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export const FinancingCalculator: React.FC = () => {
  const [vehiclePrice, setVehiclePrice] = useState(80000);
  const [downPayment, setDownPayment] = useState(20000);
  const [months, setMonths] = useState(48);
  const [interestRate, setInterestRate] = useState(1.2);

  const calculateFinancing = () => {
    const principal = vehiclePrice - downPayment;
    const monthlyRate = interestRate / 100;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1);
    
    return {
      monthlyPayment,
      totalAmount: monthlyPayment * months + downPayment,
      totalInterest: (monthlyPayment * months) - principal
    };
  };

  const result = calculateFinancing();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
            <Calculator className="h-4 w-4 mr-2" />
            Simulação de Financiamento
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Calcule suas Parcelas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simule diferentes cenários e encontre a melhor condição para seu orçamento
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  Dados do Financiamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Vehicle Price */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="vehicle-price">Valor do Veículo</Label>
                    <span className="text-sm font-semibold text-blue-600">
                      {formatCurrency(vehiclePrice)}
                    </span>
                  </div>
                  <Slider
                    value={[vehiclePrice]}
                    onValueChange={(value) => setVehiclePrice(value[0])}
                    max={300000}
                    min={20000}
                    step={5000}
                    className="w-full"
                  />
                </div>

                {/* Down Payment */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="down-payment">Entrada</Label>
                    <span className="text-sm font-semibold text-green-600">
                      {formatCurrency(downPayment)} ({((downPayment/vehiclePrice)*100).toFixed(0)}%)
                    </span>
                  </div>
                  <Slider
                    value={[downPayment]}
                    onValueChange={(value) => setDownPayment(value[0])}
                    max={vehiclePrice * 0.5}
                    min={vehiclePrice * 0.1}
                    step={1000}
                    className="w-full"
                  />
                </div>

                {/* Term */}
                <div className="space-y-3">
                  <Label htmlFor="months">Prazo de Pagamento</Label>
                  <Select value={months.toString()} onValueChange={(value) => setMonths(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 meses</SelectItem>
                      <SelectItem value="24">24 meses</SelectItem>
                      <SelectItem value="36">36 meses</SelectItem>
                      <SelectItem value="48">48 meses</SelectItem>
                      <SelectItem value="60">60 meses</SelectItem>
                      <SelectItem value="72">72 meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Interest Rate */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="interest-rate">Taxa de Juros (mensal)</Label>
                    <span className="text-sm font-semibold text-purple-600">
                      {interestRate.toFixed(2)}%
                    </span>
                  </div>
                  <Slider
                    value={[interestRate]}
                    onValueChange={(value) => setInterestRate(value[0])}
                    max={3.0}
                    min={0.8}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Resultado da Simulação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Monthly Payment */}
                <div className="p-4 bg-white rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Parcela Mensal</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {formatCurrency(result.monthlyPayment)}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                </div>

                {/* Total Amount */}
                <div className="p-4 bg-white rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Valor Total</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(result.totalAmount)}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </div>

                {/* Total Interest */}
                <div className="p-4 bg-white rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total de Juros</p>
                      <p className="text-xl font-bold text-orange-600">
                        {formatCurrency(result.totalInterest)}
                      </p>
                    </div>
                    <Percent className="h-8 w-8 text-orange-500" />
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg text-white">
                  <h4 className="font-semibold mb-2">Resumo</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Valor financiado:</span>
                      <span>{formatCurrency(vehiclePrice - downPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prazo:</span>
                      <span>{months} meses</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa:</span>
                      <span>{interestRate}% a.m.</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Solicitar Aprovação
                  </Button>
                  <Button variant="outline" className="w-full">
                    Falar com Consultor
                  </Button>
                </div>

                {/* Disclaimer */}
                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-800">
                    Valores simulados. Condições finais sujeitas à análise de crédito.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
