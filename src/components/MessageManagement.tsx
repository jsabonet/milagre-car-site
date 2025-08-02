import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageCircle, 
  User, 
  Phone, 
  Mail, 
  Eye,
  AlertCircle,
  Search,
  MessageSquare,
  Calendar
} from "lucide-react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  subject_display: string;
  message: string;
  preferred_contact: string;
  preferred_contact_display: string;
  status: string;
  status_display: string;
  priority: string;
  priority_display: string;
  admin_response: string;
  responded_at: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  days_since_created: number;
  urgency_level: number;
  is_new: boolean;
}

interface MessageStats {
  total_messages: number;
  new_messages: number;
  in_progress_messages: number;
  resolved_messages: number;
  unread_messages: number;
  urgent_messages: number;
  today_messages: number;
  week_messages: number;
  avg_response_time: number;
  subject_stats: { [key: string]: number };
  status_distribution: { [key: string]: number };
}

const MessageManagement = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<MessageStats | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    subject: 'all',
    search: '',
    is_read: 'all'
  });

  // Buscar dados da API
  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [filters]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      console.log('Token completo:', token);
      
      if (!token) {
        console.error('Token não encontrado no localStorage');
        setMessages([]);
        setLoading(false);
        return;
      }
      
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') queryParams.append(key, value);
      });

      const url = `http://127.0.0.1:8000/api/contact-messages/?${queryParams}`;
      console.log('Fazendo request para:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Dados recebidos:', data);
        setMessages(data.results || data);
      } else {
        console.error('Erro na resposta:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Erro detalhado:', errorText);
        
        // Se for erro 401, o token é inválido
        if (response.status === 401) {
          console.log('Token inválido - redirecionando para login');
          localStorage.removeItem('admin_token');
          window.location.href = '/admin';
        }
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(
        'http://127.0.0.1:8000/api/contact-messages/stats/',
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Erro ao buscar stats:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const handleMarkAsRead = async (messageId: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      await fetch(
        `http://127.0.0.1:8000/api/contact-messages/${messageId}/mark_read/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const handleUpdateStatus = async (messageId: number, status: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      await fetch(
        `http://127.0.0.1:8000/api/contact-messages/${messageId}/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );
      
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleUpdatePriority = async (messageId: number, priority: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      await fetch(
        `http://127.0.0.1:8000/api/contact-messages/${messageId}/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ priority }),
        }
      );
      
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Erro ao atualizar prioridade:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-PT');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Carregando mensagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Mensagens</h1>
          <p className="text-gray-500">Administre mensagens de contacto dos clientes</p>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Mensagens</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_messages}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Não Lidas</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unread_messages}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.today_messages}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.urgent_messages}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Pesquisar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nome, email..."
                  className="pl-8"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="new">Nova</SelectItem>
                  <SelectItem value="in_progress">Em Progresso</SelectItem>
                  <SelectItem value="resolved">Resolvida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={filters.priority} onValueChange={(value) => setFilters({...filters, priority: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Assunto</Label>
              <Select value={filters.subject} onValueChange={(value) => setFilters({...filters, subject: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos assuntos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="financing">Financiamento</SelectItem>
                  <SelectItem value="test_drive">Test Drive</SelectItem>
                  <SelectItem value="info_vehicles">Informações</SelectItem>
                  <SelectItem value="sell_car">Vender Carro</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="is_read">Leitura</Label>
              <Select value={filters.is_read} onValueChange={(value) => setFilters({...filters, is_read: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="true">Lidas</SelectItem>
                  <SelectItem value="false">Não lidas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Mensagens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mensagens ({messages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma mensagem encontrada</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!message.is_read ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{message.name}</span>
                        {!message.is_read && (
                          <Badge variant="secondary" className="text-xs">Nova</Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(message.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getStatusBadgeColor(message.status)}>
                        {message.status_display}
                      </Badge>
                      <Badge className={getPriorityBadgeColor(message.priority)}>
                        {message.priority_display}
                      </Badge>
                    </div>

                    <p className="text-sm font-medium mb-1">{message.subject_display}</p>
                    <p className="text-sm text-gray-600 truncate">{message.message}</p>

                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{message.email}</span>
                      </div>
                      {message.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{message.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detalhes da Mensagem */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Mensagem</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome</Label>
                    <p className="font-medium">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <p className="font-medium">{selectedMessage.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <Label>Contacto Preferido</Label>
                    <p className="font-medium">{selectedMessage.preferred_contact_display}</p>
                  </div>
                </div>

                <div>
                  <Label>Assunto</Label>
                  <p className="font-medium">{selectedMessage.subject_display}</p>
                </div>

                <div>
                  <Label>Mensagem</Label>
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-sm">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={selectedMessage.status}
                      onValueChange={(value) => handleUpdateStatus(selectedMessage.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Nova</SelectItem>
                        <SelectItem value="in_progress">Em Progresso</SelectItem>
                        <SelectItem value="resolved">Resolvida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Prioridade</Label>
                    <Select
                      value={selectedMessage.priority}
                      onValueChange={(value) => handleUpdatePriority(selectedMessage.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedMessage.admin_response && (
                  <div>
                    <Label>Resposta Administrativa</Label>
                    <div className="bg-green-50 p-3 rounded border">
                      <p className="text-sm">{selectedMessage.admin_response}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Respondido em: {formatDate(selectedMessage.responded_at)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  {!selectedMessage.is_read && (
                    <Button
                      variant="outline"
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Marcar como Lida
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Selecione uma mensagem para ver os detalhes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessageManagement;
