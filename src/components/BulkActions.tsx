import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Trash2, 
  Edit, 
  Star, 
  Eye, 
  Download,
  Archive,
  Tag,
  DollarSign,
  Calendar,
  Palette,
  Settings,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { cars } from "@/data/cars";

interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  confirmRequired?: boolean;
  category: 'status' | 'visibility' | 'pricing' | 'organization' | 'data';
}

interface BulkOperationProgress {
  id: string;
  action: string;
  total: number;
  completed: number;
  status: 'running' | 'completed' | 'error';
  startTime: Date;
}

const bulkActions: BulkAction[] = [
  // Status Actions
  {
    id: 'activate',
    label: 'Ativar Carros',
    icon: <Play className="h-4 w-4" />,
    description: 'Torna os carros selecionados disponíveis para venda',
    category: 'status'
  },
  {
    id: 'deactivate',
    label: 'Desativar Carros',
    icon: <Pause className="h-4 w-4" />,
    description: 'Remove os carros selecionados da vitrine',
    category: 'status'
  },
  {
    id: 'mark_sold',
    label: 'Marcar como Vendido',
    icon: <CheckCircle className="h-4 w-4" />,
    description: 'Marca os carros como vendidos',
    category: 'status'
  },
  {
    id: 'mark_reserved',
    label: 'Marcar como Reservado',
    icon: <Clock className="h-4 w-4" />,
    description: 'Marca os carros como reservados',
    category: 'status'
  },

  // Visibility Actions
  {
    id: 'feature',
    label: 'Destacar Carros',
    icon: <Star className="h-4 w-4" />,
    description: 'Adiciona os carros à seção de destaque',
    category: 'visibility'
  },
  {
    id: 'unfeature',
    label: 'Remover Destaque',
    icon: <Star className="h-4 w-4" />,
    description: 'Remove os carros da seção de destaque',
    category: 'visibility'
  },
  {
    id: 'increase_visibility',
    label: 'Aumentar Visibilidade',
    icon: <Eye className="h-4 w-4" />,
    description: 'Prioriza os carros nos resultados de busca',
    category: 'visibility'
  },

  // Pricing Actions
  {
    id: 'apply_discount',
    label: 'Aplicar Desconto',
    icon: <DollarSign className="h-4 w-4" />,
    description: 'Aplica desconto percentual aos carros selecionados',
    category: 'pricing'
  },
  {
    id: 'update_price',
    label: 'Atualizar Preços',
    icon: <DollarSign className="h-4 w-4" />,
    description: 'Atualiza preços com base em critérios específicos',
    category: 'pricing'
  },

  // Organization Actions
  {
    id: 'add_tags',
    label: 'Adicionar Tags',
    icon: <Tag className="h-4 w-4" />,
    description: 'Adiciona tags de categorização aos carros',
    category: 'organization'
  },
  {
    id: 'update_category',
    label: 'Atualizar Categoria',
    icon: <Archive className="h-4 w-4" />,
    description: 'Move carros para uma categoria específica',
    category: 'organization'
  },
  {
    id: 'organize_by_date',
    label: 'Organizar por Data',
    icon: <Calendar className="h-4 w-4" />,
    description: 'Reorganiza com base na data de adição',
    category: 'organization'
  },

  // Data Actions
  {
    id: 'export_data',
    label: 'Exportar Dados',
    icon: <Download className="h-4 w-4" />,
    description: 'Exporta informações dos carros selecionados',
    category: 'data'
  },
  {
    id: 'update_images',
    label: 'Atualizar Imagens',
    icon: <Palette className="h-4 w-4" />,
    description: 'Processa e otimiza imagens dos carros',
    category: 'data'
  },
  {
    id: 'delete',
    label: 'Excluir Carros',
    icon: <Trash2 className="h-4 w-4" />,
    description: 'Remove permanentemente os carros selecionados',
    confirmRequired: true,
    category: 'data'
  }
];

