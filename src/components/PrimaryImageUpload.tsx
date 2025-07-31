import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CarImage } from "@/services/api";
import { Upload, X } from "lucide-react";

interface PrimaryImageUploadProps {
  image?: CarImage | null;
  onImageChange: (file: File | null) => void;
  previewUrl?: string;
  disabled?: boolean;
}

const PrimaryImageUpload: React.FC<PrimaryImageUploadProps> = ({ image, onImageChange, previewUrl, disabled }) => {
  const [localPreview, setLocalPreview] = useState<string | null>(previewUrl || image?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setLocalPreview(URL.createObjectURL(file));
      onImageChange(file);
    }
  };

  const handleRemove = () => {
    setLocalPreview(null);
    onImageChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1">Imagem Principal (Capa)</label>
      <div className="flex items-center gap-4">
        <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
          {localPreview ? (
            <img src={localPreview} alt="Pré-visualização" className="w-full h-full object-cover" />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            Selecionar Imagem
          </Button>
          {localPreview && (
            <Button type="button" variant="destructive" size="sm" onClick={handleRemove} disabled={disabled}>
              <X className="h-4 w-4 mr-1" /> Remover
            </Button>
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  );
};

export default PrimaryImageUpload;
