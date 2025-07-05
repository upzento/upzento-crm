'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  defaultValue?: string;
  validation?: Record<string, any>;
}

interface MultiStepFormRendererProps {
  formId: string;
  name: string;
  description?: string;
  steps: FormStep[];
  onSubmit: (data: any) => Promise<void>;
}

export const MultiStepFormRenderer: React.FC<MultiStepFormRendererProps> = ({
  formId,
  name,
  description,
  steps,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Generate schema for current step
  const generateStepSchema = (fields: FormField[]) => {
    const schema: Record<string, any> = {};
    
    fields.forEach((field) => {
      let fieldSchema = z.string();
      
      if (field.required) {
        fieldSchema = fieldSchema.min(1, `${field.label} is required`);
      } else {
        fieldSchema = fieldSchema.optional();
      }

      if (field.type === 'email') {
        fieldSchema = z.string().email('Invalid email address');
      } else if (field.type === 'number') {
        fieldSchema = z.number().or(z.string().regex(/^\d+$/).transform(Number));
      }

      schema[field.id] = fieldSchema;
    });

    return z.object(schema);
  };

  const currentStepSchema = generateStepSchema(steps[currentStep].fields);
  const form = useForm({
    resolver: zodResolver(currentStepSchema),
    defaultValues: steps[currentStep].fields.reduce((acc, field) => ({
      ...acc,
      [field.id]: field.defaultValue || '',
    }), {}),
  });

  const handleStepSubmit = async (data: any) => {
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    if (currentStep === steps.length - 1) {
      // Final step - submit the form
      await onSubmit(updatedFormData);
    } else {
      // Move to next step
      setCurrentStep(currentStep + 1);
    }
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      placeholder: field.placeholder,
      ...form.register(field.id),
    };

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            className="min-h-[100px]"
          />
        );

      case 'select':
        return (
          <Select
            {...commonProps}
            value={form.getValues(field.id)}
            onValueChange={(value) => form.setValue(field.id, value)}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup
            value={form.getValues(field.id)}
            onValueChange={(value) => form.setValue(field.id, value)}
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={form.getValues(field.id) === 'true'}
              onCheckedChange={(checked) =>
                form.setValue(field.id, checked ? 'true' : 'false')
              }
            />
            <Label htmlFor={field.id}>{field.label}</Label>
          </div>
        );

      default:
        return (
          <Input
            {...commonProps}
            type={field.type}
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
        <div className="flex items-center gap-2 mt-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${index !== 0 ? 'ml-2' : ''}`}
            >
              {index !== 0 && (
                <div className="h-px w-8 bg-border mx-2" />
              )}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  index < currentStep
                    ? 'bg-primary border-primary text-primary-foreground'
                    : index === currentStep
                    ? 'border-primary'
                    : 'border-border'
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">{steps[currentStep].title}</h3>
            {steps[currentStep].description && (
              <p className="text-sm text-muted-foreground mt-1">
                {steps[currentStep].description}
              </p>
            )}
          </div>

          <form onSubmit={form.handleSubmit(handleStepSubmit)} className="space-y-4">
            {steps[currentStep].fields.map((field) => (
              <div key={field.id} className="space-y-2">
                {field.type !== 'checkbox' && (
                  <Label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </Label>
                )}
                {renderField(field)}
                {form.formState.errors[field.id] && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {form.formState.errors[field.id]?.message as string}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button type="submit">
                {currentStep === steps.length - 1 ? (
                  'Submit'
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}; 