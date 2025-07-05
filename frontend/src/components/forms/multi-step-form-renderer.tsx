'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { formService } from '@/lib/services/form-service';
import { toast } from '@/components/ui/use-toast';
import Script from 'next/script';

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

interface MultiStepFormRendererProps {
  formId: string;
  steps: FormStep[];
  onSubmit: (data: any) => void;
}

export const MultiStepFormRenderer: React.FC<MultiStepFormRendererProps> = ({
  formId,
  steps,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const currentFields = steps[currentStep].fields;
    const newErrors: Record<string, string> = {};

    currentFields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = 'This field is required';
      }

      if (field.type === 'email' && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.id])) {
          newErrors[field.id] = 'Please enter a valid email address';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      try {
        // Submit form data
        const response = await formService.submitForm({
          formId,
          data: formData,
          metadata: {
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            submittedAt: new Date().toISOString(),
          },
        });

        // Show success message
        toast({
          title: 'Success',
          description: 'Form submitted successfully!',
        });

        // Handle redirect if configured
        if (response.redirectUrl) {
          window.location.href = response.redirectUrl;
        }

        onSubmit(response);
      } catch (error) {
        console.error('Form submission error:', error);
        toast({
          title: 'Error',
          description: 'Failed to submit form. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
          />
        );
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
          />
        );
      case 'select':
        return (
          <Select
            value={formData[field.id] || ''}
            onValueChange={(value) => setFormData({ ...formData, [field.id]: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'radio':
        return (
          <RadioGroup
            value={formData[field.id] || ''}
            onValueChange={(value) => setFormData({ ...formData, [field.id]: value })}
          >
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option.value}`}
                  checked={formData[field.id]?.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = formData[field.id] || [];
                    const newValues = checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    setFormData({ ...formData, [field.id]: newValues });
                  }}
                />
                <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
      />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              {steps[currentStep].description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {steps[currentStep].description}
                </p>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-6 ${
            steps[currentStep].layout === 'grid' ? 'grid-cols-2' :
            steps[currentStep].layout === 'columns' ? 'grid-cols-3' : 'grid-cols-1'
          }`}>
            {steps[currentStep].fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label>
                  {field.label}
                  {field.required && <span className="text-destructive">*</span>}
                </Label>
                {renderField(field)}
                {errors[field.id] && (
                  <p className="text-sm text-destructive">{errors[field.id]}</p>
                )}
              </div>
            ))}
          </div>

          <div className={`flex mt-6 ${
            steps[currentStep].alignment === 'center' ? 'justify-center' :
            steps[currentStep].alignment === 'right' ? 'justify-end' : 'justify-start'
          }`}>
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Submit
                <Send className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}; 