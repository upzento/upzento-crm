'use client';

import React, { useEffect, useState } from 'react';
import { MultiStepFormRenderer } from './multi-step-form-renderer';
import { formService } from '@/lib/services/form-service';

interface FormEmbedProps {
  formId: string;
  mode?: 'preview' | 'embed';
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
  };
}

export const FormEmbed: React.FC<FormEmbedProps> = ({
  formId,
  mode = 'embed',
  theme = {},
}) => {
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForm = async () => {
      try {
        // In embed mode, verify domain before loading form
        if (mode === 'embed') {
          const domain = window.location.hostname;
          const isVerified = await formService.checkDomainVerification(formId, domain);
          if (!isVerified) {
            throw new Error('Domain not verified');
          }
        }

        // Load form data
        const response = await formService.get(`/forms/${formId}`);
        setForm(response);
      } catch (error) {
        console.error('Error loading form:', error);
        setError(error instanceof Error ? error.message : 'Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId, mode]);

  // Generate dynamic styles based on theme
  const styles = {
    '--primary-color': theme.primaryColor || '#0066cc',
    '--background-color': theme.backgroundColor || '#ffffff',
    '--text-color': theme.textColor || '#000000',
    '--border-radius': theme.borderRadius || '4px',
  } as React.CSSProperties;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-destructive">
        <p>{error}</p>
        {mode === 'embed' && error === 'Domain not verified' && (
          <p className="text-sm mt-2">
            Please verify your domain in the form settings to embed this form.
          </p>
        )}
      </div>
    );
  }

  if (!form) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Form not found
      </div>
    );
  }

  return (
    <div
      className="form-embed"
      style={styles}
      data-mode={mode}
      data-form-id={formId}
    >
      <style jsx global>{`
        .form-embed {
          --shadow-color: color-mix(in srgb, var(--primary-color) 10%, transparent);
          
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          font-family: system, -apple-system, sans-serif;
        }

        .form-embed[data-mode="preview"] {
          max-width: 100%;
        }

        .form-embed input,
        .form-embed textarea,
        .form-embed select {
          border-radius: var(--border-radius);
          border-color: color-mix(in srgb, var(--text-color) 20%, transparent);
        }

        .form-embed input:focus,
        .form-embed textarea:focus,
        .form-embed select:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px var(--shadow-color);
        }

        .form-embed button {
          background-color: var(--primary-color);
          border-radius: var(--border-radius);
        }

        .form-embed button:hover {
          background-color: color-mix(in srgb, var(--primary-color) 90%, black);
        }

        .form-embed label {
          color: var(--text-color);
        }

        .form-embed .text-destructive {
          color: #ef4444;
        }
      `}</style>

      <MultiStepFormRenderer
        formId={formId}
        steps={form.steps}
        onSubmit={async (data) => {
          if (mode === 'preview') {
            console.log('Preview mode - Form data:', data);
            return;
          }

          try {
            const response = await formService.submitForm({
              formId,
              data,
              metadata: {
                source: mode,
                url: window.location.href,
                userAgent: navigator.userAgent,
                submittedAt: new Date().toISOString(),
              },
            });

            // Handle redirect if configured
            if (response.redirectUrl) {
              window.location.href = response.redirectUrl;
            }

            // Handle success message
            if (response.successMessage) {
              // You might want to show this in a better way
              alert(response.successMessage);
            }
          } catch (error) {
            console.error('Form submission error:', error);
            alert('Failed to submit form. Please try again.');
          }
        }}
      />
    </div>
  );
}; 