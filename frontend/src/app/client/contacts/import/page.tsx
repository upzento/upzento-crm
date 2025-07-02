'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  Info,
  ChevronRight,
  ChevronDown,
  Eye,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

// Mock data for CSV preview
const csvPreview = [
  {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Inc.',
    jobTitle: 'Marketing Director',
    tags: 'VIP, Enterprise',
    leadSource: 'Website'
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 987-6543',
    company: 'XYZ Corp',
    jobTitle: 'CEO',
    tags: 'Hot Lead',
    leadSource: 'Referral'
  },
  {
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
    phone: '+1 (555) 456-7890',
    company: 'Brown & Associates',
    jobTitle: 'Consultant',
    tags: 'Partner, Consultant',
    leadSource: 'Conference'
  },
  {
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@example.com',
    phone: '+1 (555) 789-0123',
    company: 'Tech Solutions',
    jobTitle: 'CTO',
    tags: 'Technical, Enterprise',
    leadSource: 'LinkedIn'
  },
  {
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@example.com',
    phone: '+1 (555) 234-5678',
    company: 'Wilson Marketing',
    jobTitle: 'Owner',
    tags: 'SMB',
    leadSource: 'Google Ads'
  }
];

// Mock data for field mapping options
const fieldMappingOptions = [
  { value: 'firstName', label: 'First Name' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'email', label: 'Email Address' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'company', label: 'Company Name' },
  { value: 'jobTitle', label: 'Job Title' },
  { value: 'tags', label: 'Tags' },
  { value: 'leadSource', label: 'Lead Source' },
  { value: 'address', label: 'Address' },
  { value: 'city', label: 'City' },
  { value: 'state', label: 'State/Province' },
  { value: 'zipCode', label: 'ZIP/Postal Code' },
  { value: 'country', label: 'Country' },
  { value: 'website', label: 'Website' },
  { value: 'notes', label: 'Notes' },
  { value: 'leadStatus', label: 'Lead Status' },
  { value: 'industry', label: 'Industry' },
  { value: 'doNotContact', label: 'Do Not Contact' }
];

// Mock data for validation results
const validationResults = {
  totalRows: 5,
  validRows: 4,
  invalidRows: 1,
  warnings: 2,
  duplicates: 1,
  errors: [
    {
      row: 4,
      field: 'email',
      message: 'Invalid email format'
    }
  ],
  warnings: [
    {
      row: 2,
      field: 'phone',
      message: 'Phone number format may be incorrect'
    },
    {
      row: 5,
      field: 'tags',
      message: 'Unknown tag "SMB" will be created'
    }
  ],
  duplicates: [
    {
      row: 3,
      email: 'michael.brown@example.com',
      message: 'Contact with this email already exists'
    }
  ]
};

