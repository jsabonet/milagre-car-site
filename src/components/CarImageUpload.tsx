import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Star, 
  Trash2,
  Eye,
  Loader2
} from 'lucide-react';
import { apiService, CarImage } from '@/services/api';

interface ImageUploadProps {
  carId: number;
  existingImages?: CarImage[];
  onImagesUpdated?: (images: CarImage[]) => void;
  maxFiles?: number;
  maxSize?: number; // em MB
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const CarImageUpload: React.FC<ImageUploadProps> = ({
  carId,
  existingImages = [],
  onImagesUpdated,
  maxFiles = 10,
  maxSize = 5
}) => {
  const [images, setImages] = useState<CarImage[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    
    // Validações
    if (images.length + acceptedFiles.length > maxFiles) {
      setError(`Máximo de ${maxFiles} imagens permitidas`);
      return;
    }

    const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Algumas imagens excedem o limite de ${maxSize}MB`);
      return;
    }

    setUploading(true);
    
    // Inicializar progresso
    const initialProgress = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }));
    setUploadProgress(initialProgress);

    try {
      // Simular progresso (em uma implementação real, você usaria XMLHttpRequest ou similar)
      for (let i = 0; i < acceptedFiles.length; i++) {
        setUploadProgress(prev => 
          prev.map((item, index) => 
            index === i ? { ...item, progress: 50 } : item
          )
        );
      }

      const result = await apiService.addCarImages(carId, acceptedFiles);
      
      // Finalizar progresso
      setUploadProgress(prev => 
        prev.map(item => ({ ...item, progress: 100, status: 'success' as const }))
      );

      // Atualizar lista de imagens
      const newImages = [...images, ...result.images];
      setImages(newImages);
      onImagesUpdated?.(newImages);

      // Limpar progresso após 2 segundos
      setTimeout(() => {
        setUploadProgress([]);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload das imagens');
      setUploadProgress(prev => 
        prev.map(item => ({ ...item, status: 'error' as const, error: 'Falha no upload' }))
      );
    } finally {
      setUploading(false);
    }
  }, [carId, images, maxFiles, maxSize, onImagesUpdated]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    disabled: uploading
  });

  const handleRemoveImage = async (imageId: number) => {
    try {
      await apiService.removeCarImage(carId, imageId);
      const newImages = images.filter(img => img.id !== imageId);
      setImages(newImages);
      onImagesUpdated?.(newImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover imagem');
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    try {
      console.log('Definindo imagem como principal:', imageId);
      await apiService.setCarPrimaryImage(carId, imageId);
      
      // Atualizar o estado local
      const newImages = images.map(img => ({
        ...img,
        is_primary: img.id === imageId
      }));
      
      console.log('Imagens atualizadas:', newImages);
      setImages(newImages);
      onImagesUpdated?.(newImages);
    } catch (err) {
      console.error('Erro ao definir imagem principal:', err);
      setError(err instanceof Error ? err.message : 'Erro ao definir imagem principal');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Upload de Imagens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-lg text-primary">Solte as imagens aqui...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">
                  Arraste imagens aqui ou clique para selecionar
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, WEBP até {maxSize}MB ({images.length}/{maxFiles} imagens)
                </p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploadProgress.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadProgress.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="truncate">{item.file.name}</span>
                      <span>
                        {item.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin" />}
                        {item.status === 'success' && '✓'}
                        {item.status === 'error' && '✗'}
                      </span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <Alert className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Images Grid */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Imagens do Carro ({images.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image.image}
                      alt={image.alt_text}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Primary Badge */}
                  {image.is_primary && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">
                      <Star className="h-3 w-3 mr-1" />
                      Principal
                    </Badge>
                  )}

                  {/* Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    {!image.is_primary && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          console.log('Botão ⭐ clicado para imagem:', image.id);
                          handleSetPrimary(image.id);
                        }}
                        className="text-xs"
                      >
                        <Star className="h-3 w-3" />
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(image.image, '_blank')}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveImage(image.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CarImageUpload;