interface BulkActionsProps {
  selectedItems: string[];
  onActionComplete: (action: string, results: any) => void;
  className?: string;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedItems,
  onActionComplete,
  className
}) => {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [operations, setOperations] = useState<BulkOperationProgress[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<BulkAction | null>(null);

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'status', label: 'Status e Disponibilidade' },
    { value: 'visibility', label: 'Visibilidade' },
    { value: 'pricing', label: 'Preços e Descontos' },
    { value: 'organization', label: 'Organização' },
    { value: 'data', label: 'Dados e Exportação' }
  ];

  const filteredActions = selectedCategory === 'all' 
    ? bulkActions 
    : bulkActions.filter(action => action.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors = {
      status: 'bg-blue-100 text-blue-800',
      visibility: 'bg-green-100 text-green-800',
      pricing: 'bg-orange-100 text-orange-800',
      organization: 'bg-purple-100 text-purple-800',
      data: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const executeAction = async (actionId: string) => {
    const action = bulkActions.find(a => a.id === actionId);
    if (!action) return;

    if (action.confirmRequired) {
      setActionToConfirm(action);
      setShowConfirm(true);
      return;
    }

    await performAction(action);
  };

  const performAction = async (action: BulkAction) => {
    const operationId = Math.random().toString(36).substr(2, 9);
    const operation: BulkOperationProgress = {
      id: operationId,
      action: action.label,
      total: selectedItems.length,
      completed: 0,
      status: 'running',
      startTime: new Date()
    };

    setOperations(prev => [...prev, operation]);

    // Simulate operation progress
    for (let i = 0; i <= selectedItems.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
      
      setOperations(prev => prev.map(op => 
        op.id === operationId 
          ? { ...op, completed: i, status: i === selectedItems.length ? 'completed' : 'running' }
          : op
      ));
    }

    // Notify completion
    onActionComplete(action.id, {
      success: true,
      processedItems: selectedItems.length,
      message: `${action.label} executado com sucesso em ${selectedItems.length} item(s)`
    });

    setSelectedAction('');
  };

  const confirmAction = async () => {
    if (actionToConfirm) {
      await performAction(actionToConfirm);
      setShowConfirm(false);
      setActionToConfirm(null);
    }
  };

  const formatDuration = (startTime: Date): string => {
    const duration = Math.floor((Date.now() - startTime.getTime()) / 1000);
    return `${duration}s`;
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Action Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Ações em Massa
            </CardTitle>
            <CardDescription>
              Execute ações em {selectedItems.length} item(s) selecionado(s)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Archive className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Selecione itens para executar ações em massa</p>
              </div>
            ) : (
              <>
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoria de Ação</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Ação a Executar</label>
                  <Select value={selectedAction} onValueChange={setSelectedAction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma ação" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredActions.map(action => (
                        <SelectItem key={action.id} value={action.id}>
                          <div className="flex items-center gap-2">
                            {action.icon}
                            {action.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Description */}
                {selectedAction && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    {(() => {
                      const action = bulkActions.find(a => a.id === selectedAction);
                      return action ? (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {action.icon}
                            <span className="font-medium">{action.label}</span>
                            <Badge className={getCategoryColor(action.category)}>
                              {categories.find(c => c.value === action.category)?.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700">{action.description}</p>
                          {action.confirmRequired && (
                            <div className="flex items-center gap-2 mt-2 text-orange-600">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-sm font-medium">Esta ação requer confirmação</span>
                            </div>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                {/* Execute Button */}
                <Button 
                  onClick={() => executeAction(selectedAction)}
                  disabled={!selectedAction}
                  className="w-full"
                  size="lg"
                >
                  Executar Ação ({selectedItems.length} item(s))
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Active Operations */}
        {operations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Operações em Andamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operations.map(operation => (
                  <div key={operation.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          operation.status === 'running' ? 'bg-blue-500 animate-pulse' :
                          operation.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="font-medium">{operation.action}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{operation.completed}/{operation.total}</span>
                        <span>{formatDuration(operation.startTime)}</span>
                      </div>
                    </div>
                    <Progress 
                      value={(operation.completed / operation.total) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Ações frequentemente usadas para acesso rápido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {bulkActions.slice(0, 8).map(action => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col gap-2"
                  onClick={() => executeAction(action.id)}
                  disabled={selectedItems.length === 0}
                >
                  {action.icon}
                  <span className="text-xs text-center">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && actionToConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" />
                Confirmar Ação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Tem certeza que deseja executar <strong>{actionToConfirm.label}</strong> em {selectedItems.length} item(s)?
              </p>
              <p className="text-sm text-gray-600">
                {actionToConfirm.description}
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={confirmAction}
                  variant="destructive"
                  className="flex-1"
                >
                  Confirmar
                </Button>
                <Button 
                  onClick={() => setShowConfirm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BulkActions;
