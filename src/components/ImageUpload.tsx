import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  File, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Download,
  RotateCcw,
  Crop,
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  size: string;
  type: string;
}

interface ImageUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onFilesUploaded,
  maxFiles = 10,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!acceptedTypes.includes(file.type)) {
      return { valid: false, error: 'Tipo de arquivo não suportado' };
    }
    if (file.size > maxSize * 1024 * 1024) {
      return { valid: false, error: `Arquivo muito grande (máx: ${maxSize}MB)` };
    }
    if (files.length >= maxFiles) {
      return { valid: false, error: `Máximo de ${maxFiles} arquivos permitido` };
    }
    return { valid: true };
  };

  const processFile = useCallback((file: File): UploadedFile => {
    const preview = URL.createObjectURL(file);
    return {
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview,
      status: 'uploading',
      progress: 0,
      size: formatFileSize(file.size),
      type: file.type
    };
  }, []);

  const simulateUpload = useCallback((uploadedFile: UploadedFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, status: 'completed', progress: 100 }
            : f
        ));
      } else {
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, progress }
            : f
        ));
      }
    }, 200);
  }, []);

  const handleFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles: UploadedFile[] = [];
    
    Array.from(fileList).forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        const uploadedFile = processFile(file);
        newFiles.push(uploadedFile);
        simulateUpload(uploadedFile);
      }
    });

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      onFilesUploaded(newFiles);
    }
  }, [files.length, maxFiles, onFilesUploaded, processFile, simulateUpload, validateFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
    setFiles([]);
  }, [files]);

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Upload className="h-4 w-4 text-blue-600" />;
    }
  };

  const completedFiles = files.filter(f => f.status === 'completed');
  const uploadingFiles = files.filter(f => f.status === 'uploading');

  return (
    <div className={cn("space-y-6", className)}>
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Upload de Imagens
          </CardTitle>
          <CardDescription>
            Faça upload de até {maxFiles} imagens (máx. {maxSize}MB cada)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300",
              "hover:border-blue-400 hover:bg-gray-50 cursor-pointer"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleFileSelect}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Arraste e solte suas imagens aqui
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              ou clique para selecionar arquivos
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
              <Badge variant="outline">JPEG</Badge>
              <Badge variant="outline">PNG</Badge>
              <Badge variant="outline">WebP</Badge>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedTypes.join(',')}
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium">
                  Arquivos ({files.length}/{maxFiles})
                </h4>
                <Button onClick={clearAll} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Limpar Todos
                </Button>
              </div>
              
              <Separator className="mb-4" />
              
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <img
                        src={file.preview}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.file.name}
                        </p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(file.status)}
                          <span className="text-xs text-gray-500">{file.size}</span>
                        </div>
                      </div>
                      
                      {file.status === 'uploading' && (
                        <Progress value={file.progress} className="h-2" />
                      )}
                      
                      {file.status === 'completed' && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Crop className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Palette className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => removeFile(file.id)}
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Statistics */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estatísticas do Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{files.length}</div>
                <div className="text-sm text-blue-800">Total de Arquivos</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedFiles.length}</div>
                <div className="text-sm text-green-800">Completados</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{uploadingFiles.length}</div>
                <div className="text-sm text-orange-800">Em Progresso</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;
