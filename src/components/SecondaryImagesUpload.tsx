import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface SecondaryImagesUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
}

const SecondaryImagesUpload: React.FC<SecondaryImagesUploadProps> = ({ files, onFilesChange, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    onFilesChange([...files, ...newFiles]);
  };

  const handleRemove = (idx: number) => {
    const updated = files.filter((_, i) => i !== idx);
    onFilesChange(updated);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1">Imagens Secundárias (Galeria)</label>
      <div className="flex flex-wrap gap-2">
        {files.length === 0 && (
          <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center border">
            <Upload className="h-6 w-6 text-gray-400" />
          </div>
        )}
        {files.map((file, idx) => (
          <div
            key={idx}
            className="relative w-20 h-20 rounded overflow-hidden border bg-gray-100 flex items-center justify-center"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              className="absolute top-0 right-0 bg-white/80 rounded-bl px-1 py-0.5"
              onClick={() => handleRemove(idx)}
              disabled={disabled}
            >
              <span className="text-xs">✕</span>
            </button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
      >
        Adicionar Imagens
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesChange}
        disabled={disabled}
      />
    </div>
  );
};


export default SecondaryImagesUpload;
