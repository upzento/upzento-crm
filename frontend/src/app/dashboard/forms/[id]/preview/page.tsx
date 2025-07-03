'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

// Mock form data for development
const mockForm = {
  id: '123',
  name: 'Contact Form',
  description: 'Simple contact form for website',
  status: 'ACTIVE',
  settings: {
    theme: 'cosmic',
    primaryColor: '#3498db',
    secondaryColor: '#2ecc71',
    fontFamily: 'Inter, sans-serif',
    submitButtonText: 'Submit',
    showProgressBar: true,
  },
  steps: [
    {
      id: 'step-1',
      title: 'Contact Information',
      description: 'Please provide your contact details',
      fields: [
        {
          id: 'field-1',
          type: 'TEXT',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          helpText: 'Please enter your first and last name',
          isRequired: true,
          order: 0,
        },
        {
          id: 'field-2',
          type: 'EMAIL',
          label: 'Email Address',
          placeholder: 'Enter your email address',
          helpText: 'We\'ll never share your email with anyone else',
          isRequired: true,
          order: 1,
        },
        {
          id: 'field-3',
          type: 'PHONE',
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          isRequired: false,
          order: 2,
        },
      ],
    },
    {
      id: 'step-2',
      title: 'Your Message',
      description: 'Tell us how we can help you',
      fields: [
        {
          id: 'field-4',
          type: 'SELECT',
          label: 'Subject',
          placeholder: 'Select a subject',
          isRequired: true,
          order: 0,
          options: [
            { label: 'General Inquiry', value: 'general' },
            { label: 'Technical Support', value: 'support' },
            { label: 'Billing Question', value: 'billing' },
            { label: 'Feature Request', value: 'feature' },
          ],
        },
        {
          id: 'field-5',
          type: 'TEXTAREA',
          label: 'Message',
          placeholder: 'Enter your message here',
          helpText: 'Please provide as much detail as possible',
          isRequired: true,
          order: 1,
        },
        {
          id: 'field-6',
          type: 'CHECKBOX',
          label: 'Subscribe to Newsletter',
          isRequired: false,
          order: 2,
          options: [
            { label: 'Yes, I want to receive updates', value: 'yes' },
          ],
        },
      ],
    },
  ],
};

export default function FormPreviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState(mockForm);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [previewMode, setPreviewMode] = useState('desktop');
  
  // Function to handle form field changes
  const handleFieldChange = (fieldId, value) => {
    setFormData({
      ...formData,
      [fieldId]: value,
    });
  };
  
  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted with data: ' + JSON.stringify(formData, null, 2));
  };
  
  // Function to navigate to next step
  const handleNextStep = () => {
    if (activeStep < form.steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };
  
  // Function to navigate to previous step
  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/forms')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Forms
          </Button>
          <h1 className="text-3xl font-bold">Preview: {form.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/forms/${params.id}/edit`)}>
            Edit Form
          </Button>
          <Button onClick={() => router.push(`/dashboard/forms/${params.id}/embed`)}>
            <Code className="h-4 w-4 mr-1" /> Embed Form
          </Button>
        </div>
      </div>
      
      {/* Preview Controls */}
      <div className="flex justify-center mb-6">
        <Tabs value={previewMode} onValueChange={setPreviewMode} className="w-[400px]">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="desktop">Desktop</TabsTrigger>
            <TabsTrigger value="tablet">Tablet</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Form Preview */}
      <div className="flex justify-center">
        <div 
          className={`bg-white border rounded-md shadow-lg overflow-hidden transition-all duration-300 ${
            previewMode === 'desktop' ? 'w-[800px]' : 
            previewMode === 'tablet' ? 'w-[600px]' : 'w-[360px]'
          }`}
        >
          {/* Form Header */}
          <div 
            className="p-6 border-b" 
            style={{ 
              backgroundColor: form.settings.primaryColor,
              color: '#ffffff',
            }}
          >
            <h2 className="text-2xl font-bold">{form.name}</h2>
            {form.description && <p className="mt-2 opacity-90">{form.description}</p>}
          </div>
          
          {/* Progress Bar (for multi-step forms) */}
          {form.settings.showProgressBar && form.steps.length > 1 && (
            <div className="px-6 pt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="h-2.5 rounded-full" 
                  style={{ 
                    width: `${((activeStep + 1) / form.steps.length) * 100}%`,
                    backgroundColor: form.settings.secondaryColor,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Step {activeStep + 1} of {form.steps.length}</span>
                <span>{form.steps[activeStep].title}</span>
              </div>
            </div>
          )}
          
          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              {/* Step Title and Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold">{form.steps[activeStep].title}</h3>
                {form.steps[activeStep].description && (
                  <p className="text-gray-600 mt-1">{form.steps[activeStep].description}</p>
                )}
              </div>
              
              {/* Form Fields */}
              <div className="space-y-6">
                {form.steps[activeStep].fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="block text-sm font-medium">
                      {field.label}
                      {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {/* Field Input based on type */}
                    {field.type === 'TEXT' && (
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        required={field.isRequired}
                      />
                    )}
                    
                    {field.type === 'EMAIL' && (
                      <input
                        type="email"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        required={field.isRequired}
                      />
                    )}
                    
                    {field.type === 'PHONE' && (
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        required={field.isRequired}
                      />
                    )}
                    
                    {field.type === 'TEXTAREA' && (
                      <textarea
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder={field.placeholder}
                        rows={4}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        required={field.isRequired}
                      />
                    )}
                    
                    {field.type === 'SELECT' && (
                      <select
                        className="w-full px-3 py-2 border rounded-md"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        required={field.isRequired}
                      >
                        <option value="">{field.placeholder || 'Select an option'}</option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {field.type === 'CHECKBOX' && (
                      <div className="space-y-2">
                        {field.options.map((option) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`${field.id}-${option.value}`}
                              className="rounded border-gray-300"
                              checked={formData[field.id]?.includes(option.value) || false}
                              onChange={(e) => {
                                const currentValues = formData[field.id] || [];
                                const newValues = e.target.checked
                                  ? [...currentValues, option.value]
                                  : currentValues.filter(v => v !== option.value);
                                handleFieldChange(field.id, newValues);
                              }}
                              required={field.isRequired && field.options.length === 1}
                            />
                            <label htmlFor={`${field.id}-${option.value}`} className="ml-2 text-sm">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Help Text */}
                    {field.helpText && (
                      <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Form Navigation */}
            <div className="px-6 pb-6 flex justify-between">
              {activeStep > 0 ? (
                <Button type="button" variant="outline" onClick={handlePrevStep}>
                  Previous
                </Button>
              ) : (
                <div></div>
              )}
              
              {activeStep < form.steps.length - 1 ? (
                <Button type="button" onClick={handleNextStep}>
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit"
                  style={{ 
                    backgroundColor: form.settings.primaryColor,
                  }}
                >
                  {form.settings.submitButtonText || 'Submit'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      {/* External Preview Link */}
      <div className="flex justify-center mt-6">
        <Button variant="outline" onClick={() => window.open(`https://upzento.com/embed/forms/${params.id}`, '_blank')}>
          <ExternalLink className="h-4 w-4 mr-2" /> Open in New Tab
        </Button>
      </div>
      
      {/* Preview Note */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>This is a preview of how your form will appear to users. Form submissions in preview mode are not saved.</p>
      </div>
    </div>
  );
} 