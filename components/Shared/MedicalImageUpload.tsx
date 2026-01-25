import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, FileImage, AlertCircle, Image as ImageIcon, ScanLine } from 'lucide-react';

interface MedicalImageUploadProps {
  onFileSelect: (file: File | null) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  className?: string;
  disabled?: boolean;
  isScanning?: boolean;
}

const MedicalImageUpload: React.FC<MedicalImageUploadProps> = ({
  onFileSelect,
  maxSizeMB = 10,
  acceptedTypes = ['image/jpeg', 'image/png'],
  className = '',
  disabled = false,
  isScanning = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    setError(null);
    
    // Validate Type
    if (!acceptedTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload a JPEG or PNG image.');
      return;
    }

    // Validate Size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    setFile(selectedFile);
    
    // Create Preview
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    
    // Propagate to parent
    onFileSelect(selectedFile);
  };

  const onDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || isScanning) return;

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || isScanning) return;
    
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isScanning) return;

    setFile(null);
    setPreview(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className} ${disabled && !isScanning ? 'opacity-60 pointer-events-none' : ''}`}>
      <div
        className={`
          relative w-full h-64 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
          ${isScanning 
             ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
             : dragActive 
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 border-dashed' 
                : 'border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-600'
          }
          ${file ? 'border-solid p-0' : 'p-6'}
        `}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        onClick={() => !file && !disabled && !isScanning && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={false}
          onChange={onChange}
          accept={acceptedTypes.join(',')}
          disabled={disabled || isScanning}
        />

        {file && preview ? (
          // File Selected State
          <div className="w-full h-full relative group cursor-default">
            <img 
              src={preview} 
              alt="Preview" 
              className={`w-full h-full object-contain bg-zinc-900/5 dark:bg-black/40 transition-all duration-700 ${isScanning ? 'scale-110 blur-sm opacity-50' : 'scale-100'}`} 
            />
            
            {/* Active Scanning Overlay */}
            {isScanning && (
               <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                  <div className="absolute inset-0 bg-blue-900/10 dark:bg-blue-500/10 z-0"></div>
                  {/* Grid overlay */}
                  <div className="absolute inset-0 z-0" style={{ 
                      backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)', 
                      backgroundSize: '40px 40px' 
                  }}></div>
                  
                  <ScanLine className="w-12 h-12 text-blue-500 animate-pulse z-20" />
                  <p className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest animate-pulse z-20 bg-white/80 dark:bg-black/80 px-3 py-1 rounded-full">
                    Analyzing ROI...
                  </p>
               </div>
            )}

            {/* Overlay Info Card (Hide during scan) */}
            {!isScanning && (
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg flex items-center justify-between animate-enter">
                 <div className="flex items-center space-x-3 overflow-hidden">
                   <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 text-zinc-500">
                      <FileImage className="w-5 h-5" />
                   </div>
                   <div className="min-w-0">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{file.name}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{formatSize(file.size)}</p>
                   </div>
                 </div>
                 <button 
                   onClick={removeFile}
                   disabled={disabled}
                   className="p-2 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   title="Remove file"
                 >
                   <X className="w-5 h-5" />
                 </button>
              </div>
            )}
          </div>
        ) : (
          // Idle / Drag State
          <div className="text-center cursor-pointer">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 ${dragActive ? 'scale-110 bg-blue-100 text-blue-600' : 'bg-white dark:bg-zinc-800 text-zinc-400 shadow-sm border border-zinc-100 dark:border-zinc-700'}`}>
              <Upload className="w-7 h-7 stroke-1.5" />
            </div>
            
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {dragActive ? 'Drop image here' : 'Upload Medical Image'}
            </h3>
            
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 mb-6 max-w-xs mx-auto">
              Drag & drop or click to select.
              <br/>
              <span className="text-xs opacity-70">Supports JPEG, PNG up to {maxSizeMB}MB</span>
            </p>

            <button disabled={disabled} className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50">
              Select File
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-start space-x-2 text-red-600 dark:text-red-400 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

export default MedicalImageUpload;