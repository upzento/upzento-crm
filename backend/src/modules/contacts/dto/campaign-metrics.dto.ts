import { ApiProperty } from '@nestjs/swagger';

export class CampaignMetricsDto {
  @ApiProperty({ description: 'Total number of contacts in the campaign' })
  totalContacts: number;

  @ApiProperty({ description: 'Number of contacts who completed the campaign' })
  completedContacts: number;

  @ApiProperty({ description: 'Number of contacts currently in progress' })
  inProgressContacts: number;

  @ApiProperty({ description: 'Number of contacts who haven\'t started' })
  pendingContacts: number;

  @ApiProperty({ description: 'Average time to complete the campaign (in days)' })
  averageCompletionTime?: number;

  @ApiProperty({ description: 'Success rate of the campaign' })
  successRate: number;

  @ApiProperty({ description: 'Metrics per step' })
  stepMetrics: {
    stepIndex: number;
    completed: number;
    pending: number;
    failed: number;
    averageTimeToComplete?: number;
  }[];

  @ApiProperty({ description: 'Conversion metrics' })
  conversionMetrics: {
    totalConversions: number;
    conversionRate: number;
    revenueGenerated?: number;
  };

  @ApiProperty({ description: 'Engagement metrics' })
  engagementMetrics: {
    emailOpenRate?: number;
    emailClickRate?: number;
    smsResponseRate?: number;
    taskCompletionRate?: number;
  };
} 