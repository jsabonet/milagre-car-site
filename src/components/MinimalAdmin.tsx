import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Plus,
  Car,
  DollarSign,
  TrendingUp,
  Eye,
  Users,
  Settings,
  ArrowRight,
  Menu,
  X
} from "lucide-react";

interface MinimalAdminProps {
  onNavigateToSection: (section: string) => void;
}

export const MinimalAdmin: React.FC<MinimalAdminProps> = ({ onNavigateToSection }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Métricas essenciais
  const essentialMetrics = [
    {
      title: 'Carros Ativos',
      value: '127',
      change: '+8',
      icon: <Car className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Vendas do Mês',
      value: 'R$ 2.4M',
      change: '+12%',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'text-green-600'
    },
    {
      title: 'Visualizações',
      value: '1.2K',
      change: '+5%',
      icon: <Eye className="h-5 w-5" />,
      color: 'text-purple-600'
    },
    {
      title: 'Leads',
      value: '34',
      change: '+3',
      icon: <Users className="h-5 w-5" />,
      color: 'text-orange-600'
    }
  ];

  // Ações principais simplificadas
  const mainActions = [
    {
      title: 'Cadastrar Carro',
      description: 'Adicionar novo veículo',
      icon: <Plus className="h-5 w-5" />,
      action: () => onNavigateToSection('register'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Buscar Carros',
      description: 'Encontrar e gerenciar',
      icon: <Search className="h-5 w-5" />,
      action: () => onNavigateToSection('search'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Configurações',
      description: 'Categorias e uploads',
      icon: <Settings className="h-5 w-5" />,
      action: () => onNavigateToSection('categories'),
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Mobile-Friendly Melhorado */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
                 backgroundSize: '50px 50px'
               }} />
        </div>
        
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* Greeting and Info */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-200 text-sm font-medium">Sistema Online</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Boa {new Date().getHours() < 12 ? 'manhã' : new Date().getHours() < 18 ? 'tarde' : 'noite'}! 👋
                </h1>
                <p className="text-blue-100 text-lg md:text-xl">
                  Gerencie seu inventário com facilidade
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-blue-200" />
                    <span className="text-xs text-blue-200">Carros</span>
                  </div>
                  <p className="text-xl font-bold mt-1">127</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-200" />
                    <span className="text-xs text-green-200">Vendas</span>
                  </div>
                  <p className="text-xl font-bold mt-1">R$ 2.4M</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-200" />
                    <span className="text-xs text-purple-200">Views</span>
                  </div>
                  <p className="text-xl font-bold mt-1">1.2K</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-200" />
                    <span className="text-xs text-orange-200">Leads</span>
                  </div>
                  <p className="text-xl font-bold mt-1">34</p>
                </div>
              </div>
            </div>
            
            {/* Right Side Controls */}
            <div className="flex flex-col items-end gap-4">
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 bg-white/20 rounded-lg backdrop-blur-sm border border-white/30"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              
              {/* Desktop Controls */}
              <div className="hidden md:flex flex-col gap-3">
                <div className="text-right">
                  <p className="text-blue-100 text-sm">Hoje é</p>
                  <p className="text-xl font-semibold">
                    {new Date().toLocaleDateString('pt-BR', { 
                      weekday: 'short', 
                      day: '2-digit', 
                      month: 'short' 
                    })}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-white border-white/40 hover:bg-white/20 bg-white/10 backdrop-blur-sm"
                    onClick={() => window.open('/', '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Site
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Today's Goals - Mobile Optimized */}
          <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Metas de Hoje</h3>
              <span className="text-sm text-blue-200">75% concluído</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>3 carros cadastrados ✓</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>15 fotos enviadas ✓</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>2 categorias pendentes</span>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mt-3">
              <div className="bg-gradient-to-r from-green-400 to-blue-300 h-2 rounded-full" style={{width: '75%'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => window.open('/', '_blank')}
            >
              Ver Site
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => onNavigateToSection('dashboard')}
            >
              Dashboard Completo
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Busca Rápida */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar carros, clientes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-0 shadow-none text-base"
                onKeyPress={(e) => e.key === 'Enter' && onNavigateToSection('search')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Métricas Essenciais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {essentialMetrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {metric.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    {metric.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ações Principais */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mainActions.map((action, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-all cursor-pointer group"
                onClick={action.action}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-105 transition-transform`}>
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-500">{action.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resumo do Dia */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Resumo de Hoje</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Novos Carros</p>
                  <p className="text-xl font-bold text-blue-600">3</p>
                </div>
                <Plus className="h-6 w-6 text-blue-500" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Vendas</p>
                  <p className="text-xl font-bold text-green-600">R$ 180K</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onNavigateToSection('dashboard')}
            >
              Ver Dashboard Detalhado
            </Button>
          </CardContent>
        </Card>

        {/* Links Rápidos para Mobile */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            onClick={() => onNavigateToSection('images')}
            className="h-12"
          >
            📸 Imagens
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onNavigateToSection('categories')}
            className="h-12"
          >
            📁 Categorias
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MinimalAdmin;
