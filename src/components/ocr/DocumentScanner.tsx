
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createWorker } from 'tesseract.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader, FileText, Upload, CheckCircle } from 'lucide-react';

interface DocumentScannerProps {
  onExtractedText: (text: string) => void;
}

const DocumentScanner: React.FC<DocumentScannerProps> = ({ onExtractedText }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setExtractedText(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.pdf'],
    },
    maxFiles: 1,
  });

  const processImage = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);

    try {
      const worker = await createWorker({
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(m.progress * 100);
          }
        }
      });

      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const { data: { text } } = await worker.recognize(file);
      setExtractedText(text);
      onExtractedText(text);
      
      await worker.terminate();
      
      toast({
        title: "Document Processed",
        description: "Text successfully extracted from your document",
        variant: "default",
      });
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to extract text from the document",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const extractPropertyId = () => {
    if (!extractedText) return;

    // Common patterns for property IDs in Indian documents
    const patterns = [
      /Property ID[:\s]+([A-Z0-9-\/]+)/i,
      /Property Number[:\s]+([A-Z0-9-\/]+)/i,
      /Survey No\.?[:\s]+([A-Z0-9-\/]+)/i,
      /Khasra No\.?[:\s]+([A-Z0-9-\/]+)/i,
    ];
    
    for (const pattern of patterns) {
      const match = extractedText.match(pattern);
      if (match && match[1]) {
        onExtractedText(match[1].trim());
        toast({
          title: "Property ID Found",
          description: `Extracted ID: ${match[1].trim()}`,
          variant: "default",
        });
        return;
      }
    }
    
    toast({
      title: "No Property ID Found",
      description: "Could not automatically detect a property ID in this document",
      variant: "default",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Document Scanner</CardTitle>
        <CardDescription>
          Upload property documents to automatically extract information
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-gov-blue bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <Upload className="h-10 w-10 text-gray-400 mb-3" />
            {isDragActive ? (
              <p>Drop the document here...</p>
            ) : (
              <div>
                <p className="text-sm text-gray-600">Drag & drop your document here, or click to select</p>
                <p className="text-xs text-gray-500 mt-1">Supports: JPG, PNG, PDF (up to 10MB)</p>
              </div>
            )}
          </div>
        </div>

        {preview && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Document Preview</h3>
            <div className="border rounded overflow-hidden max-h-64 flex items-center justify-center bg-gray-100">
              <img 
                src={preview} 
                alt="Document preview" 
                className="max-w-full max-h-64 object-contain" 
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{file?.name} ({Math.round(file?.size ? file.size / 1024 : 0)} KB)</p>
          </div>
        )}

        {isProcessing && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Loader className="animate-spin h-4 w-4" />
              <p className="text-sm">Processing document...</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gov-blue h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">{Math.round(progress)}% complete</p>
          </div>
        )}

        {extractedText && (
          <div className="mt-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Text Extraction Complete</AlertTitle>
              <AlertDescription>
                Text has been extracted from your document. You can now search for property IDs.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={processImage}
          disabled={!file || isProcessing}
          className="w-full sm:w-auto"
        >
          <FileText className="mr-2 h-4 w-4" />
          Extract All Text
        </Button>
        
        <Button 
          onClick={extractPropertyId}
          disabled={!extractedText}
          variant="outline"
          className="w-full sm:w-auto"
        >
          Find Property ID
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentScanner;