export default function ImportPage() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({
    0: 'firstName',
    1: 'lastName',
    2: 'email',
    3: 'phone',
    4: 'company',
    5: 'jobTitle',
    6: 'tags',
    7: 'leadSource'
  });
  const [importOptions, setImportOptions] = useState({
    skipDuplicates: true,
    updateExisting: false,
    createTags: true,
    defaultLeadStatus: 'new',
    defaultTags: []
  });
  const [importProgress, setImportProgress] = useState(0);
  const [importComplete, setImportComplete] = useState(false);
  const [importResults, setImportResults] = useState({
    added: 0,
    updated: 0,
    skipped: 0,
    failed: 0
  });
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStep(2);
    }
  };
  
  // Update field mapping
  const updateFieldMapping = (columnIndex: string, value: string) => {
    setFieldMapping({
      ...fieldMapping,
      [columnIndex]: value
    });
  };
  
  // Start validation
  const startValidation = () => {
    setStep(3);
    // In a real app, this would send the file and mapping to the server for validation
  };
  
  // Start import
  const startImport = () => {
    setStep(4);
    
    // Simulate import progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setImportProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setImportComplete(true);
        setImportResults({
          added: 4,
          updated: 0,
          skipped: 1,
          failed: 0
        });
      }
    }, 500);
  };
  
  // Reset import
  const resetImport = () => {
    setFile(null);
    setStep(1);
    setImportProgress(0);
    setImportComplete(false);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/client/contacts">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Import Contacts</h1>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            1
          </div>
          <span className={step >= 1 ? 'font-medium' : 'text-muted-foreground'}>Upload File</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            2
          </div>
          <span className={step >= 2 ? 'font-medium' : 'text-muted-foreground'}>Map Fields</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            3
          </div>
          <span className={step >= 3 ? 'font-medium' : 'text-muted-foreground'}>Validate</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            4
          </div>
          <span className={step >= 4 ? 'font-medium' : 'text-muted-foreground'}>Import</span>
        </div>
      </div>
      
      {/* Step 1: Upload File */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
            <CardDescription>
              Upload a CSV file containing your contacts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed rounded-md p-10 text-center">
              <FileSpreadsheet className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Upload your contacts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop a CSV file here, or click to select a file
              </p>
              <div className="flex justify-center">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>Select File</span>
                  </div>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </Label>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">CSV File Requirements</h3>
              <ul className="space-y-1 text-sm">
                <li>• File must be in CSV format</li>
                <li>• First row should contain column headers</li>
                <li>• Required fields: First Name, Last Name, Email</li>
                <li>• Maximum file size: 10MB</li>
                <li>• Maximum 5,000 contacts per import</li>
              </ul>
              <div className="mt-4">
                <Button variant="outline" size="sm" asChild>
                  <a href="#" download="contact_import_template.csv">
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Step 2: Map Fields */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Map Fields</CardTitle>
            <CardDescription>
              Match the columns in your CSV file to contact fields
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-2 text-sm">
              <FileSpreadsheet className="h-4 w-4" />
              <span className="font-medium">{file?.name}</span>
              <Badge variant="outline" className="ml-2">{csvPreview.length} contacts</Badge>
            </div>
            
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(csvPreview[0]).map((key, index) => (
                      <TableHead key={index}>
                        <div className="space-y-1">
                          <select
                            className="w-full border rounded-md px-2 py-1 text-sm"
                            value={fieldMapping[index]}
                            onChange={(e) => updateFieldMapping(index.toString(), e.target.value)}
                          >
                            <option value="">Do Not Import</option>
                            {fieldMappingOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <p className="text-xs text-muted-foreground">{key}</p>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvPreview.slice(0, 3).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Object.values(row).map((value, cellIndex) => (
                        <TableCell key={cellIndex}>{value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Import Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Skip Duplicates</p>
                    <p className="text-sm text-muted-foreground">Skip contacts with matching email addresses</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={importOptions.skipDuplicates} 
                    onChange={(e) => setImportOptions({...importOptions, skipDuplicates: e.target.checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Update Existing Contacts</p>
                    <p className="text-sm text-muted-foreground">Update existing contacts with new information</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={importOptions.updateExisting} 
                    onChange={(e) => setImportOptions({...importOptions, updateExisting: e.target.checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Create New Tags</p>
                    <p className="text-sm text-muted-foreground">Automatically create new tags if they don't exist</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={importOptions.createTags} 
                    onChange={(e) => setImportOptions({...importOptions, createTags: e.target.checked})}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={startValidation}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Step 3: Validate */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Validate Import</CardTitle>
            <CardDescription>
              Review and resolve any issues before importing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Rows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{validationResults.totalRows}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Valid Rows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{validationResults.validRows}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Invalid Rows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{validationResults.invalidRows}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Duplicates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{validationResults.duplicates.length}</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Issues</h3>
                <Badge variant="outline">{validationResults.errors.length + validationResults.warnings.length + validationResults.duplicates.length} issues found</Badge>
              </div>
              
              {validationResults.errors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <h4 className="font-medium">Errors</h4>
                  </div>
                  {validationResults.errors.map((error, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2">
                      <span className="font-medium">Row {error.row}:</span>
                      <span>{error.message} in field "{error.field}"</span>
                    </div>
                  ))}
                </div>
              )}
              
              {validationResults.warnings.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-amber-500" />
                    <h4 className="font-medium">Warnings</h4>
                  </div>
                  {validationResults.warnings.map((warning, index) => (
                    <div key={index} className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-md flex items-start gap-2">
                      <span className="font-medium">Row {warning.row}:</span>
                      <span>{warning.message} in field "{warning.field}"</span>
                    </div>
                  ))}
                </div>
              )}
              
              {validationResults.duplicates.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <h4 className="font-medium">Duplicates</h4>
                  </div>
                  {validationResults.duplicates.map((duplicate, index) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md flex items-start gap-2">
                      <span className="font-medium">Row {duplicate.row}:</span>
                      <span>{duplicate.message} ({duplicate.email})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">Import Summary</p>
              </div>
              <p className="mt-2 text-sm">
                {validationResults.validRows} contacts will be imported. 
                {validationResults.invalidRows > 0 && ` ${validationResults.invalidRows} contacts have errors and will be skipped.`}
                {validationResults.duplicates.length > 0 && importOptions.skipDuplicates && ` ${validationResults.duplicates.length} duplicate contacts will be skipped.`}
                {validationResults.duplicates.length > 0 && importOptions.updateExisting && ` ${validationResults.duplicates.length} duplicate contacts will be updated.`}
              </p>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={startImport}>
                Start Import
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Step 4: Import */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Importing Contacts</CardTitle>
            <CardDescription>
              {importComplete ? 'Import completed successfully' : 'Please wait while your contacts are being imported'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!importComplete ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Importing contacts...</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} className="h-2" />
                <div className="flex justify-center">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                  <h3 className="text-xl font-medium">Import Complete!</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Added
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{importResults.added}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Updated
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{importResults.updated}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Skipped
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-amber-600">{importResults.skipped}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Failed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{importResults.failed}</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={resetImport}>
                    Import More Contacts
                  </Button>
                  <Button asChild>
                    <a href="/client/contacts">
                      View Contacts <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 