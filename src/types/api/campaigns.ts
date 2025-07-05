/**
 * Marketing campaigns module types
 */

export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'CANCELLED';
export type CampaignType = 'EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP';
export type MessageStatus = 'DRAFT' | 'QUEUED' | 'SENT' | 'DELIVERED' | 'OPENED' | 'CLICKED' | 'BOUNCED' | 'FAILED';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: CampaignType;
  status: CampaignStatus;
  scheduledAt?: string;
  sentAt?: string;
  segments: CampaignSegment[];
  analytics: CampaignAnalytics;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignSegment {
  id: string;
  name: string;
  description?: string;
  filter: Record<string, any>;
  contactCount: number;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignMessage {
  id: string;
  subject?: string;
  content: string;
  previewText?: string;
  fromName?: string;
  fromEmail?: string;
  fromPhone?: string;
  status: MessageStatus;
  campaignId: string;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignTemplate {
  id: string;
  name: string;
  description?: string;
  type: CampaignType;
  content: string;
  thumbnail?: string;
  isDefault: boolean;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignAnalytics {
  id: string;
  campaignId: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  complaints: number;
  revenue?: number;
  updatedAt: string;
}

export interface ABTest {
  id: string;
  name: string;
  description?: string;
  status: 'DRAFT' | 'RUNNING' | 'COMPLETED';
  variants: ABTestVariant[];
  winningVariantId?: string;
  testPercentage: number;
  testDuration: number;
  metric: 'OPEN_RATE' | 'CLICK_RATE' | 'CONVERSION_RATE' | 'REVENUE';
  campaignId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ABTestVariant {
  id: string;
  name: string;
  content: string;
  subject?: string;
  previewText?: string;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue?: number;
  abTestId: string;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description?: string;
  trigger: AutomationTrigger;
  steps: AutomationStep[];
  isActive: boolean;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationTrigger {
  type: 'EVENT' | 'SCHEDULE' | 'SEGMENT_ENTRY';
  config: Record<string, any>;
}

export interface AutomationStep {
  id: string;
  type: 'SEND_EMAIL' | 'SEND_SMS' | 'WAIT' | 'CONDITION' | 'ACTION';
  config: Record<string, any>;
  position: number;
  nextSteps: string[];
  workflowId: string;
} 