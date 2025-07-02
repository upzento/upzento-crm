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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from 'react-beautiful-dnd';
import {
  Save,
  Trash2,
  Copy,
  Settings,
  Eye,
  Layout,
  Type,
  Check,
  Phone,
  Mail,
  Calendar,
  FileText,
  Image,
  CheckSquare,
  List,
  AlignLeft,
  Star,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  X,
  Layers,
  Palette
} from 'lucide-react';

// Form field types
const fieldTypes = [
  { id: 'text', name: 'Text', icon: <Type className="h-4 w-4" /> },
  { id: 'textarea', name: 'Text Area', icon: <AlignLeft className="h-4 w-4" /> },
  { id: 'number', name: 'Number', icon: <FileText className="h-4 w-4" /> },
  { id: 'email', name: 'Email', icon: <Mail className="h-4 w-4" /> },
  { id: 'phone', name: 'Phone', icon: <Phone className="h-4 w-4" /> },
  { id: 'date', name: 'Date', icon: <Calendar className="h-4 w-4" /> },
  { id: 'checkbox', name: 'Checkbox', icon: <CheckSquare className="h-4 w-4" /> },
  { id: 'radio', name: 'Radio', icon: <Check className="h-4 w-4" /> },
  { id: 'select', name: 'Dropdown', icon: <ChevronDown className="h-4 w-4" /> },
  { id: 'file', name: 'File Upload', icon: <Image className="h-4 w-4" /> },
  { id: 'rating', name: 'Rating', icon: <Star className="h-4 w-4" /> }
];

// Initial form state
const initialForm = {
  name: 'New Form',
  description: 'Form description',
  fields: [
    {
      id: '1',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      options: []
    },
    {
      id: '2',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email address',
      required: true,
      options: []
    },
    {
      id: '3',
      type: 'textarea',
      label: 'Message',
      placeholder: 'Enter your message',
      required: false,
      options: []
    }
  ],
  settings: {
    submitButtonText: 'Submit',
    successMessage: 'Thank you for your submission!',
    redirectUrl: '',
    enableCaptcha: true,
    notifyEmail: '',
    theme: 'default'
  }
};

// Generate unique ID
const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Create empty field based on type
const createEmptyField = (type: string) => {
  const newId = generateId();
  
  const baseField = {
    id: newId,
    type,
    label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
    placeholder: '',
    required: false,
    options: []
  };
  
  // Add options for select, radio, checkbox
  if (['select', 'radio', 'checkbox'].includes(type)) {
    return {
      ...baseField,
      options: [
        { id: generateId(), label: 'Option 1', value: 'option_1' },
        { id: generateId(), label: 'Option 2', value: 'option_2' }
      ]
    };
  }
  
  return baseField;
};

