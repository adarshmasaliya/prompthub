import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon, WarningIcon, CloseIcon } from './icons/Icons';

interface ImageUploadBoxProps {
  label: string;
  imageUrl?: string;
  onUpload: (base64: string) => void;
  onRemove: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ImageUploadBox: React.FC<ImageUploadBoxProps> = ({ label, imageUrl, onUpload, onRemove }) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Invalid file type. Please use JPG, PNG, or WebP.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum size is 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onUpload(reader.result as string);
    };
    reader.onerror = () => {
      setError('Failed to read file.');
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div
        className={`relative w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center p-2 transition-colors
        ${isDragging ? 'border-primary bg-blue-50' : 'border-gray-300'}
        ${error ? 'border-red-500' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={ALLOWED_FILE_TYPES.join(',')}
          onChange={handleFileSelect}
        />
        {imageUrl ? (
          <>
            <img src={imageUrl} alt={label} className="max-h-full max-w-full object-contain rounded" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute top-1 right-1 bg-white bg-opacity-70 rounded-full p-0.5 text-gray-700 hover:bg-opacity-100 hover:text-black"
              title="Remove image"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="text-gray-500 cursor-pointer">
            {error ? (
               <>
                 <WarningIcon className="w-8 h-8 mx-auto text-red-500" />
                 <p className="text-sm font-semibold text-red-500 mt-1">{error}</p>
               </>
            ) : (
              <>
                <UploadIcon className="w-8 h-8 mx-auto" />
                <p className="text-sm mt-1">
                  <span className="font-semibold text-primary">Click to upload</span> or drag & drop
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadBox;