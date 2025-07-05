'use client'

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select } from '../ui/select';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';

interface FormField {
  id: string;
  label: string;
  type: string;
  isRequired: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  validation?: Record<string, any>;
}

interface FormRendererProps {
  formId: string;
  name: string;
  description?: string;
  fields: FormField[];
  onSubmit: (data: any) => Promise<void>;
}

export const FormRenderer: React.FC<FormRendererProps> = ({
  formId,
  name,
  description,
  fields,
  onSubmit,
}) => {
  // Dynamically generate zod schema based on fields
  const generateSchema = () => {
    const schema: Record<string, any> = {};
    
    fields.forEach((field) => {
      let fieldSchema = z.string();
      
      if (field.isRequired) {
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

  const formSchema = generateSchema();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce((acc, field) => ({
      ...acc,
      [field.id]: field.defaultValue || '',
    }), {}),
  });

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
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
              <option key={option} value={option}>
                {option}
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
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
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
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              {field.type !== 'checkbox' && (
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.isRequired && <span className="text-red-500">*</span>}
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
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 