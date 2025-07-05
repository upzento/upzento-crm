'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight,
  LayoutGrid,
  Columns,
  Rows,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: { label: string; value: string }[];
  validation?: any;
}

interface FormStep {
  id: string;
  title: string;
  description?: string;
  layout: 'grid' | 'columns' | 'rows';
  alignment: 'left' | 'center' | 'right';
  fields: FormField[];
}

interface MultiStepFormBuilderProps {
  initialSteps?: FormStep[];
  onStepsChange: (steps: FormStep[]) => void;
}

const FIELD_TYPES = [
  { id: 'text', label: 'Text Input', icon: '✍️' },
  { id: 'email', label: 'Email', icon: '📧' },
  { id: 'phone', label: 'Phone', icon: '📱' },
  { id: 'textarea', label: 'Text Area', icon: '📝' },
  { id: 'select', label: 'Dropdown', icon: '▼' },
  { id: 'radio', label: 'Radio Group', icon: '⭕' },
  { id: 'checkbox', label: 'Checkboxes', icon: '☑️' },
  { id: 'date', label: 'Date Picker', icon: '📅' },
  { id: 'file', label: 'File Upload', icon: '📎' },
  { id: 'rating', label: 'Rating', icon: '⭐' }
];

export const MultiStepFormBuilder: React.FC<MultiStepFormBuilderProps> = ({
  initialSteps = [],
  onStepsChange,
}) => {
  const [steps, setSteps] = useState<FormStep[]>(initialSteps.length > 0 ? initialSteps : [{
    id: 'step-1',
    title: 'Step 1',
    description: '',
    layout: 'grid',
    alignment: 'left',
    fields: []
  }]);
  const [activeStep, setActiveStep] = useState(0);

  const addStep = () => {
    const newStep: FormStep = {
      id: `step-${Date.now()}`,
      title: `Step ${steps.length + 1}`,
      description: '',
      layout: 'grid',
      alignment: 'left',
      fields: [],
    };
    const updatedSteps = [...steps, newStep];
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
    setActiveStep(steps.length);
  };

  const updateStep = (index: number, updates: Partial<FormStep>) => {
    const updatedSteps = steps.map((step, i) =>
      i === index ? { ...step, ...updates } : step
    );
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
  };

  const removeStep = (index: number) => {
    if (steps.length <= 1) return;
    const updatedSteps = steps.filter((_, i) => i !== index);
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
    if (activeStep >= updatedSteps.length) {
      setActiveStep(updatedSteps.length - 1);
    }
  };

  const addField = (type: string) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${type} field`,
      required: false,
    };
    
    const updatedSteps = steps.map((step, index) => {
      if (index === activeStep) {
        return {
          ...step,
          fields: [...step.fields, newField]
        };
      }
      return step;
    });
    
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
  };

  const removeField = (fieldId: string) => {
    const updatedSteps = steps.map((step, index) => {
      if (index === activeStep) {
        return {
          ...step,
          fields: step.fields.filter(f => f.id !== fieldId)
        };
      }
      return step;
    });
    
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
  };

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'grid': return <LayoutGrid className="h-4 w-4" />;
      case 'columns': return <Columns className="h-4 w-4" />;
      case 'rows': return <Rows className="h-4 w-4" />;
      default: return <LayoutGrid className="h-4 w-4" />;
    }
  };

  const getAlignmentIcon = (alignment: string) => {
    switch (alignment) {
      case 'left': return <AlignLeft className="h-4 w-4" />;
      case 'center': return <AlignCenter className="h-4 w-4" />;
      case 'right': return <AlignRight className="h-4 w-4" />;
      default: return <AlignLeft className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="w-64 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Form Steps</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 p-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center justify-between p-2 rounded-md border cursor-pointer ${
                      activeStep === index
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    <span className="text-sm">{step.title}</span>
                    {steps.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeStep(index);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Button onClick={addStep} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>

        <div className="flex-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Step {activeStep + 1} Configuration</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure the current step and its fields
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setActiveStep(Math.min(steps.length - 1, activeStep + 1))
                  }
                  disabled={activeStep === steps.length - 1}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Input
                  placeholder="Step Title"
                  value={steps[activeStep]?.title || ''}
                  onChange={(e) =>
                    updateStep(activeStep, { title: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Step Description (optional)"
                  value={steps[activeStep]?.description || ''}
                  onChange={(e) =>
                    updateStep(activeStep, { description: e.target.value })
                  }
                />
                
                <div className="flex gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        {getLayoutIcon(steps[activeStep]?.layout)}
                        <span className="ml-2">Layout</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => updateStep(activeStep, { layout: 'grid' })}>
                        <LayoutGrid className="h-4 w-4 mr-2" /> Grid
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStep(activeStep, { layout: 'columns' })}>
                        <Columns className="h-4 w-4 mr-2" /> Columns
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStep(activeStep, { layout: 'rows' })}>
                        <Rows className="h-4 w-4 mr-2" /> Rows
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        {getAlignmentIcon(steps[activeStep]?.alignment)}
                        <span className="ml-2">Align</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => updateStep(activeStep, { alignment: 'left' })}>
                        <AlignLeft className="h-4 w-4 mr-2" /> Left
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStep(activeStep, { alignment: 'center' })}>
                        <AlignCenter className="h-4 w-4 mr-2" /> Center
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStep(activeStep, { alignment: 'right' })}>
                        <AlignRight className="h-4 w-4 mr-2" /> Right
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                  {FIELD_TYPES.map((fieldType) => (
                    <Button
                      key={fieldType.id}
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                      onClick={() => addField(fieldType.id)}
                    >
                      <span className="text-2xl">{fieldType.icon}</span>
                      <span className="text-xs">{fieldType.label}</span>
                    </Button>
                  ))}
                </div>

                <div className={`grid gap-4 ${
                  steps[activeStep]?.layout === 'grid' ? 'grid-cols-2' :
                  steps[activeStep]?.layout === 'columns' ? 'grid-cols-3' : 'grid-cols-1'
                }`}>
                  {steps[activeStep]?.fields.map((field) => (
                    <Card key={field.id} className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeField(field.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <CardContent className="pt-8">
                        <div className="space-y-2">
                          <Input
                            value={field.label}
                            onChange={(e) => {
                              const updatedSteps = steps.map((step, index) => {
                                if (index === activeStep) {
                                  return {
                                    ...step,
                                    fields: step.fields.map(f => 
                                      f.id === field.id ? { ...f, label: e.target.value } : f
                                    )
                                  };
                                }
                                return step;
                              });
                              setSteps(updatedSteps);
                              onStepsChange(updatedSteps);
                            }}
                          />
                          <div className="text-xs text-muted-foreground">
                            Type: {field.type}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 