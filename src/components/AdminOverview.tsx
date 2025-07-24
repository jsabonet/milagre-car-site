import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Plus,
  Car,
  BarChart3,
  Upload,
  Settings,
  Users,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Zap,
  Target,
  Eye
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
  shortcut?: string;
}

interface AdminOverviewProps {
  onNavigateToSection: (section: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateToSection }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Quick actions with better UX
  const quickActions: QuickAction[] = [
    {
      id: 'add-car',
      title: 'Cadastrar Novo Carro',
      description: 'Adicione um novo veículo ao inventário',
      icon: <Plus className="h-6 w-6" />,
      action: () => onNavigateToSection('register'),
      color: 'bg-blue-500 hover:bg-blue-600',
      shortcut: 'Ctrl+N'
    },
    {
      id: 'search-cars',
      title: 'Buscar e Filtrar',
      description: 'Encontre carros específicos rapidamente',
      icon: <Search className="h-6 w-6" />,
      action: () => onNavigateToSection('search'),
      color: 'bg-green-500 hover:bg-green-600',
      shortcut: 'Ctrl+F'
    },
    {
      id: 'upload-images',
      title: 'Upload de Imagens',
      description: 'Adicione fotos aos seus veículos',
      icon: <Upload className="h-6 w-6" />,
      action: () => onNavigateToSection('images'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'manage-categories',
      title: 'Gerenciar Categorias',
      description: 'Organize seus tipos de veículos',
      icon: <Settings className="h-6 w-6" />,
      action: () => onNavigateToSection('categories'),
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  // Recent activity simulation
  const recentActivities = [
    { id: 1, action: 'Novo carro cadastrado', item: 'Honda Civic 2024', time: '5 min atrás', type: 'success' },
    { id: 2, action: 'Imagens enviadas', item: '4 fotos para Toyota Corolla', time: '15 min atrás', type: 'info' },
    { id: 3, action: 'Preço atualizado', item: 'Volkswagen Golf', time: '1 hora atrás', type: 'warning' },
    { id: 4, action: 'Categoria criada', item: 'SUV Compacto', time: '2 horas atrás', type: 'success' }
  ];

  // Performance metrics with better visualization
  const metrics = [
    {
      title: 'Carros Ativos',
      value: '127',
      change: '+8',
      trend: 'up',
      description: 'Veículos disponíveis para venda'
    },
    {
      title: 'Vendas do Mês',
      value: 'R$ 2.4M',
      change: '+12%',
      trend: 'up',
      description: 'Faturamento mensal atual'
    },
    {
      title: 'Visualizações',
      value: '1.2K',
      change: '+5%',
      trend: 'up',
      description: 'Views nos últimos 7 dias'
    },
    {
      title: 'Taxa de Conversão',
      value: '8.3%',
      change: '+0.8%',
      trend: 'up',
      description: 'Leads que viraram vendas'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Upload className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Painel Administrativo</h1>
            <p className="text-blue-100 text-lg">
              Gerencie seu inventário de veículos de forma eficiente
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100">Hoje</p>
            <p className="text-2xl font-bold">{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>

      {/* Quick Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Busque por carros, categorias ou qualquer coisa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-lg h-12"
            />
            <Button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => onNavigateToSection('search')}
            >
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Ações Rápidas</h2>
          <Badge variant="outline" className="text-sm">
            <Zap className="h-3 w-3 mr-1" />
            Mais usadas
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Card 
              key={action.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full ${action.color} text-white group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                    {action.shortcut && (
                      <Badge variant="secondary" className="text-xs">
                        {action.shortcut}
                      </Badge>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Metrics Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Visão Geral</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                  <Badge 
                    variant={metric.trend === 'up' ? 'default' : 'secondary'}
                    className={metric.trend === 'up' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {metric.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</p>
                  <p className="font-medium text-gray-700 mb-1">{metric.title}</p>
                  <p className="text-sm text-gray-500">{metric.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.item}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => onNavigateToSection('dashboard')}
            >
              Ver Todas as Atividades
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Estatísticas Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Car className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">127</p>
              <p className="text-sm text-gray-600">Carros no Inventário</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">1.2K</p>
              <p className="text-sm text-gray-600">Visitantes esta Semana</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">15</p>
              <p className="text-sm text-gray-600">Carros em Destaque</p>
            </div>

            <Button 
              className="w-full" 
              onClick={() => onNavigateToSection('dashboard')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Dashboard Completo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Precisa de Ajuda?</h3>
              <p className="text-gray-600">
                Explore nossos recursos ou entre em contato para suporte
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                📚 Tutorial
              </Button>
              <Button variant="outline">
                💬 Suporte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