export default function FormBuilderPage() {
  const [form, setForm] = useState(initialForm);
  const [activeTab, setActiveTab] = useState('fields');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  
  // Get the selected field
  const selectedField = form.fields.find(field => field.id === selectedFieldId);
  
  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // If dropped outside droppable area
    if (!destination) return;
    
    // If dropped in same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // Reorder fields
    const newFields = Array.from(form.fields);
    const [removed] = newFields.splice(source.index, 1);
    newFields.splice(destination.index, 0, removed);
    
    setForm({
      ...form,
      fields: newFields
    });
  };
  
  // Add new field
  const addField = (type: string) => {
    const newField = createEmptyField(type);
    setForm({
      ...form,
      fields: [...form.fields, newField]
    });
    setSelectedFieldId(newField.id);
  };
  
  // Delete field
  const deleteField = (id: string) => {
    setForm({
      ...form,
      fields: form.fields.filter(field => field.id !== id)
    });
    
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };
  
  // Update field
  const updateField = (id: string, updates: any) => {
    setForm({
      ...form,
      fields: form.fields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    });
  };
  
  // Add option to field
  const addOption = (fieldId: string) => {
    const field = form.fields.find(f => f.id === fieldId);
    if (!field) return;
    
    const newOption = {
      id: generateId(),
      label: `Option ${field.options.length + 1}`,
      value: `option_${field.options.length + 1}`
    };
    
    updateField(fieldId, {
      options: [...field.options, newOption]
    });
  };
  
  // Update option
  const updateOption = (fieldId: string, optionId: string, updates: any) => {
    const field = form.fields.find(f => f.id === fieldId);
    if (!field) return;
    
    updateField(fieldId, {
      options: field.options.map(option => 
        option.id === optionId ? { ...option, ...updates } : option
      )
    });
  };
  
  // Delete option
  const deleteOption = (fieldId: string, optionId: string) => {
    const field = form.fields.find(f => f.id === fieldId);
    if (!field) return;
    
    updateField(fieldId, {
      options: field.options.filter(option => option.id !== optionId)
    });
  };
  
  // Update form settings
  const updateSettings = (updates: any) => {
    setForm({
      ...form,
      settings: {
        ...form.settings,
        ...updates
      }
    });
  };
  
  // Duplicate field
  const duplicateField = (id: string) => {
    const fieldToDuplicate = form.fields.find(field => field.id === id);
    if (!fieldToDuplicate) return;
    
    const duplicatedField = {
      ...fieldToDuplicate,
      id: generateId(),
      label: `${fieldToDuplicate.label} (Copy)`
    };
    
    const fieldIndex = form.fields.findIndex(field => field.id === id);
    
    const newFields = Array.from(form.fields);
    newFields.splice(fieldIndex + 1, 0, duplicatedField);
    
    setForm({
      ...form,
      fields: newFields
    });
  };
  
  // Render field configuration panel
  const renderFieldConfig = () => {
    if (!selectedField) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
          <Layout className="h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Field Selected</h3>
          <p>Select a field to configure its properties or add a new field from the sidebar.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6 p-4">
        <div className="space-y-2">
          <Label htmlFor="field-label">Field Label</Label>
          <Input
            id="field-label"
            value={selectedField.label}
            onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="field-placeholder">Placeholder</Label>
          <Input
            id="field-placeholder"
            value={selectedField.placeholder}
            onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="field-required">Required Field</Label>
          <Switch
            id="field-required"
            checked={selectedField.required}
            onCheckedChange={(checked) => updateField(selectedField.id, { required: checked })}
          />
        </div>
        
        {['select', 'radio', 'checkbox'].includes(selectedField.type) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => addOption(selectedField.id)}
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Option
              </Button>
            </div>
            
            <div className="space-y-2">
              {selectedField.options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    value={option.label}
                    onChange={(e) => updateOption(selectedField.id, option.id, { 
                      label: e.target.value,
                      value: e.target.value.toLowerCase().replace(/\s+/g, '_')
                    })}
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteOption(selectedField.id, option.id)}
                    disabled={selectedField.options.length <= 2}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => duplicateField(selectedField.id)}
          >
            <Copy className="h-4 w-4 mr-1" /> Duplicate
          </Button>
          <Button 
            variant="destructive"
            size="sm"
            onClick={() => deleteField(selectedField.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Form Builder</h1>
          <p className="text-muted-foreground">Create and customize your form</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Form
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Field Types */}
        <Card className="col-span-12 md:col-span-3">
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>
              Drag and drop elements to build your form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {fieldTypes.map((fieldType) => (
                <Button
                  key={fieldType.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => addField(fieldType.id)}
                >
                  <div className="mr-2">{fieldType.icon}</div>
                  <span>{fieldType.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Center - Form Preview */}
        <Card className="col-span-12 md:col-span-5">
          <CardHeader>
            <div className="space-y-2">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="text-xl font-bold"
              />
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Form description"
                className="resize-none text-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="form-fields">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {form.fields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`border rounded-md p-4 ${
                              selectedFieldId === field.id ? 'border-primary ring-1 ring-primary' : ''
                            }`}
                            onClick={() => setSelectedFieldId(field.id)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div {...provided.dragHandleProps}>
                                  <Layers className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="font-medium">{field.label}</span>
                                {field.required && (
                                  <span className="text-red-500">*</span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateField(field.id);
                                  }}
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteField(field.id);
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                            
                            {/* Field preview based on type */}
                            {field.type === 'text' && (
                              <Input placeholder={field.placeholder || 'Text input'} disabled />
                            )}
                            {field.type === 'textarea' && (
                              <Textarea placeholder={field.placeholder || 'Text area'} disabled className="resize-none" />
                            )}
                            {field.type === 'email' && (
                              <Input type="email" placeholder={field.placeholder || 'Email input'} disabled />
                            )}
                            {field.type === 'number' && (
                              <Input type="number" placeholder={field.placeholder || 'Number input'} disabled />
                            )}
                            {field.type === 'phone' && (
                              <Input type="tel" placeholder={field.placeholder || 'Phone input'} disabled />
                            )}
                            {field.type === 'date' && (
                              <Input type="date" disabled />
                            )}
                            {field.type === 'checkbox' && (
                              <div className="space-y-2">
                                {field.options.map((option) => (
                                  <div key={option.id} className="flex items-center gap-2">
                                    <input type="checkbox" disabled />
                                    <span>{option.label}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {field.type === 'radio' && (
                              <div className="space-y-2">
                                {field.options.map((option) => (
                                  <div key={option.id} className="flex items-center gap-2">
                                    <input type="radio" name={`radio-${field.id}`} disabled />
                                    <span>{option.label}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {field.type === 'select' && (
                              <select className="w-full border rounded-md px-3 py-2" disabled>
                                <option value="">Select an option</option>
                                {field.options.map((option) => (
                                  <option key={option.id} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            )}
                            {field.type === 'file' && (
                              <Input type="file" disabled />
                            )}
                            {field.type === 'rating' && (
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <Star key={rating} className="h-5 w-5 text-muted-foreground" />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {form.fields.length === 0 && (
                      <div className="border border-dashed rounded-md p-6 text-center text-muted-foreground">
                        <PlusCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>Add form fields from the sidebar</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <Button disabled>{form.settings.submitButtonText}</Button>
          </CardFooter>
        </Card>
        
        {/* Right Sidebar - Field Configuration */}
        <Card className="col-span-12 md:col-span-4">
          <CardHeader>
            <Tabs defaultValue="fields" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="fields">Field Properties</TabsTrigger>
                <TabsTrigger value="settings">Form Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="fields" className="mt-0">
              {renderFieldConfig()}
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <div className="space-y-6 p-4">
                <div className="space-y-2">
                  <Label htmlFor="submit-text">Submit Button Text</Label>
                  <Input
                    id="submit-text"
                    value={form.settings.submitButtonText}
                    onChange={(e) => updateSettings({ submitButtonText: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="success-message">Success Message</Label>
                  <Textarea
                    id="success-message"
                    value={form.settings.successMessage}
                    onChange={(e) => updateSettings({ successMessage: e.target.value })}
                    className="resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="redirect-url">Redirect URL (Optional)</Label>
                  <Input
                    id="redirect-url"
                    value={form.settings.redirectUrl}
                    onChange={(e) => updateSettings({ redirectUrl: e.target.value })}
                    placeholder="https://example.com/thank-you"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notify-email">Notification Email</Label>
                  <Input
                    id="notify-email"
                    type="email"
                    value={form.settings.notifyEmail}
                    onChange={(e) => updateSettings({ notifyEmail: e.target.value })}
                    placeholder="notifications@example.com"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-captcha">Enable CAPTCHA</Label>
                  <Switch
                    id="enable-captcha"
                    checked={form.settings.enableCaptcha}
                    onCheckedChange={(checked) => updateSettings({ enableCaptcha: checked })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="form-theme">Form Theme</Label>
                  <Select 
                    value={form.settings.theme}
                    onValueChange={(value) => updateSettings({ theme: value })}
                  >
                    <SelectTrigger id="form-theme">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="cosmic">Cosmic</SelectItem>
                      <SelectItem value="elegant">Elegant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 