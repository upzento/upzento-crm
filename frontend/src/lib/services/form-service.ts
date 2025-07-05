import { ApiClient } from '@/lib/api/api-client';

export interface FormSubmissionData {
  formId: string;
  data: Record<string, any>;
  captchaToken?: string;
  contactId?: string;
  dealId?: string;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    submittedAt?: string;
    source?: string;
    url?: string;
  };
}

export interface FormWebhook {
  id: string;
  url: string;
  secret?: string;
  events: string[];
  active: boolean;
}

export interface FormDomain {
  id: string;
  domain: string;
  verified: boolean;
  verificationToken?: string;
}

class FormService {
  private api: ApiClient;

  constructor() {
    this.api = new ApiClient();
  }

  // Form Management
  async get(formId: string) {
    try {
      const response = await this.api.get(`/forms/${formId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch form');
    }
  }

  async create(data: any) {
    try {
      const response = await this.api.post('/forms', data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create form');
    }
  }

  async update(formId: string, data: any) {
    try {
      const response = await this.api.patch(`/forms/${formId}`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update form');
    }
  }

  async delete(formId: string) {
    try {
      await this.api.delete(`/forms/${formId}`);
    } catch (error) {
      throw new Error('Failed to delete form');
    }
  }

  async duplicate(formId: string) {
    try {
      const response = await this.api.post(`/forms/${formId}/duplicate`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to duplicate form');
    }
  }

  // Form Submission
  async submitForm(data: FormSubmissionData) {
    try {
      // Validate CAPTCHA token if provided
      if (data.captchaToken) {
        await this.verifyCaptcha(data.captchaToken);
      }

      // Submit form data
      const response = await this.api.post('/forms/submit', data);

      // Create contact if enabled
      if (response.data.createContact) {
        await this.createContactFromSubmission(response.data);
      }

      // Create deal if enabled
      if (response.data.createDeal) {
        await this.createDealFromSubmission(response.data);
      }

      // Trigger webhooks
      await this.triggerWebhooks(data.formId, 'submission_created', response.data);

      return response.data;
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  }

  // CAPTCHA Verification
  private async verifyCaptcha(token: string) {
    try {
      const response = await this.api.post('/forms/verify-captcha', { token });
      return response.data;
    } catch (error) {
      throw new Error('CAPTCHA verification failed');
    }
  }

  // Domain Verification
  async verifyDomain(formId: string, domain: string) {
    try {
      // Request verification token
      const response = await this.api.post(`/forms/${formId}/domains/verify`, {
        domain,
      });

      return response.data;
    } catch (error) {
      throw new Error('Domain verification failed');
    }
  }

  async checkDomainVerification(formId: string, domain: string) {
    try {
      const response = await this.api.get(
        `/forms/${formId}/domains/${domain}/status`
      );
      return response.data.verified;
    } catch (error) {
      return false;
    }
  }

  // Webhook Management
  async addWebhook(formId: string, webhook: Omit<FormWebhook, 'id'>) {
    try {
      const response = await this.api.post(`/forms/${formId}/webhooks`, webhook);
      return response.data;
    } catch (error) {
      throw new Error('Failed to add webhook');
    }
  }

  async removeWebhook(formId: string, webhookId: string) {
    try {
      await this.api.delete(`/forms/${formId}/webhooks/${webhookId}`);
    } catch (error) {
      throw new Error('Failed to remove webhook');
    }
  }

  private async triggerWebhooks(
    formId: string,
    event: string,
    data: Record<string, any>
  ) {
    try {
      await this.api.post(`/forms/${formId}/webhooks/trigger`, {
        event,
        data,
      });
    } catch (error) {
      console.error('Failed to trigger webhooks:', error);
    }
  }

  // Contact Integration
  private async createContactFromSubmission(submissionData: Record<string, any>) {
    try {
      const contact = {
        name: submissionData.data.name,
        email: submissionData.data.email,
        phone: submissionData.data.phone,
        source: 'form',
        formId: submissionData.formId,
        submissionId: submissionData.id,
      };

      const response = await this.api.post('/contacts', contact);
      return response.data;
    } catch (error) {
      console.error('Failed to create contact:', error);
    }
  }

  // Deal Integration
  private async createDealFromSubmission(submissionData: Record<string, any>) {
    try {
      const deal = {
        title: `Form Submission - ${submissionData.data.name}`,
        value: submissionData.data.value,
        source: 'form',
        formId: submissionData.formId,
        submissionId: submissionData.id,
        contactId: submissionData.contactId,
      };

      const response = await this.api.post('/deals', deal);
      return response.data;
    } catch (error) {
      console.error('Failed to create deal:', error);
    }
  }

  // Form Analytics
  async trackFormView(formId: string) {
    try {
      await this.api.post(`/forms/${formId}/analytics/view`, {
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to track form view:', error);
    }
  }

  async trackFormSubmission(formId: string, data: Record<string, any>) {
    try {
      await this.api.post(`/forms/${formId}/analytics/submission`, {
        timestamp: new Date().toISOString(),
        data,
      });
    } catch (error) {
      console.error('Failed to track form submission:', error);
    }
  }

  // Form Embedding
  getEmbedCode(formId: string, options: { width?: string; height?: string } = {}) {
    const width = options.width || '100%';
    const height = options.height || '600px';
    
    return `<iframe
  src="${process.env.NEXT_PUBLIC_APP_URL}/embed/forms/${formId}"
  width="${width}"
  height="${height}"
  style="border: none; border-radius: 4px;"
  title="Form"
></iframe>`;
  }

  getEmbedScript(formId: string) {
    return `<script src="${process.env.NEXT_PUBLIC_APP_URL}/embed/forms/${formId}/script.js"></script>`;
  }
}

export const formService = new FormService(); 