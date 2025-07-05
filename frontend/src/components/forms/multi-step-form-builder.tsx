'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  AlignRight,
  Settings2,
  Link2
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
  conditions?: FormFieldCondition[];
}

interface FormFieldCondition {
  id: string;
  targetFieldId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string;
  action: 'show' | 'hide';
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
  { id: 'rating', label: 'Rating', icon: '⭐' },
  { id: 'calculation', label: 'Calculation', icon: '🔢' },
];

const OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
];

const ACTIONS = [
  { value: 'show', label: 'Show' },
  { value: 'hide', label: 'Hide' },
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
  const [selectedField, setSelectedField] = useState<string | null>(null);

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
      conditions: [],
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
    setSelectedField(newField.id);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    const updatedSteps = steps.map((step, index) => {
      if (index === activeStep) {
        return {
          ...step,
          fields: step.fields.map(field =>
            field.id === fieldId ? { ...field, ...updates } : field
          )
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
    if (selectedField === fieldId) {
      setSelectedField(null);
    }
  };

  const addCondition = (fieldId: string) => {
    const newCondition: FormFieldCondition = {
      id: `condition-${Date.now()}`,
      targetFieldId: '',
      operator: 'equals',
      value: '',
      action: 'show'
    };

    updateField(fieldId, {
      conditions: [...(steps[activeStep].fields.find(f => f.id === fieldId)?.conditions || []), newCondition]
    });
  };

  const updateCondition = (fieldId: string, conditionId: string, updates: Partial<FormFieldCondition>) => {
    const field = steps[activeStep].fields.find(f => f.id === fieldId);
    if (!field) return;

    const updatedConditions = field.conditions?.map(condition =>
      condition.id === conditionId ? { ...condition, ...updates } : condition
    );

    updateField(fieldId, { conditions: updatedConditions });
  };

  const removeCondition = (fieldId: string, conditionId: string) => {
    const field = steps[activeStep].fields.find(f => f.id === fieldId);
    if (!field) return;

    const updatedConditions = field.conditions?.filter(condition => condition.id !== conditionId);
    updateField(fieldId, { conditions: updatedConditions });
  };

  const getAvailableTargetFields = (currentFieldId: string) => {
    return steps[activeStep].fields.filter(field => field.id !== currentFieldId);
  };

  const renderFieldSettings = (field: FormField) => {
    return (
      <div className="space-y-4">
        <div>
          <Label>Field Label</Label>
          <Input
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
          />
        </div>
        <div>
          <Label>Placeholder</Label>
          <Input
            value={field.placeholder || ''}
            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Required</Label>
          <Switch
            checked={field.required}
            onCheckedChange={(checked) => updateField(field.id, { required: checked })}
          />
        </div>
        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
          <div>
            <Label>Options</Label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option.label}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])];
                      newOptions[index] = { ...option, label: e.target.value };
                      updateField(field.id, { options: newOptions });
                    }}
                    placeholder="Option label"
                  />
                  <Input
                    value={option.value}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])];
                      newOptions[index] = { ...option, value: e.target.value };
                      updateField(field.id, { options: newOptions });
                    }}
                    placeholder="Option value"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newOptions = field.options?.filter((_, i) => i !== index);
                      updateField(field.id, { options: newOptions });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOptions = [...(field.options || []), { label: '', value: '' }];
                  updateField(field.id, { options: newOptions });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>
        )}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Conditional Logic</Label>
            <Button variant="outline" size="sm" onClick={() => addCondition(field.id)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </div>
          <div className="space-y-4">
            {field.conditions?.map((condition) => (
              <Card key={condition.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Select
                      value={condition.action}
                      onValueChange={(value) =>
                        updateCondition(field.id, condition.id, { action: value as 'show' | 'hide' })
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIONS.map(action => (
                          <SelectItem key={action.value} value={action.value}>
                            {action.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span>this field if</span>
                    <Select
                      value={condition.targetFieldId}
                      onValueChange={(value) =>
                        updateCondition(field.id, condition.id, { targetFieldId: value })
                      }
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableTargetFields(field.id).map(targetField => (
                          <SelectItem key={targetField.id} value={targetField.id}>
                            {targetField.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={condition.operator}
                      onValueChange={(value) =>
                        updateCondition(field.id, condition.id, {
                          operator: value as FormFieldCondition['operator']
                        })
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OPERATORS.map(operator => (
                          <SelectItem key={operator.value} value={operator.value}>
                            {operator.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={condition.value}
                      onChange={(e) =>
                        updateCondition(field.id, condition.id, { value: e.target.value })
                      }
                      placeholder="Value"
                      className="w-[200px]"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCondition(field.id, condition.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
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
                  <Select
                    value={steps[activeStep]?.layout}
                    onValueChange={(value) =>
                      updateStep(activeStep, { layout: value as FormStep['layout'] })
                    }
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">
                        <div className="flex items-center">
                          <LayoutGrid className="h-4 w-4 mr-2" />
                          Grid
                        </div>
                      </SelectItem>
                      <SelectItem value="columns">
                        <div className="flex items-center">
                          <Columns className="h-4 w-4 mr-2" />
                          Columns
                        </div>
                      </SelectItem>
                      <SelectItem value="rows">
                        <div className="flex items-center">
                          <Rows className="h-4 w-4 mr-2" />
                          Rows
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={steps[activeStep]?.alignment}
                    onValueChange={(value) =>
                      updateStep(activeStep, { alignment: value as FormStep['alignment'] })
                    }
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select alignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">
                        <div className="flex items-center">
                          <AlignLeft className="h-4 w-4 mr-2" />
                          Left
                        </div>
                      </SelectItem>
                      <SelectItem value="center">
                        <div className="flex items-center">
                          <AlignCenter className="h-4 w-4 mr-2" />
                          Center
                        </div>
                      </SelectItem>
                      <SelectItem value="right">
                        <div className="flex items-center">
                          <AlignRight className="h-4 w-4 mr-2" />
                          Right
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Add Fields</h3>
                  <div className="grid grid-cols-2 gap-2">
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
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Field Settings</h3>
                  {selectedField ? (
                    renderFieldSettings(
                      steps[activeStep].fields.find(f => f.id === selectedField)!
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Select a field to configure its settings
                    </p>
                  )}
                </div>
              </div>

              <div className={`grid gap-4 ${
                steps[activeStep]?.layout === 'grid' ? 'grid-cols-2' :
                steps[activeStep]?.layout === 'columns' ? 'grid-cols-3' : 'grid-cols-1'
              }`}>
                {steps[activeStep]?.fields.map((field) => (
                  <Card
                    key={field.id}
                    className={`relative cursor-pointer ${
                      selectedField === field.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedField(field.id)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeField(field.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <CardContent className="pt-8">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {FIELD_TYPES.find(t => t.id === field.type)?.icon}
                          </span>
                          <Input
                            value={field.label}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateField(field.id, { label: e.target.value });
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{field.type}</span>
                          {field.required && <span className="text-destructive">*</span>}
                          {field.conditions?.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Link2 className="h-3 w-3" />
                              {field.conditions.length} condition(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 