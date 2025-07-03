'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Plus, 
  Trash2, 
  MoveVertical, 
  Settings, 
  Layout, 
  Eye, 
  ArrowLeft,
  Undo,
  Redo,
  Layers,
  PanelLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Field type definitions
const fieldTypes = [
  { id: 'TEXT', name: 'Text', icon: 'T' },
  { id: 'EMAIL', name: 'Email', icon: '@' },
  { id: 'PHONE', name: 'Phone', icon: 'â' },
  { id: 'NUMBER', name: 'Number', icon: '#' },
  { id: 'TEXTAREA', name: 'Text Area', icon: 'Â¶' },
  { id: 'SELECT', name: 'Dropdown', icon: 'â¼' },
  { id: 'RADIO', name: 'Radio Buttons', icon: 'â' },
  { id: 'CHECKBOX', name: 'Checkboxes', icon: 'â' },
  { id: 'DATE', name: 'Date', icon: 'ð' },
  { id: 'TIME', name: 'Time', icon: 'ð' },
  { id: 'FILE', name: 'File Upload', icon: 'ð' },
  { id: 'HIDDEN', name: 'Hidden Field', icon: 'ðï¸' },
  { id: 'HTML', name: 'HTML Content', icon: '</>' },
];

// Initial form state
const initialFormState = {
  name: '',
  description: '',
  status: 'DRAFT',
  settings: {
    theme: 'cosmic',
    primaryColor: '#3498db',
    secondaryColor: '#2ecc71',
    fontFamily: 'Inter, sans-serif',
    submitButtonText: 'Submit',
    showProgressBar: true,
    redirectAfterSubmit: false,
    redirectUrl: '',
    showThankYouMessage: true,
    thankYouMessage: 'Thank you for your submission!',
  },
  steps: [
    {
      id: 'step-1',
      title: 'Step 1',
      description: '',
      fields: [],
    },
  ],
};

