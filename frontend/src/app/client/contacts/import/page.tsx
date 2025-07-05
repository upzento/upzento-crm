'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { contactsApi } from '@/lib/api/api-client';
import { ArrowLeft, Upload, FileText, ArrowRight, Check, AlertCircle, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Progress
} from "@/components/ui/progress";

// Steps in the import process
const STEPS = {
  UPLOAD: 0,
  MAP_FIELDS: 1,
  VALIDATE: 2,
  IMPORT: 3,
  COMPLETE: 4,
};

// Required fields that must be mapped
const REQUIRED_FIELDS = ['firstName', 'lastName'];

// Available fields for mapping
const AVAILABLE_FIELDS = [
  { value: 'firstName', label: 'First Name' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'company', label: 'Company' },
  { value: 'jobTitle', label: 'Job Title' },
  { value: 'type', label: 'Contact Type' },
  { value: 'leadStatus', label: 'Lead Status' },
  { value: 'leadSource', label: 'Lead Source' },
  { value: 'notes', label: 'Notes' },
];

export default function ImportContactsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(STEPS.UPLOAD);
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [validationResults, setValidationResults] = useState<any>({
    valid: 0,
    invalid: 0,
    errors: [],
  });
  const [importProgress, setImportProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState<any>({
    total: 0,
    created: 0,
    errors: [],
  });

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    setFile(file);
    
    // Read CSV headers
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(h => h.trim());
        setHeaders(headers);
        
        // Preview first few rows
        const previewRows = lines.slice(1, 6).map(line => {
          const values = line.split(',').map(v => v.trim());
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || '';
            return obj;
          }, {} as Record<string, string>);
        });
        setPreviewData(previewRows);
      }
    };
    reader.readAsText(file);
  };

  // Handle field mapping
  const handleFieldMapping = (csvHeader: string, contactField: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [csvHeader]: contactField,
    }));
  };

  // Validate mappings and data
  const validateData = async () => {
    setIsProcessing(true);
    try {
      // Check required fields are mapped
      const mappedFields = Object.values(fieldMapping);
      const missingRequired = REQUIRED_FIELDS.filter(field => !mappedFields.includes(field));
      
      if (missingRequired.length > 0) {
        toast({
          title: "Missing Required Fields",
          description: `Please map the following required fields: ${missingRequired.join(', ')}`,
          variant: "destructive",
        });
        return;
      }

      // Simulate validation - in real app would call API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation results
      setValidationResults({
        valid: previewData.length,
        invalid: 0,
        errors: [],
      });
      
      setCurrentStep(STEPS.IMPORT);
    } catch (error) {
      console.error('Error validating data:', error);
      toast({
        title: "Validation Error",
        description: "Failed to validate import data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Start import process
  const startImport = async () => {
    setIsProcessing(true);
    try {
      // Simulate import process with progress
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Mock import results
      setImportResults({
        total: previewData.length,
        created: previewData.length,
        errors: [],
      });
      
      setCurrentStep(STEPS.COMPLETE);
    } catch (error) {
      console.error('Error importing contacts:', error);
      toast({
        title: "Import Error",
        description: "Failed to import contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Render different content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.UPLOAD:
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <span className="text-lg font-medium mb-2">Upload CSV File</span>
                <span className="text-sm text-muted-foreground">
                  Drag and drop or click to select
                </span>
              </Label>
            </div>
            
            {file && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                </div>
                
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {headers.map((header, index) => (
                          <TableHead key={index}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {headers.map((header, colIndex) => (
                            <TableCell key={colIndex}>
                              {row[header]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <Button 
                  onClick={() => setCurrentStep(STEPS.MAP_FIELDS)}
                  disabled={headers.length === 0}
                >
                  Continue to Field Mapping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        );

      case STEPS.MAP_FIELDS:
        return (
          <div className="space-y-6">
            <div className="grid gap-4">
              {headers.map((header) => (
                <div key={header} className="flex items-center gap-4">
                  <div className="w-1/3">
                    <Label>{header}</Label>
                  </div>
                  <div className="flex-1">
                    <Select
                      value={fieldMapping[header] || ''}
                      onValueChange={(value) => handleFieldMapping(header, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field to map" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Do not import</SelectItem>
                        {AVAILABLE_FIELDS.map((field) => (
                          <SelectItem 
                            key={field.value} 
                            value={field.value}
                          >
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(STEPS.UPLOAD)}
              >
                Back
              </Button>
              <Button 
                onClick={validateData}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    Validate Data
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case STEPS.VALIDATE:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        );

      case STEPS.IMPORT:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Valid Records: {validationResults.valid}</span>
                <span>Invalid Records: {validationResults.invalid}</span>
              </div>
              
              {validationResults.errors.length > 0 && (
                <div className="border rounded-lg p-4 bg-red-50">
                  <h4 className="font-medium mb-2">Validation Errors</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {validationResults.errors.map((error: string, index: number) => (
                      <li key={index} className="text-sm text-red-600">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {isProcessing ? (
              <div className="space-y-4">
                <Progress value={importProgress} />
                <p className="text-center text-sm text-muted-foreground">
                  Importing contacts... {importProgress}%
                </p>
              </div>
            ) : (
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(STEPS.MAP_FIELDS)}
                >
                  Back
                </Button>
                <Button 
                  onClick={startImport}
                  disabled={validationResults.invalid > 0}
                >
                  Start Import
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        );

      case STEPS.COMPLETE:
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-12">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Import Complete</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Successfully imported {importResults.created} out of {importResults.total} contacts.
              </p>
              
              {importResults.errors.length > 0 && (
                <div className="w-full border rounded-lg p-4 bg-red-50 mb-4">
                  <h4 className="font-medium mb-2">Import Errors</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {importResults.errors.map((error: string, index: number) => (
                      <li key={index} className="text-sm text-red-600">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Button onClick={() => router.push('/client/contacts')}>
                Return to Contacts
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/client/contacts')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Contacts
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Import Contacts</h1>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {Object.values(STEPS).filter(step => typeof step === 'number').map((step) => (
            <div
              key={step}
              className={`flex items-center ${step !== 0 ? 'ml-2' : ''}`}
            >
              {step !== 0 && (
                <div className="h-px w-8 bg-border mx-2" />
              )}
              <div
                className={`
                  rounded-full w-8 h-8 flex items-center justify-center text-sm
                  ${currentStep === step 
                    ? 'bg-primary text-primary-foreground' 
                    : currentStep > step
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {step + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === STEPS.UPLOAD && "Upload CSV File"}
            {currentStep === STEPS.MAP_FIELDS && "Map Fields"}
            {currentStep === STEPS.VALIDATE && "Validating Data"}
            {currentStep === STEPS.IMPORT && "Import Contacts"}
            {currentStep === STEPS.COMPLETE && "Import Complete"}
          </CardTitle>
          <CardDescription>
            {currentStep === STEPS.UPLOAD && "Upload a CSV file containing your contacts."}
            {currentStep === STEPS.MAP_FIELDS && "Map CSV columns to contact fields."}
            {currentStep === STEPS.VALIDATE && "Validating your data..."}
            {currentStep === STEPS.IMPORT && "Review and start the import process."}
            {currentStep === STEPS.COMPLETE && "Your contacts have been imported."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
} 