'use client';

import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { contactsApi } from '@/lib/api/api-client';
import { ArrowLeft, Plus, Edit, Trash2, GripVertical, Settings2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Field types available
const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'url', label: 'URL' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'textarea', label: 'Text Area' }
];

// Mock data for custom fields
const mockCustomFields = [
  {
    id: '1',
    name: 'Industry',
    type: 'dropdown',
    options: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing'],
    isRequired: true,
    order: 1,
    usageCount: 156
  },
  {
    id: '2',
    name: 'LinkedIn URL',
    type: 'url',
    options: null,
    isRequired: false,
    order: 2,
    usageCount: 89
  },
  {
    id: '3',
    name: 'Annual Revenue',
    type: 'number',
    options: null,
    isRequired: false,
    order: 3,
    usageCount: 124
  },
  {
    id: '4',
    name: 'Newsletter Subscription',
    type: 'checkbox',
    options: null,
    isRequired: false,
    order: 4,
    usageCount: 203
  },
  {
    id: '5',
    name: 'Contract Expiry Date',
    type: 'date',
    options: null,
    isRequired: false,
    order: 5,
    usageCount: 67
  }
];

export default function CustomFieldsPage() {
  const router = useRouter();
  const [customFields, setCustomFields] = useState(mockCustomFields);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<any>(null);
  
  // Form state
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [isRequired, setIsRequired] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');
  
  // Load custom fields on mount
  useEffect(() => {
    // In a real implementation, this would fetch from the API
    // const fetchCustomFields = async () => {
    //   try {
    //     const response = await contactsApi.getCustomFields();
    //     setCustomFields(response.data);
    //   } catch (error) {
    //     console.error('Error fetching custom fields:', error);
    //     toast({
    //       title: "Error",
    //       description: "Failed to load custom fields. Please try again.",
    //       variant: "destructive",
    //     });
    //   }
    // };
    // fetchCustomFields();
  }, []);
  
  const handleCreateField = async () => {
    if (!fieldName.trim()) {
      toast({
        title: "Validation Error",
        description: "Field name is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (fieldType === 'dropdown' && options.length === 0) {
      toast({
        title: "Validation Error",
        description: "Dropdown fields must have at least one option.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call the API
      // await contactsApi.createCustomField({
      //   name: fieldName,
      //   type: fieldType,
      //   isRequired,
      //   options: fieldType === 'dropdown' ? options : null
      // });
      
      // Mock creating a new field
      const newField = {
        id: String(customFields.length + 1),
        name: fieldName,
        type: fieldType,
        options: fieldType === 'dropdown' ? options : null,
        isRequired,
        order: customFields.length + 1,
        usageCount: 0
      };
      
      setCustomFields([...customFields, newField]);
      setIsDialogOpen(false);
      resetForm();
      
      toast({
        title: "Custom Field Created",
        description: `Field "${fieldName}" has been created.`,
      });
    } catch (error) {
      console.error('Error creating custom field:', error);
      toast({
        title: "Error",
        description: "Failed to create custom field. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditField = async () => {
    if (!editingField || !fieldName.trim()) {
      toast({
        title: "Validation Error",
        description: "Field name is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (fieldType === 'dropdown' && options.length === 0) {
      toast({
        title: "Validation Error",
        description: "Dropdown fields must have at least one option.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call the API
      // await contactsApi.updateCustomField(editingField.id, {
      //   name: fieldName,
      //   type: fieldType,
      //   isRequired,
      //   options: fieldType === 'dropdown' ? options : null
      // });
      
      // Mock updating the field
      const updatedFields = customFields.map(field => 
        field.id === editingField.id 
          ? {
              ...field,
              name: fieldName,
              type: fieldType,
              options: fieldType === 'dropdown' ? options : null,
              isRequired
            }
          : field
      );
      
      setCustomFields(updatedFields);
      setIsDialogOpen(false);
      resetForm();
      
      toast({
        title: "Custom Field Updated",
        description: `Field "${fieldName}" has been updated.`,
      });
    } catch (error) {
      console.error('Error updating custom field:', error);
      toast({
        title: "Error",
        description: "Failed to update custom field. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteField = async (field: any) => {
    if (!field) return;
    
    if (field.usageCount > 0) {
      toast({
        title: "Cannot Delete Field",
        description: `This field is currently used by ${field.usageCount} contacts. Remove the field from these contacts first.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call the API
      // await contactsApi.deleteCustomField(field.id);
      
      // Mock deleting the field
      const updatedFields = customFields.filter(f => f.id !== field.id);
      setCustomFields(updatedFields);
      
      toast({
        title: "Custom Field Deleted",
        description: `Field "${field.name}" has been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting custom field:', error);
      toast({
        title: "Error",
        description: "Failed to delete custom field. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const openEditDialog = (field: any) => {
    setEditingField(field);
    setFieldName(field.name);
    setFieldType(field.type);
    setIsRequired(field.isRequired);
    setOptions(field.options || []);
    setIsDialogOpen(true);
  };
  
  const openCreateDialog = () => {
    setEditingField(null);
    resetForm();
    setIsDialogOpen(true);
  };
  
  const resetForm = () => {
    setFieldName('');
    setFieldType('text');
    setIsRequired(false);
    setOptions([]);
    setNewOption('');
  };
  
  const addOption = () => {
    if (!newOption.trim()) return;
    setOptions([...options, newOption.trim()]);
    setNewOption('');
  };
  
  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
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
        <h1 className="text-3xl font-bold tracking-tight">Custom Fields</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Contact Fields</CardTitle>
                  <CardDescription>
                    Manage custom fields for contacts
                  </CardDescription>
                </div>
                <Button onClick={openCreateDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Field Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customFields.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                            {field.order}
                          </div>
                        </TableCell>
                        <TableCell>{field.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Settings2 className="h-4 w-4 text-muted-foreground" />
                            {FIELD_TYPES.find(t => t.value === field.type)?.label}
                          </div>
                        </TableCell>
                        <TableCell>
                          {field.isRequired ? (
                            <span className="text-primary">Required</span>
                          ) : (
                            <span className="text-muted-foreground">Optional</span>
                          )}
                        </TableCell>
                        <TableCell>{field.usageCount} contacts</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(field)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteField(field)}
                              disabled={field.usageCount > 0}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Field Guidelines</CardTitle>
              <CardDescription>
                Best practices for custom fields
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Field Types</h3>
                <ul className="text-sm space-y-1">
                  <li>• Text: For short text input</li>
                  <li>• Number: For numeric values</li>
                  <li>• Date: For dates and deadlines</li>
                  <li>• Dropdown: For predefined options</li>
                  <li>• Checkbox: For yes/no values</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Best Practices</h3>
                <ul className="text-sm space-y-1">
                  <li>• Use clear, descriptive names</li>
                  <li>• Only mark fields as required if necessary</li>
                  <li>• Group related fields together</li>
                  <li>• Use consistent naming conventions</li>
                  <li>• Regularly review field usage</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Field Order</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop fields to change their order. Fields will appear in
                  forms in the order shown here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Create/Edit Field Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingField ? 'Edit Custom Field' : 'Add Custom Field'}
            </DialogTitle>
            <DialogDescription>
              {editingField 
                ? 'Edit the custom field details below.' 
                : 'Configure a new custom field for contacts.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Field Name</Label>
              <Input
                id="name"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="Enter field name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Field Type</Label>
              <Select
                value={fieldType}
                onValueChange={setFieldType}
                disabled={editingField !== null}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editingField && (
                <p className="text-sm text-muted-foreground">
                  Field type cannot be changed after creation to preserve data integrity.
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={isRequired}
                onCheckedChange={setIsRequired}
              />
              <Label htmlFor="required">Required Field</Label>
            </div>
            
            {fieldType === 'dropdown' && (
              <div className="space-y-4">
                <Label>Dropdown Options</Label>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={option} disabled />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Add new option"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addOption();
                        }
                      }}
                    />
                    <Button onClick={addOption}>Add</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={editingField ? handleEditField : handleCreateField}
              disabled={isLoading}
            >
              {isLoading ? (
                <>Saving...</>
              ) : (
                <>{editingField ? 'Save Changes' : 'Create Field'}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 