export default function CreateFormPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState(initialFormState);
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('fields');
  const [selectedField, setSelectedField] = useState(null);
  
  // Function to handle form field addition
  const handleAddField = (type) => {
    const newField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${fieldTypes.find(f => f.id === type).name} Field`,
      placeholder: '',
      helpText: '',
      isRequired: false,
      order: form.steps[activeStep].fields.length,
      options: type === 'SELECT' || type === 'RADIO' || type === 'CHECKBOX' ? [
        { label: 'Option 1', value: 'option-1' },
        { label: 'Option 2', value: 'option-2' },
      ] : undefined,
      validation: {},
      defaultValue: '',
    };
    
    const updatedSteps = [...form.steps];
    updatedSteps[activeStep].fields = [...updatedSteps[activeStep].fields, newField];
    
    setForm({
      ...form,
      steps: updatedSteps,
    });
    
    // Select the newly added field
    setSelectedField(newField);
    setActiveTab('properties');
  };
  
  // Function to handle field selection
  const handleSelectField = (field) => {
    setSelectedField(field);
    setActiveTab('properties');
  };
  
  // Function to handle field deletion
  const handleDeleteField = (fieldId) => {
    const updatedSteps = [...form.steps];
    updatedSteps[activeStep].fields = updatedSteps[activeStep].fields.filter(
      field => field.id !== fieldId
    );
    
    setForm({
      ...form,
      steps: updatedSteps,
    });
    
    setSelectedField(null);
  };
  
  // Function to update field properties
  const handleUpdateField = (fieldId, updates) => {
    const updatedSteps = [...form.steps];
    const fieldIndex = updatedSteps[activeStep].fields.findIndex(
      field => field.id === fieldId
    );
    
    if (fieldIndex !== -1) {
      updatedSteps[activeStep].fields[fieldIndex] = {
        ...updatedSteps[activeStep].fields[fieldIndex],
        ...updates,
      };
      
      setForm({
        ...form,
        steps: updatedSteps,
      });
      
      setSelectedField(updatedSteps[activeStep].fields[fieldIndex]);
    }
  };
  
  // Function to handle form submission
  const handleSaveForm = async () => {
    // Validate form
    if (!form.name.trim()) {
      toast({
        title: "Error",
        description: "Form name is required",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, make API call to save the form
    toast({
      title: "Form saved",
      description: "Your form has been saved successfully.",
    });
    
    // Navigate back to forms list
    router.push('/dashboard/forms');
  };
  
  // Function to handle field reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const updatedSteps = [...form.steps];
    const fields = [...updatedSteps[activeStep].fields];
    const [removed] = fields.splice(result.source.index, 1);
    fields.splice(result.destination.index, 0, removed);
    
    // Update order property
    const reorderedFields = fields.map((field, index) => ({
      ...field,
      order: index,
    }));
    
    updatedSteps[activeStep].fields = reorderedFields;
    
    setForm({
      ...form,
      steps: updatedSteps,
    });
  };
  
  // Function to add a new step
  const handleAddStep = () => {
    const newStep = {
      id: `step-${form.steps.length + 1}`,
      title: `Step ${form.steps.length + 1}`,
      description: '',
      fields: [],
    };
    
    setForm({
      ...form,
      steps: [...form.steps, newStep],
    });
    
    setActiveStep(form.steps.length);
  };
  
  // Function to update step properties
  const handleUpdateStep = (stepIndex, updates) => {
    const updatedSteps = [...form.steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      ...updates,
    };
    
    setForm({
      ...form,
      steps: updatedSteps,
    });
  };
  
  // Function to delete a step
  const handleDeleteStep = (stepIndex) => {
    if (form.steps.length <= 1) {
      toast({
        title: "Error",
        description: "Forms must have at least one step",
        variant: "destructive",
      });
      return;
    }
    
    const updatedSteps = [...form.steps];
    updatedSteps.splice(stepIndex, 1);
    
    setForm({
      ...form,
      steps: updatedSteps,
    });
    
    if (activeStep >= updatedSteps.length) {
      setActiveStep(updatedSteps.length - 1);
    }
  };
  
  // Function to update form settings
  const handleUpdateSettings = (updates) => {
    setForm({
      ...form,
      settings: {
        ...form.settings,
        ...updates,
      },
    });
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/forms')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-3xl font-bold">Create Form</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/forms')}>
            Cancel
          </Button>
          <Button onClick={handleSaveForm} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Form
          </Button>
        </div>
      </div>
      
      {/* Form Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Form Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="form-name">Form Name</Label>
                <Input
                  id="form-name"
                  placeholder="Enter form name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="form-description">Description</Label>
                <Textarea
                  id="form-description"
                  placeholder="Enter form description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="form-status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm({ ...form, status: value })}
                >
                  <SelectTrigger id="form-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="multi-step">Multi-step Form</Label>
                <Switch
                  id="multi-step"
                  checked={form.steps.length > 1}
                  onCheckedChange={(checked) => {
                    if (checked && form.steps.length === 1) {
                      handleAddStep();
                    } else if (!checked && form.steps.length > 1) {
                      setForm({
                        ...form,
                        steps: [form.steps[0]],
                      });
                      setActiveStep(0);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Form Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Steps Sidebar (only visible for multi-step forms) */}
        {form.steps.length > 1 && (
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Steps</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-2">
                  {form.steps.map((step, index) => (
                    <Button
                      key={step.id}
                      variant={activeStep === index ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setActiveStep(index)}
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      {step.title}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleAddStep}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Form Canvas */}
        <div className={form.steps.length > 1 ? "lg:col-span-7" : "lg:col-span-9"}>
          <Card className="min-h-[500px]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle>
                  {form.steps[activeStep].title}
                </CardTitle>
                <div className="text-sm text-gray-500">
                  {form.steps[activeStep].description || 'No description'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const title = prompt('Enter step title', form.steps[activeStep].title);
                    if (title) {
                      handleUpdateStep(activeStep, { title });
                    }
                  }}
                >
                  Rename
                </Button>
                {form.steps.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600"
                    onClick={() => handleDeleteStep(activeStep)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={`step-${activeStep}-fields`}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4 min-h-[400px]"
                    >
                      {form.steps[activeStep].fields.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-md">
                          <p className="text-gray-500">
                            Drag and drop fields here or click "Add Field" to start building your form
                          </p>
                        </div>
                      ) : (
                        form.steps[activeStep].fields.map((field, index) => (
                          <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`border rounded-md p-4 ${
                                  selectedField?.id === field.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200'
                                }`}
                                onClick={() => handleSelectField(field)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-move p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                      <MoveVertical className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <span className="font-medium">{field.label}</span>
                                    {field.isRequired && (
                                      <span className="text-red-500">*</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteField(field.id);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {/* Field preview based on type */}
                                <div className="mt-2">
                                  {field.type === 'TEXT' && (
                                    <Input placeholder={field.placeholder || 'Text input'} disabled />
                                  )}
                                  {field.type === 'TEXTAREA' && (
                                    <Textarea placeholder={field.placeholder || 'Text area'} disabled />
                                  )}
                                  {/* Add other field type previews here */}
                                </div>
                                
                                {field.helpText && (
                                  <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </div>
        
        {/* Properties Panel */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="fields" className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Fields
              </TabsTrigger>
              <TabsTrigger value="properties" className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Properties
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex-1">
                <Layout className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="fields" className="p-0 border rounded-md mt-4">
              <div className="grid grid-cols-2 gap-2 p-4">
                {fieldTypes.map((fieldType) => (
                  <Button
                    key={fieldType.id}
                    variant="outline"
                    className="h-20 flex-col justify-center"
                    onClick={() => handleAddField(fieldType.id)}
                  >
                    <div className="text-xl mb-1">{fieldType.icon}</div>
                    <div className="text-xs">{fieldType.name}</div>
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="properties" className="p-0 border rounded-md mt-4">
              {selectedField ? (
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="field-label">Field Label</Label>
                    <Input
                      id="field-label"
                      value={selectedField.label}
                      onChange={(e) => handleUpdateField(selectedField.id, { label: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="field-placeholder">Placeholder</Label>
                    <Input
                      id="field-placeholder"
                      value={selectedField.placeholder || ''}
                      onChange={(e) => handleUpdateField(selectedField.id, { placeholder: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="field-help">Help Text</Label>
                    <Input
                      id="field-help"
                      value={selectedField.helpText || ''}
                      onChange={(e) => handleUpdateField(selectedField.id, { helpText: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="field-required">Required Field</Label>
                    <Switch
                      id="field-required"
                      checked={selectedField.isRequired}
                      onCheckedChange={(checked) => handleUpdateField(selectedField.id, { isRequired: checked })}
                    />
                  </div>
                  
                  {/* Additional properties based on field type */}
                  {(selectedField.type === 'SELECT' || selectedField.type === 'RADIO' || selectedField.type === 'CHECKBOX') && (
                    <div className="space-y-2">
                      <Label>Options</Label>
                      <div className="space-y-2">
                        {selectedField.options.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={option.label}
                              onChange={(e) => {
                                const newOptions = [...selectedField.options];
                                newOptions[index].label = e.target.value;
                                newOptions[index].value = e.target.value.toLowerCase().replace(/\s+/g, '-');
                                handleUpdateField(selectedField.id, { options: newOptions });
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newOptions = [...selectedField.options];
                                newOptions.splice(index, 1);
                                handleUpdateField(selectedField.id, { options: newOptions });
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newOptions = [...selectedField.options];
                            const newIndex = newOptions.length + 1;
                            newOptions.push({ 
                              label: `Option ${newIndex}`, 
                              value: `option-${newIndex}` 
                            });
                            handleUpdateField(selectedField.id, { options: newOptions });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Option
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-gray-500">Select a field to edit its properties</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="appearance" className="p-0 border rounded-md mt-4">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="form-theme">Theme</Label>
                  <Select
                    value={form.settings.theme}
                    onValueChange={(value) => handleUpdateSettings({ theme: value })}
                  >
                    <SelectTrigger id="form-theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cosmic">Cosmic</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={form.settings.primaryColor}
                      onChange={(e) => handleUpdateSettings({ primaryColor: e.target.value })}
                      className="w-12 h-8 p-1"
                    />
                    <Input
                      value={form.settings.primaryColor}
                      onChange={(e) => handleUpdateSettings({ primaryColor: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="button-text">Submit Button Text</Label>
                  <Input
                    id="button-text"
                    value={form.settings.submitButtonText}
                    onChange={(e) => handleUpdateSettings({ submitButtonText: e.target.value })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-progress">Show Progress Bar</Label>
                  <Switch
                    id="show-progress"
                    checked={form.settings.showProgressBar}
                    onCheckedChange={(checked) => handleUpdateSettings({ showProgressBar: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="thank-you-message">Show Thank You Message</Label>
                  <Switch
                    id="thank-you-message"
                    checked={form.settings.showThankYouMessage}
                    onCheckedChange={(checked) => handleUpdateSettings({ showThankYouMessage: checked })}
                  />
                </div>
                
                {form.settings.showThankYouMessage && (
                  <div className="space-y-2">
                    <Label htmlFor="thank-you-text">Thank You Message</Label>
                    <Textarea
                      id="thank-you-text"
                      value={form.settings.thankYouMessage}
                      onChange={(e) => handleUpdateSettings({ thankYouMessage: e.target.value })}
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="redirect-after">Redirect After Submit</Label>
                  <Switch
                    id="redirect-after"
                    checked={form.settings.redirectAfterSubmit}
                    onCheckedChange={(checked) => handleUpdateSettings({ redirectAfterSubmit: checked })}
                  />
                </div>
                
                {form.settings.redirectAfterSubmit && (
                  <div className="space-y-2">
                    <Label htmlFor="redirect-url">Redirect URL</Label>
                    <Input
                      id="redirect-url"
                      value={form.settings.redirectUrl}
                      onChange={(e) => handleUpdateSettings({ redirectUrl: e.target.value })}
                      placeholder="https://example.com/thank-you"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 