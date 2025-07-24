import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  FileText, 
  Clock,
  Shield,
  CheckCircle,
  Users,
  Calculator,
  CreditCard,
  Building,
  HelpCircle,
  TrendingUp,
  Award,
  Phone
} from "lucide-react";

export const FinancingGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState('process');

  const bankPartners = [
    {
      name: "Standard Bank",
      logo: "🏛️",
      taxaMin: "12%",
      prazoMax: "72 meses",
      especialidade: "Funcionários públicos"
    },
    {
      name: "BIM (Banco Internacional de Moçambique)",
      logo: "🏦",
      taxaMin: "14%",
      prazoMax: "60 meses",
      especialidade: "Primeira habilitação"
    },
    {
      name: "Millennium BIM",
      logo: "🔴",
      taxaMin: "13%",
      prazoMax: "60 meses",
      especialidade: "Clientes correntistas"
    },
    {
      name: "FNB Moçambique",
      logo: "🟠",
      taxaMin: "15%",
      prazoMax: "48 meses",
      especialidade: "Carros novos e seminovos"
    },
    {
      name: "Banco Terra",
      logo: "🔵",
      taxaMin: "16%",
      prazoMax: "60 meses",
      especialidade: "Autônomos e liberais"
    },
    {
      name: "Ecobank Moçambique",
      logo: "💳",
      taxaMin: "14.5%",
      prazoMax: "48 meses",
      especialidade: "Aprovação rápida"
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Escolha do Veículo",
      description: "Selecione o carro ideal em nosso estoque",
      icon: CreditCard,
      details: [
        "Navegue pelo catálogo online",
        "Agende test drive gratuito",
        "Avalie condições e histórico",
        "Negocie valor e condições"
      ]
    },
    {
      step: 2,
      title: "Simulação",
      description: "Use nossa calculadora para ver as parcelas",
      icon: Calculator,
      details: [
        "Defina valor da entrada",
        "Escolha prazo ideal",
        "Compare diferentes cenários",
        "Veja o custo total"
      ]
    },
    {
      step: 3,
      title: "Documentação",
      description: "Reúna os documentos necessários",
      icon: FileText,
      details: [
        "CPF e RG atualizados",
        "Comprovante de renda",
        "Comprovante de residência",
        "Referências pessoais"
      ]
    },
    {
      step: 4,
      title: "Análise de Crédito",
      description: "Aguarde aprovação do banco parceiro",
      icon: Users,
      details: [
        "Consulta aos órgãos de proteção",
        "Verificação de renda",
        "Análise do perfil",
        "Resposta em até 24h"
      ]
    },
    {
      step: 5,
      title: "Aprovação",
      description: "Assinatura do contrato e liberação",
      icon: CheckCircle,
      details: [
        "Assinatura do contrato",
        "Pagamento da entrada",
        "Transferência do veículo",
        "Entrega das chaves"
      ]
    }
  ];

  const faqItems = [
    {
      question: "Qual a taxa de juros mais baixa disponível?",
      answer: "Nossas taxas começam a partir de 0.89% a.m., variando conforme seu perfil de crédito, relacionamento bancário e prazo escolhido."
    },
    {
      question: "Posso financiar 100% do valor do carro?",
      answer: "Sim! Alguns bancos parceiros financiam até 100% do valor, mas recomendamos uma entrada de pelo menos 20% para melhores condições."
    },
    {
      question: "Quanto tempo leva para aprovação?",
      answer: "O processo de aprovação leva entre 2 a 24 horas. Para clientes com relacionamento bancário, pode ser ainda mais rápido."
    },
    {
      question: "Preciso ter conta no banco para conseguir financiamento?",
      answer: "Não é obrigatório, mas ter relacionamento bancário pode garantir taxas mais atrativas e aprovação mais rápida."
    },
    {
      question: "Posso quitar antecipadamente sem multa?",
      answer: "Sim! Todos nossos parceiros permitem quitação antecipada com desconto proporcional dos juros futuros."
    },
    {
      question: "Aceita negativados no SPC/Serasa?",
      answer: "Analisamos caso a caso. Temos parceiros que aprovam mesmo com restrições, mediante comprovação de renda adequada."
    }
  ];

  const advantages = [
    {
      icon: Award,
      title: "Melhores Taxas",
      description: "Parcerias exclusivas garantem as menores taxas do mercado"
    },
    {
      icon: Clock,
      title: "Aprovação Rápida",
      description: "Processo otimizado com resposta em até 24 horas"
    },
    {
      icon: Shield,
      title: "Sem Pegadinhas",
      description: "Transparência total nas condições e custos"
    },
    {
      icon: Users,
      title: "Suporte Especializado",
      description: "Consultores especialistas em financiamento automotivo"
    },
    {
      icon: Building,
      title: "Múltiplos Bancos",
      description: "6 parceiros bancários para melhor aprovação"
    },
    {
      icon: TrendingUp,
      title: "Flexibilidade",
      description: "Prazos de 12 a 72 meses conforme seu orçamento"
    }
  ];

  const tabs = [
    { id: 'process', label: 'Como Funciona', icon: Clock },
    { id: 'partners', label: 'Bancos Parceiros', icon: Building },
    { id: 'faq', label: 'Perguntas Frequentes', icon: HelpCircle },
    { id: 'advantages', label: 'Vantagens', icon: Award }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
            <DollarSign className="h-4 w-4 mr-2" />
            Financiamento Automotivo
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tudo sobre Financiamento
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Guia completo para financiar seu carro dos sonhos com as melhores condições do mercado
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {/* Como Funciona */}
          {activeTab === 'process' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Processo de Financiamento
                </h3>
                <p className="text-gray-600">
                  5 passos simples para financiar seu veículo
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {processSteps.map((step, index) => (
                  <Card key={index} className="relative border-0 shadow-lg hover:shadow-xl transition-all">
                    <CardHeader className="text-center">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 relative">
                        <step.icon className="h-8 w-8 text-blue-600" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {step.step}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Bancos Parceiros */}
          {activeTab === 'partners' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Nossos Parceiros Bancários
                </h3>
                <p className="text-gray-600">
                  Trabalhamos com os melhores bancos para garantir sua aprovação
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bankPartners.map((bank, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-4xl mb-4">{bank.logo}</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {bank.name}
                        </h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Taxa mínima:</span>
                            <Badge className="bg-green-100 text-green-700">
                              {bank.taxaMin} a.m.
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Prazo máximo:</span>
                            <span className="font-semibold text-blue-600">{bank.prazoMax}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <strong>Especialidade:</strong> {bank.especialidade}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Phone className="h-5 w-5 mr-2" />
                  Falar com Especialista
                </Button>
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Perguntas Frequentes
                </h3>
                <p className="text-gray-600">
                  Tire suas principais dúvidas sobre financiamento automotivo
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqItems.map((item, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-start gap-3">
                        <HelpCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                        {item.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center bg-blue-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">
                  Ainda tem dúvidas?
                </h4>
                <p className="text-blue-700 mb-4">
                  Nossa equipe especializada está pronta para ajudar você
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Phone className="h-4 w-4 mr-2" />
                  WhatsApp: +258 84 999-8888
                </Button>
              </div>
            </div>
          )}

          {/* Vantagens */}
          {activeTab === 'advantages' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Por que financiar com a Milagre Cars?
                </h3>
                <p className="text-gray-600">
                  Vantagens exclusivas que fazem a diferença na sua compra
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advantages.map((advantage, index) => (
                  <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardContent className="pt-6">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <advantage.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-600">
                        {advantage.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl text-center">
                <h4 className="text-2xl font-bold mb-4">
                  Pronto para financiar seu carro dos sonhos?
                </h4>
                <p className="text-blue-100 mb-6 text-lg">
                  Comece agora mesmo com nossa calculadora e descubra as melhores condições
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    <Calculator className="h-5 w-5 mr-2" />
                    Calcular Parcelas
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                    <Phone className="h-5 w-5 mr-2" />
                    Falar com Consultor
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
